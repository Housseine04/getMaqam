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

    private final PitchClassRepository pitchClassRepository;
    private final JinsRepository jinsRepository;
    private final MaqamRepository maqamRepository;

    // Spring automatically injects the repositories into this constructor
    public DataSeeder(PitchClassRepository pitchClassRepository, JinsRepository jinsRepository, MaqamRepository maqamRepository) {
        this.pitchClassRepository = pitchClassRepository;
        this.jinsRepository = jinsRepository;
        this.maqamRepository = maqamRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // Only seed if the database is empty
        if (pitchClassRepository.count() == 0) {
            // 1. Create the Tonic Pitch (Rast / C half-flat)
            PitchClass rastPitch = new PitchClass();
            rastPitch.setArabicName("Rast");
            rastPitch.setWesternApproximation("C half-fl");
            rastPitch.setSolfegeName("Do");
            rastPitch.setQuarterToneIndex(0);

            pitchClassRepository.save(rastPitch); // Save to database

            // 2. Create the Building Blocks (Ajnas)
            // Jins Rast (Size 4, Intervals: Whole, 3/4, 3/4 -> 4, 3, 3 in quarter tones)
            Jins jinsRast = new Jins();
            jinsRast.setName("Rast");
            jinsRast.setSize(4);
            jinsRast.setIntervalsInQuarterTones(List.of(4, 3, 3));
            jinsRepository.save(jinsRast);

            // 3. Create the Maqam recipe
            Maqam maqamRast = new Maqam();
            maqamRast.setName("Rast");
            maqamRast.setFamilyName("Rast");
            maqamRast.setTonicPitch(rastPitch); // Linking the Foreign Key!
            maqamRast.setLowerJins(jinsRast);   // Linking the Foreign Key!
            maqamRast.setUpperJins(jinsRast);   // Makam Rast uses Jins Rast for both halves

            maqamRepository.save(maqamRast);

            System.out.println("Music Data Seeded Successfully!");
        }
    }
}
