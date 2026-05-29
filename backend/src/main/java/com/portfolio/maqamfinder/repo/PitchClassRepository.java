package com.portfolio.maqamfinder.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.maqamfinder.entity.PitchClass;

@Repository
public interface PitchClassRepository extends JpaRepository<PitchClass, Integer> {
    // Spring automatically gives save(), findAll(), findById(), deleteById()...
}
