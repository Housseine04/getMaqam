package com.portfolio.maqamfinder.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.maqamfinder.entity.Jins;

@Repository
public interface JinsRepository extends JpaRepository<Jins, Integer> {
}
