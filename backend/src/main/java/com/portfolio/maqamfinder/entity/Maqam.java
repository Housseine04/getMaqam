package com.portfolio.maqamfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "maqam")
@Data
@NoArgsConstructor
public class Maqam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "family_name")
    private String familyName;

    // Maps the Foreign Key to the PitchClass table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tonic_pitch_id")
    private PitchClass tonicPitch;

    // Maps the Foreign Key to the Jins table (Lower)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lower_jins_id")
    private Jins lowerJins;

    // Maps the Foreign Key to the Jins table (Upper)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "upper_jins_id")
    private Jins upperJins;
}
