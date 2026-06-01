# The GetMaqam Algorithm: A Beginner's Guide

If you are new to music programming, identifying an Arabic Maqam from an audio file might sound like magic. In reality, it is a fascinating blend of digital physics and architectural math. This document explains exactly how the `analyzer.py` engine works behind the scenes.

## The Basics: Quarter-Tones and DNA

In Western music (like a piano), an octave is divided into 12 notes (Half-steps and Whole-steps).
In Arabic music, the octave is divided into **24 notes**. These in-between notes are called **Quarter-tones**. 

A **Maqam** (plural: Maqamat) is a musical scale. However, Maqamat are built using smaller puzzle pieces called **Ajnas** (singular: Jins). Think of a Jins as a sequence of intervals (the distances between notes). 
For example, the DNA of Maqam Bayati is the interval sequence: **3 quarter-tones, 3 quarter-tones, 4 quarter-tones**. 

To identify a Maqam, our algorithm just needs to find that DNA sequence.

---

## Step 1: The Ear (Neural Pitch Extraction)

When a musician plays an Oud or an entire orchestra plays a song, the microphone picks up a chaotic wall of sound waves. Older math algorithms try to find the repeating peaks in those waves, but they get confused by echoes, multiple instruments playing at once, or the "shimmer" of an accordion.

GetMaqam uses a Deep Learning Neural Network called **CREPE**. Instead of basic math, CREPE has been trained on thousands of hours of audio. It looks at the entire shape of the soundwave, ignores the background noise, and accurately isolates the fundamental pitch of the melody, outputting a massive list of raw Hz frequencies.

## Step 2: The Janitor (Non-Maximum Suppression)

When a singer holds a note, their voice naturally wavers up and down (vibrato). CREPE catches all of this wavering. If we aren't careful, the computer will think the singer is playing 50 different notes instead of just 1!

We pass the data through a custom filter called the **NMS Janitor**.
* It translates the Hz frequencies into our 24-note Quarter-tone system.
* It counts how often every note was played.
* If it sees a massive spike on the note "D", it assumes any tiny signals right next to "D" are just vibrato bleed and deletes them.
* It stops when it has collected the **Top 11** most structurally important notes of the audio clip.

## Step 3: The Brain (The Sliding Window DNA Scanner)

Now we have a clean, 11-note array. 
The worst way to find a scale is to guess the starting note. If the musician transposed the song higher to fit their voice, a fixed algorithm will fail. 

Instead, GetMaqam uses a **Sliding Window Scanner**. It ignores the actual note names and only calculates the distances between the notes in the array. 
It slides across the data checking combinations:
* Does this gap look like `4, 4, 2`? (Ajam)
* Does this gap look like `2, 4, 4`? (Kurd)
* Does this gap look like `3, 3, 4`? (Bayati)

Because it only looks for the *distances* between notes, the algorithm is completely immune to transposition. Bayati is Bayati, whether it starts on C, D, or F#.

## Step 4: The Heart (The Human Listener Bonus)

Arabic music is deeply emotional. Musicians build tension by pausing on random notes, but they relieve that tension by "resolving" (ending the phrase) on the true Root note of the Maqam. 

Our algorithm looks at the very last note played in the audio clip. If the Sliding Window Scanner finds a piece of Maqam DNA (like Kurd), and the root of that Kurd DNA happens to be the exact note the musician ended the song on, the engine applies a massive **2.5x Resolution Bonus** to its score. It mathematically rewards the emotional resolution.

## Step 5: The Output (Proportional Normalization)

Finally, the system adds up all the physical audio weight for every piece of DNA it found. It totals up the scores and divides them into a clean pie chart. 

Instead of confusing the user with raw mathematical weights, the API returns a pristine probability distribution (e.g., 74% Bayati, 26% Saba), complete with standard Solfège names (like "Mi ½♭") ready to be displayed on the frontend dashboard.