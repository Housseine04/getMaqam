package com.portfolio.maqamfinder.controller;

import com.portfolio.maqamfinder.entity.Maqam;
import com.portfolio.maqamfinder.repo.MaqamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest tells Spring: "Only load the Controller, don't load the whole application or database."
@WebMvcTest(MaqamController.class)
public class MaqamControllerTest {

    @Autowired
    private MockMvc mockMvc; // This tool acts like a fake web browser to send HTTP requests

    @MockitoBean
    private MaqamRepository maqamRepository; // This replaces the real database with a Mockito stunt double

    @Test
    public void testGetAllMaqams_Returns200AndJsonArray() throws Exception {

        // ARRANGE: Create our fake data
        Maqam mockMaqam1 = new Maqam();
        mockMaqam1.setName("Rast");
        mockMaqam1.setFamilyName("Rast");

        Maqam mockMaqam2 = new Maqam();
        mockMaqam2.setName("Bayati");
        mockMaqam2.setFamilyName("Bayati");

        // Tell the stunt double: "If someone calls findAll(), give them this list."
        when(maqamRepository.findAll()).thenReturn(Arrays.asList(mockMaqam1, mockMaqam2));

        // ACT & ASSERT: Make the fake web request and check the results
        mockMvc.perform(get("/api/maqams"))
                .andExpect(status().isOk()) // Expect HTTP 200 Success
                .andExpect(jsonPath("$[0].name").value("Rast")) // Check that the first JSON object is Rast
                .andExpect(jsonPath("$[1].name").value("Bayati")); // Check that the second JSON object is Bayati
    }
}