package com.portfolio.maqamfinder.bootstrap;

import com.portfolio.maqamfinder.entity.Jins;
import com.portfolio.maqamfinder.entity.Maqam;
import com.portfolio.maqamfinder.entity.PitchClass;
import com.portfolio.maqamfinder.repo.JinsRepository;
import com.portfolio.maqamfinder.repo.MaqamRepository;
import com.portfolio.maqamfinder.repo.PitchClassRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final PitchClassRepository pitchClassRepo;
    private final JinsRepository jinsRepo;
    private final MaqamRepository maqamRepo;

    public DataSeeder(PitchClassRepository pitchClassRepo, JinsRepository jinsRepo, MaqamRepository maqamRepo) {
        this.pitchClassRepo = pitchClassRepo;
        this.jinsRepo = jinsRepo;
        this.maqamRepo = maqamRepo;
    }

    @Override
    public void run(String... args) throws Exception {

        if (pitchClassRepo.count() == 0) {

            // ===============================
            // PITCH CLASSES (The Tonic Notes)
            // ===============================
            PitchClass rastPitch = new PitchClass();
            rastPitch.setArabicName("Rast");
            rastPitch.setWesternApproximation("C");
            rastPitch.setSolfegeName("Do");
            rastPitch.setQuarterToneIndex(0);
            pitchClassRepo.save(rastPitch);

            PitchClass dukahPitch = new PitchClass();
            dukahPitch.setArabicName("Dukah");
            dukahPitch.setWesternApproximation("D");
            dukahPitch.setSolfegeName("Re");
            dukahPitch.setQuarterToneIndex(4);
            pitchClassRepo.save(dukahPitch);

            PitchClass sikahPitch = new PitchClass();
            sikahPitch.setArabicName("Sikah");
            sikahPitch.setWesternApproximation("E half-flat");
            sikahPitch.setSolfegeName("Mi half-flat");
            sikahPitch.setQuarterToneIndex(7); // 7 quarter-tones above C
            pitchClassRepo.save(sikahPitch);

            // ===========================
            // AJNAS (The Building Blocks)
            // ===========================
            Jins jinsRast = createJins("Rast", 4, List.of(4, 3, 3));
            Jins jinsBayati = createJins("Bayati", 4, List.of(3, 3, 4));
            Jins jinsHijaz = createJins("Hijaz", 4, List.of(2, 6, 2));
            Jins jinsNahawand = createJins("Nahawand", 4, List.of(4, 2, 4));
            Jins jinsAjam = createJins("Ajam", 4, List.of(4, 4, 2));
            Jins jinsKurd = createJins("Kurd", 4, List.of(2, 4, 4));
            Jins jinsSaba = createJins("Saba", 4, List.of(3, 3, 2));
            Jins jinsSikah = createJins("Sikah", 3, List.of(3, 4)); // Trichord

            // =====================
            // MAQAMAT - The "Big 8"
            // =====================

            // Rast (Tonic: Do)
            createMaqam("Rast", "Rast", rastPitch, jinsRast, jinsRast);

            // Bayati (Tonic: Re)
            createMaqam("Bayati", "Bayati", dukahPitch, jinsBayati, jinsNahawand);

            // Hijaz (Tonic: Re)
            createMaqam("Hijaz", "Hijaz", dukahPitch, jinsHijaz, jinsNahawand);

            // Nahawand (Tonic: Do)
            createMaqam("Nahawand", "Nahawand", rastPitch, jinsNahawand, jinsHijaz);

            // Ajam (Tonic: Do)
            createMaqam("Ajam", "Ajam", rastPitch, jinsAjam, jinsAjam);

            // Kurd (Tonic: Re)
            createMaqam("Kurd", "Kurd", dukahPitch, jinsKurd, jinsNahawand);

            // Sikah (Tonic: Mi half-flat)
            createMaqam("Sikah", "Sikah", sikahPitch, jinsSikah, jinsRast);

            // Saba (Tonic: Re)
            createMaqam("Saba", "Saba", dukahPitch, jinsSaba, jinsHijaz);

            System.out.println("The 8 Main Arabic Maqamat Seeded Successfully!");
        }
    }

    // Helper method
    // keep the Jins creation code clean
    private Jins createJins(String name, int size, List<Integer> intervals) {
        Jins jins = new Jins();
        jins.setName(name);
        jins.setSize(size);
        jins.setIntervalsInQuarterTones(intervals);
        return jinsRepo.save(jins);
    }

    // Helper method
    // keep the Maqam creation code clean
    private void createMaqam(String name, String familyName, PitchClass tonic, Jins lower, Jins upper) {
        Maqam maqam = new Maqam();
        maqam.setName(name);
        maqam.setFamilyName(familyName);
        maqam.setTonicPitch(tonic);
        maqam.setLowerJins(lower);
        maqam.setUpperJins(upper);
        maqamRepo.save(maqam);
    }
}