import numpy as np
from scipy.io import wavfile

def create_test_tone():
    sample_rate = 22050  # Standard sample rate for Librosa
    duration = 3.0       # 3 seconds long
    frequency = 261.63   # Middle C (C4) in Hz

    print(f"Generating 3-second tone at {frequency} Hz...")
    
    # Generate the mathematical sine wave
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    tone = np.sin(frequency * t * 2 * np.pi)

    # Save it to a file
    wavfile.write("./test_oud.wav", sample_rate, tone.astype(np.float32))
    print("Created test_oud.wav successfully!")

if __name__ == "__main__":
    create_test_tone()