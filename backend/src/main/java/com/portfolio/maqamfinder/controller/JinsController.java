package com.portfolio.maqamfinder.controller;

import com.portfolio.maqamfinder.entity.Jins;
import com.portfolio.maqamfinder.repo.JinsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ajnas")
public class JinsController {

    private final JinsRepository jinsRepository;

    public JinsController(JinsRepository jinsRepository) {
        this.jinsRepository = jinsRepository;
    }

    // URL: GET http://localhost:8080/api/ajnas
    @GetMapping
    public List<Jins> getAllAjnas() {
        return jinsRepository.findAll();
    }

    // URL: GET http://localhost:8080/api/ajnas/1
    @GetMapping("/{id}")
    public ResponseEntity<Jins> getJinsById(@PathVariable Integer id) {
        return jinsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // URL: GET http://localhost:8080/api/ajnas/search?intervals=4,3,3
    @GetMapping("/search")
    public ResponseEntity<Jins> searchJinsByIntervals(@RequestParam String intervals) {
        return jinsRepository.findByExactIntervals(intervals)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}