package com.portfolio.maqamfinder.controller;

import com.portfolio.maqamfinder.entity.Maqam;
import com.portfolio.maqamfinder.repo.MaqamRepository;
//SWAGGER
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maqams") // The base URL for all endpoints in this class
@Tag(name = "Maqamat", description = "Endpoints for managing and searching Arabic scales")
public class MaqamController {
    private final MaqamRepository maqamRepository;

    // Injecting the repository so we can access the database
    public MaqamController(MaqamRepository maqamRepository) {
        this.maqamRepository = maqamRepository;
    }

    // Endpoint 1: Get ALL Maqams
    // URL: GET http://localhost:8080/api/maqams
    @GetMapping
    @Operation(summary = "Get all Maqamat", description = "Returns a complete list of all basic Arabic scales in the database.")
    public List<Maqam> getAllMaqams() {
        return maqamRepository.findAll();
    }

    // Endpoint 2: Get a single Maqam by its ID
    // URL: GET http://localhost:8080/api/maqams/1
    @GetMapping("/{id}")
    public ResponseEntity<Maqam> getMaqamById(@PathVariable Integer id) {
        return maqamRepository.findById(id)
                .map(ResponseEntity::ok) // Returns 200 OK if found
                .orElse(ResponseEntity.notFound().build()); // Returns 404 Not Found if it doesn't exist
    }

    // URL: GET http://localhost:8080/api/maqams/search/family?name=Rast
    @GetMapping("/search/family")
    public ResponseEntity<List<Maqam>> searchMaqamsByFamily(@RequestParam String name) {
        List<Maqam> results = maqamRepository.findByFamilyNameIgnoreCase(name);
        if (results.isEmpty()) {
            return ResponseEntity.notFound().build(); // 404 if none found
        }
        return ResponseEntity.ok(results);
    }

    // URL: GET http://localhost:8080/api/maqams/search/lower-jins?id=1
    @GetMapping("/search/lower-jins")
    public ResponseEntity<List<Maqam>> searchMaqamsByLowerJins(@RequestParam Long id) {
        List<Maqam> results = maqamRepository.findByLowerJinsId(id);
        if (results.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(results);
    }
}
