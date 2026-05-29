package com.portfolio.maqamfinder.entity;

import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Jins")
@Data
@NoArgsConstructor
public class Jins {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer size;

    //this handles the INT[] column from PSQL
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "intervals_in_quarter_tones", columnDefinition = "int[]")
    private List<Integer> intervalsInQuarterTones;
}
