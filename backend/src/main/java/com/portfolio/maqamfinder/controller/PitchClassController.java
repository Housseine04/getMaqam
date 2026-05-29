package com.portfolio.maqamfinder.controller;

import com.portfolio.maqamfinder.entity.PitchClass;
import com.portfolio.maqamfinder.repo.PitchClassRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pitch-classes")
public class PitchClassController {

    private final PitchClassRepository pitchClassRepository;

    public PitchClassController(PitchClassRepository pitchClassRepository) {
        this.pitchClassRepository = pitchClassRepository;
    }

    // URL: GET http://localhost:8080/api/pitch-classes
    @GetMapping
    public List<PitchClass> getAllPitchClasses() {
        return pitchClassRepository.findAll();
    }

    // URL: GET http://localhost:8080/api/pitch-classes/1
    @GetMapping("/{id}")
    public ResponseEntity<PitchClass> getPitchClassById(@PathVariable Integer id) {
        return pitchClassRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}