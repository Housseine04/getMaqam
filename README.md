# [GetMaqam: AI-Powered Arabic Maqam Analyzer](https://get-maqam.vercel.app/)

GetMaqam is an advanced, full-stack audio analysis engine designed to detect and classify Middle Eastern Maqamat (musical modes) from raw audio recordings. Built for both solo instrumentals and complex polyphonic orchestrations, this system identifies musical structures by scanning for relative microtonal intervals rather than relying on fixed absolute pitches.

## System Architecture

The project is divided into a high-performance mathematical processing backend and a sleek, modern user interface.

* **Backend API (Python):** Powered by PyTorch and the CREPE neural network, the backend extracts raw frequencies from audio files and processes them through a custom deterministic music-theory algorithm. The API is designed to be served via Uvicorn/FastAPI.
* **Frontend Dashboard (React & Tailwind CSS):** A highly responsive, stateful web interface. It allows users to upload or record audio, displays loading skeletons during server processing, and renders the extracted Maqamat and Solfège roots using dynamic, glassmorphism-styled UI cards.

## Core Features

* **Neural Pitch Extraction:** Utilizes the CREPE convolutional neural network to bypass polyphonic interference, accordion "wet tuning" shimmer, and orchestral noise, successfully isolating pure microtonal frequencies.
* **Transposition Agnostic:** The engine does not guess absolute root notes. It uses a "Sliding Window DNA Scanner" to search for relative interval patterns (Ajnas), making it completely immune to musicians transposing their instruments or analog tape pitch-shifting.
* **Non-Maximum Suppression (NMS) Filtering:** A custom "Janitor" algorithm that cleans up the raw audio data, eliminating vibrato bleed and grouping frequencies into a structurally perfect 24-tone equal temperament (24-TET) array.
* **Proportional Confidence Scoring:** Results are aggregated and normalized using a proportional probability distribution, providing a clean percentage breakdown of all detected Maqamat.
* **Human-Readable Outputs:** Translates complex Modulo-24 integer logic into standard Solfège notation (e.g., "Mi ½♭", "Ré") for an intuitive user experience.

### **N.B:** *For more details about the music detection algorithm, please refer to the markdown file under /audio-processing/algo_theory.md*

## The Analysis Pipeline

1. **Extraction:** A 16kHz audio sample is passed through the PyTorch CREPE model.
2. **De-clustering:** The NMS filter trims the acoustic fat, returning a maximum of 11 core structural notes.
3. **DNA Scanning:** The engine scans adjacent notes for recognized Tetrachord/Trichord intervals (e.g., `3, 3, 4` for Bayati).
4. **Resolution Scoring:** A "Human Listener" heuristic applies a heavy multiplier if the musician intentionally resolves their phrase on the root of the detected DNA.
5. **JSON Delivery:** The data is normalized and sent to the React frontend for visualization.

## Deployment Roadmap

* **Backend:** Dockerized PyTorch/Uvicorn environment optimized for CPU execution, and querying from Java SpringBoot API hosted on Railway.
* **Database:** PostgreSQL hosted on Neon Cloud.
* **Frontend:** Vite-optimized React build, styled with Tailwind CSS, deployed for public access.
