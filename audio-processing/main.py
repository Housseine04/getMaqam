#using FastAPI to listen for audio files coming from React app, then pass them to analyzer

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import requests
from contextlib import asynccontextmanager
import analyzer
from analyzer import analyze_audio_pipeline, AJNAS_CACHE, MAQAMAT_CACHE, API_BASE_URL
import numpy as np
import soundfile as sf


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Booting up: Fetching database into local memory...")
    try:
        # Fetch and map all Ajnas by their interval strings
        ajnas_resp = requests.get(f"{API_BASE_URL}/ajnas", timeout=5.0)
        if ajnas_resp.status_code == 200:
            for jins in ajnas_resp.json():
                # Convert [3, 3, 4] to string "3,3,4" for easy dictionary keys
                interval_str = ",".join(map(str, jins['intervalsInQuarterTones']))
                AJNAS_CACHE[interval_str] = jins

        # Fetch and map all Maqamat by their Lower Jins ID
        maqamat_resp = requests.get(f"{API_BASE_URL}/maqams", timeout=5.0)
        if maqamat_resp.status_code == 200:
            for maqam in maqamat_resp.json():
                jins_id = maqam['lowerJins']['id']
                if jins_id not in MAQAMAT_CACHE:
                    MAQAMAT_CACHE[jins_id] = []
                MAQAMAT_CACHE[jins_id].append(maqam)
                
        print(f"Cache Loaded: {len(AJNAS_CACHE)} Ajnas, {len(MAQAMAT_CACHE)} Maqamat grouping definitions.")
    except Exception as e:
        print(f"Warning: Could not reach Java API to populate cache: {e}")
    
    # COLD START COUNTER
    print("Warming up DSP Engine (Compiling Librosa JIT)... this may take a few seconds.")
    try:
        # Generate 0.5 seconds of a 440Hz "A" note
        sample_rate = 22050
        t = np.linspace(0, 0.5, int(sample_rate * 0.5), endpoint=False)
        dummy_audio = np.random.uniform(-1.0, 1.0, int(sample_rate * 1.5)).astype(np.float32)
        
        # Save it to a dummy file
        warmup_file = "warmup_dummy.wav"
        sf.write(warmup_file, dummy_audio, sample_rate)
        
        # Force the pipeline to process it, triggering compilation 
        frequencies = analyzer.extract_frequencies(warmup_file)
        if len(frequencies) > 0:
            analyze_audio_pipeline(frequencies)
        
        # Clean up the dummy file
        if os.path.exists(warmup_file):
            os.remove(warmup_file)
            
        print("Engine warmed up! Ready for instant analysis.\n")
    except Exception as e:
        print(f"Warm-up skipped or failed: {e}\n")

    yield # This tells FastAPI to start handling web requests
    
    # Optional cleanup logic would go here when the server shuts down

app = FastAPI(lifespan=lifespan, title="Maqam Audio Processor")

# This allows future React frontend to talk to this server without security blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "message": "Maqam Audio Processor is live! Visit /docs for interactive documentation."}

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    if not file.filename.endswith(('.wav', '.mp3', '.ogg', '.webm')):
        raise HTTPException(status_code=400, detail="Invalid audio format")

    # save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        #Extract frequencies using Librosa logic
        frequencies = analyzer.extract_frequencies(temp_file_path)
        
        if len(frequencies) == 0:
            return {"status": "error", "message": "No clear pitch detected."}

        # ask Java for the Maqam (We need to update find_maqam_from_api to return data instead of printing)
        maqam_results = analyzer.analyze_audio_pipeline(frequencies)
        
        return maqam_results

    except Exception as e:
        print(f"Error analyzing audio: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        # Clean up the temporary file so the server doesn't run out of storage
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)