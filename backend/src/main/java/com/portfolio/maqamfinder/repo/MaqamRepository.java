package com.portfolio.maqamfinder.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.maqamfinder.entity.Maqam;

import java.util.List;

@Repository
public interface MaqamRepository extends JpaRepository<Maqam, Integer> {
    // Spring translates this to: SELECT * FROM maqam WHERE family_name = ?
    // (Case Insensitive)
    List<Maqam> findByFamilyNameIgnoreCase(String familyName);

    // Spring translates this to: SELECT * FROM maqam WHERE lower_jins_id = ?
    List<Maqam> findByLowerJinsId(Long lowerJinsId);
}
