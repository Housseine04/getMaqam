package com.portfolio.maqamfinder.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.maqamfinder.entity.Maqam;

@Repository
public interface MaqamRepository extends JpaRepository<Maqam, Integer> {
}
