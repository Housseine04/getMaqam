package com.portfolio.maqamfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pitchclass")
@Data // Lombok: Auto-generates Getters, Setters, and toString()
@NoArgsConstructor // Lombok: Auto-generates an empty constructor required by JPA

public class PitchClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "arabic_name", nullable = false)
    private String arabicName;

    @Column(name = "western_approx")
    private String westernApproximation;

    @Column(name = "solfege_name")
    private String solfegeName;

    @Column(name = "quarter_tone_idx", nullable = false)
    private Integer quarterToneIndex;
}
