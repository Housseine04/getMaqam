package com.portfolio.maqamfinder.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.portfolio.maqamfinder.entity.Jins;

import java.util.Optional;

@Repository
public interface JinsRepository extends JpaRepository<Jins, Integer> {
    // We pass a string "4,3,3" and cast it to an int[] to match database column
    @Query(value = "SELECT * FROM jins WHERE intervals_in_quarter_tones = string_to_array(:intervalString, ',')::int[]", nativeQuery = true)
    Optional<Jins> findByExactIntervals(@Param("intervalString") String intervalString);

}
