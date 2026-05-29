package com.portfolio.maqamfinder.controller;

import com.portfolio.maqamfinder.entity.Jins;
import com.portfolio.maqamfinder.repo.JinsRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JinsController.class)
public class JinsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JinsRepository jinsRepo;

    @Test
    public void testSearchJinsByIntervals_Returns200AndMatchingJins() throws Exception {

        // ARRANGE: Create our fake Rast Jins
        Jins mockRast = new Jins();
        mockRast.setId(1);
        mockRast.setName("Rast");
        mockRast.setSize(4);
        mockRast.setIntervalsInQuarterTones(List.of(4, 3, 3));

        // Tell the stunt double: "If someone searches for '4,3,3', return the
        // mockRast."
        // Notice we use Optional.of() because our repo method returns an Optional<Jins>
        when(jinsRepo.findByExactIntervals("4,3,3")).thenReturn(Optional.of(mockRast));

        // ACT & ASSERT: Make the web request WITH the query parameter
        mockMvc.perform(get("/api/ajnas/search")
                .param("intervals", "4,3,3")) // This safely adds ?intervals=4,3,3 to the URL
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Rast")) // $.name accesses the top-level JSON object
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    public void testSearchJinsByIntervals_WhenNotFound_Returns404() throws Exception {

        // ARRANGE: Tell the stunt double to return empty for a nonsense interval
        when(jinsRepo.findByExactIntervals("9,9,9")).thenReturn(Optional.empty());

        // ACT & ASSERT: Expect a 404 Not Found status
        mockMvc.perform(get("/api/ajnas/search")
                .param("intervals", "9,9,9"))
                .andExpect(status().isNotFound());
    }
}