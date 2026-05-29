import librosa
import numpy as np
import requests

# Base URL for local Spring Boot server
API_BASE_URL = "http://localhost:8080/api"

def extract_frequencies(file_path):
    print(f"Loading audio file: {file_path}...")
    y, sr = librosa.load(file_path, sr=None)
    
    print("Analyzing pitch...")
    f0, voiced_flag, _ = librosa.pyin(
        y, 
        fmin=librosa.note_to_hz('C2'), 
        fmax=librosa.note_to_hz('C6')
    )

    valid_frequencies = f0[voiced_flag]
    if len(valid_frequencies) == 0:
        print("No clear pitch detected.")
        return []
    
    return valid_frequencies

def convert_to_intervals(frequencies):
    print("Quantizing frequencies to quarter-tones...")
    midi_floats = librosa.hz_to_midi(frequencies)
    quarter_tones = np.round(midi_floats * 2).astype(int)
    
    distinct_notes = []
    for qt in quarter_tones:
        if len(distinct_notes) == 0 or qt != distinct_notes[-1]:
            distinct_notes.append(qt)
            
    intervals = []
    for i in range(1, len(distinct_notes)):
        step = distinct_notes[i] - distinct_notes[i-1]
        if 0 < step <= 6: 
            intervals.append(step)

    return intervals

def find_maqam_from_api(interval_list):
    # convert the list [4, 3, 3] to a string "4,3,3"
    interval_string = ",".join(map(str, interval_list))
    print(f"\n📡 Sending Interval String '{interval_string}' to Java API...")

    # search for the Jins
    jins_response = requests.get(f"{API_BASE_URL}/ajnas/search?intervals={interval_string}")
    
    if jins_response.status_code == 404:
        print("404: No matching Jins found for these intervals.")
        return
    
    jins_data = jins_response.json()
    jins_id = jins_data['id']
    jins_name = jins_data['name']
    
    print(f"Found Base Jins: {jins_name} (ID: {jins_id})")

    # search for Maqamat that use this Jins as their lower root
    print(f"Searching for Maqamat starting with {jins_name}...")
    maqam_response = requests.get(f"{API_BASE_URL}/maqams/search/lower-jins?id={jins_id}")

    if maqam_response.status_code == 404:
        print("404: No Maqamat found using this root Jins.")
        return
        
    maqam_data = maqam_response.json()
    
    print("\n====================================")
    print(f"ANALYSIS COMPLETE! Possible Maqamat:")
    print("======================================")
    for maqam in maqam_data:
        print(f"- Maqam {maqam['name']} (Family: {maqam['familyName']})")
        print(f"  Root: {maqam['tonicPitch']['arabicName']} | Upper Jins: {maqam['upperJins']['name']}")
    print("======================================")

if __name__ == "__main__":
    #simulate the Oud playing Jins Rast
    print("--- Simulating an Oud playing Jins Rast ---")
    mock_frequencies = np.array([261.63, 261.63, 293.66, 293.66, 311.13, 311.13, 349.23])
    
    intervals = convert_to_intervals(mock_frequencies)
    
    # Trigger the bridge to Java
    if intervals:
        find_maqam_from_api(intervals)