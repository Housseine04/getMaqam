import librosa
import numpy as np
import itertools
import os
import requests
import torch
import torchcrepe

# Base URL for Spring Boot server (Docker internal service or configurable via env)
API_BASE_URL = os.getenv("API_BASE_URL", "http://getmaqam-backend:8080/api")


# In-Memory Cache for Ajnas and Maqamat
AJNAS_CACHE = {}    # Key: "3,3,4", Value: Jins JSON object
MAQAMAT_CACHE = {}  # Key: lower_jins_id, Value: List of Maqam JSON objects

#Solfege names mapping
SOLFEGE_MAP = [
    "Do",             # 0  (C)
    "Do 1/4 ♯",          # 1
    "Do ♯",           # 2  (C#)
    "Ré 1/4 ♭",          # 3
    "Ré",             # 4  (D)
    "Ré 1/4 ♯",          # 5
    "Ré ♯",           # 6  (D#)
    "Mi 1/2 ♭",          # 7  (E half-flat / Sikah)
    "Mi",             # 8  (E)
    "Mi 1/4 ♯",          # 9
    "Fa",             # 10 (F)
    "Fa 1/4 ♯",          # 11
    "Fa ♯",           # 12 (F#)
    "Sol 1/4 ♭",         # 13
    "Sol",            # 14 (G)
    "Sol 1/4 ♯",         # 15
    "Sol ♯",          # 16 (G#)
    "La 1/2 ♭",          # 17 (A half-flat)
    "La",             # 18 (A)
    "La 1/4 ♯",          # 19
    "Si ♭",           # 20 (Bb)
    "Si 1/2 ♭",          # 21 (B half-flat / Auj)
    "Si",             # 22 (B)
    "Do 1/4 ♭"           # 23
]


def extract_frequencies(file_path):
    print(f"Loading audio file: {file_path}...")
    
    # CREPE architecture expects 16000 Hz
    y, sr = librosa.load(file_path, sr=16000)
    
    device = 'cpu'
    print(f"Analyzing pitch using Neural Network (CREPE) on {device}...")
    
    # Convert numpy array to PyTorch tensor and reshape [channels, samples]
    audio_tensor = torch.tensor(y).unsqueeze(0)
    
    # CREPE RUN

    # We extract both the frequencies (f0) and the confidence/periodicity (pd)
    f0, pd = torchcrepe.predict(
        audio_tensor,
        sr,
        hop_length=512,           # Keep 512 for execution speed
        fmin=librosa.note_to_hz('C2'),
        fmax=librosa.note_to_hz('C6'),
        model='full',             # change with 'tiny' if CPU execution is too slow
        batch_size=2048,          # Batched for memory efficiency
        device=device,
        return_harmonicity=True
    )
    
    # Convert back to flat numpy arrays
    f0_np = f0.squeeze().cpu().numpy()
    pd_np = pd.squeeze().cpu().numpy()
    
    #FILTER BY CONFIDENCE

    # CREPE returns a continuous track (no zeros). We must mask out the silence/noise.
    # 0.5 is a solid baseline. Increase to 0.7 if the NMS Janitor picks up too much noise.

    confidence_threshold = 0.5
    valid_frequencies = f0_np[pd_np > confidence_threshold]
    
    if len(valid_frequencies) == 0:
        print("No clear pitch detected by neural network.")
        return []
    
    return valid_frequencies

def analyze_audio_pipeline(frequencies):
    print("\n=========================================")
    print("        NEW ANALYSIS PIPELINE            ")
    print("=========================================")
    midi_floats = librosa.hz_to_midi(frequencies)
    quarter_tones = np.round(midi_floats * 2).astype(int)
    
    # Filter for stability
    stable_notes = []
    current_note = None
    consecutive_count = 0
    STABILITY_THRESHOLD = 2
    
    for qt in quarter_tones:
        if qt == current_note:
            consecutive_count += 1
            if consecutive_count == STABILITY_THRESHOLD:
                stable_notes.append(qt)
        else:
            current_note = qt
            consecutive_count = 1
            
    if not stable_notes:
        return {"error": "No stable pitches detected."}

    # THE "TOP 11" WITH CLUSTER MERGING (NMS)
    pitch_count = np.bincount(np.array(stable_notes) % 24, minlength=24)
    total_notes = len(stable_notes)

    # Calculate percentages for all 24 quarter-tones
    note_percentages = [(i, (pitch_count[i] / total_notes) * 100) for i in range(24)]

    # Sort notes by how often they were played (highest to lowest)
    note_percentages.sort(key=lambda x: x[1], reverse=True)

    all_pitch_classes = []
    used_buckets = set()

    for pc, percent in note_percentages:
        # Enforce a 1.5% minimum floor so we don't pick up silence
        if percent < 1.5:
            continue
            
        # Stop once we have enough distinct structural notes to cover 2 octaves
        if len(all_pitch_classes) >= 11:
            break
            
        # NON-MAXIMUM SUPPRESSION (NMS) : Delete vibrato bleed
        if pc not in used_buckets:
            all_pitch_classes.append(pc)
            used_buckets.add(pc)
            used_buckets.add((pc + 1) % 24)
            used_buckets.add((pc - 1) % 24)

    # Sort them back into numerical order for the combinatorial scanner
    all_pitch_classes = np.array(sorted(all_pitch_classes))
    print(f"Filtered Significant Notes (De-clustered): {all_pitch_classes}")

    # FIND THE RESOLVING NOTE for Maqam heuristic 

    final_resolving_note = None
    for qt in reversed(stable_notes):
        pc = qt % 24
        if pc in all_pitch_classes:
            final_resolving_note = pc
            break
            
    print(f"Detected Final Resolving Note (Destination): {final_resolving_note}")

    # ---------------------------
    valid_results = []
    found_dna_signatures = set()

    # THE SLIDING WINDOW DNA SCANNER

    # Duplicate the array up an octave to handle scales that wrap around 24 back to 0
    extended_classes = list(all_pitch_classes) + [pc + 24 for pc in all_pitch_classes]

    print("\n Scanning for Maqam DNA (Ajnas Intervals)...")
    
    # Test every single surviving note as a potential starting point for a Jins
    for i, root_note in enumerate(all_pitch_classes):
        
        # Grab up to the next 9 notes ahead of this root to form combinations
        window = extended_classes[i+1 : i+10]
        match_found = False
        
        # We dynamically check for Pentachords (4 notes added), Tetrachords (3), and Trichords (2)
        for combo_size in [4, 3, 2]:
            if match_found:
                break
                
            for combo in itertools.combinations(window, combo_size):
                test_scale = [root_note] + list(combo)
                
                # Calculate the exact intervals of this specific combination
                intervals = [test_scale[j] - test_scale[j-1] for j in range(1, len(test_scale))]
                interval_string = ",".join(map(str, intervals))
                
                # Instantly check if this exact interval DNA exists in the database
                if interval_string in AJNAS_CACHE:
                    jins_data = AJNAS_CACHE[interval_string]
                    
                    # Prevent logging the exact same Jins on the exact same root multiple times
                    signature = f"{jins_data['name']}_on_{root_note}"
                    if signature in found_dna_signatures:
                        continue
                    found_dna_signatures.add(signature)
                    
                    print(f"DNA MATCH: {jins_data['name']} '{interval_string}' rooted on {root_note}")
                    
                    # THE SCORING SYSTEM
                    # Score is now the cumulative physical audio weight of the specific notes in this Jins
                    base_score = 0
                    for note in test_scale:
                        base_score += (pitch_count[note % 24] / total_notes) * 100
                        
                    # THE HUMAN LISTENER heuristic : Only applied if the root of this DNA is where the player rested
                    if root_note == final_resolving_note:
                        print(f"Root {root_note} matches destination! Applying 2.5x Resolution Bonus.")
                        base_score *= 2.5
                    
                    possible_maqamat = MAQAMAT_CACHE.get(jins_data['id'], [])
                    
                    
                    # NEW: Get the human-readable note name
                    solfege_name = SOLFEGE_MAP[int(root_note) % 24]
                    
                    valid_results.append({
                        "hypothesized_tonic_id": int(root_note),
                        "root_solfege": solfege_name,         # <-- The new string for the UI
                        "confidence_score": base_score,
                        "base_jins": jins_data['name'],
                        "possible_maqamat": possible_maqamat
                    })
                    
                    match_found = True
                    break # DNA extracted! Move to the next starting note.

    # AGGREGATE IDENTICAL MAQAMAT
    aggregated_results = {}
    
    for res in valid_results:
        name = res["base_jins"]
        if name in aggregated_results:
            # Sum the confidence scores for Maqamat found multiple times across the audio
            aggregated_results[name]["confidence_score"] += res["confidence_score"]
        else:
            aggregated_results[name] = res.copy()
            
    merged_results = list(aggregated_results.values())
    
    # Round the final cumulative scores and sort them from highest to lowest
    for res in merged_results:
        res["confidence_score"] = round(res["confidence_score"], 2)
        
    merged_results.sort(key=lambda x: x['confidence_score'], reverse=True)

    if len(merged_results) > 0:
        # Calculate the total sum of all raw confidence scores
        total_score = sum(res["confidence_score"] for res in merged_results)
        
        if total_score > 0:
            # Divide each individual score by the total sum
            for res in merged_results:
                normalized = (res["confidence_score"] / total_score) * 100
                res["confidence_score"] = round(normalized, 1)
                
    # Last sort
    merged_results.sort(key=lambda x: x['confidence_score'], reverse=True)
    
    if len(merged_results) == 0:
        return {"error": "Audio does not match any known Arabic Maqam structure."}
        
    return {
        "status": "success",
        "matches_found": len(merged_results),
        "results": merged_results
    }