package com.portfolio.maqamfinder.config;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.filter.CorsFilter;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

public class CorsConfigTest {

    private CorsFilter corsFilter;

    @BeforeEach
    void setUp() {
        CorsConfig corsConfig = new CorsConfig();
        ReflectionTestUtils.setField(corsConfig, "allowedOriginPatterns", new String[]{
                "http://localhost:5173",
                "http://localhost:3000",
                "https://*.vercel.app"
        });
        corsFilter = corsConfig.corsFilter();
    }

    @Test
    void shouldAllowVercelDomainPreflight() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/maqams");
        request.addHeader("Origin", "https://get-maqam-frontend.vercel.app");
        request.addHeader("Access-Control-Request-Method", "GET");

        MockHttpServletResponse response = new MockHttpServletResponse();
        corsFilter.doFilter(request, response, new MockFilterChain());

        assertEquals("https://get-maqam-frontend.vercel.app", response.getHeader("Access-Control-Allow-Origin"));
        assertEquals("true", response.getHeader("Access-Control-Allow-Credentials"));
        assertNotNull(response.getHeader("Access-Control-Allow-Methods"));
    }

    @Test
    void shouldAllowLocalhost5173() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/maqams");
        request.addHeader("Origin", "http://localhost:5173");

        MockHttpServletResponse response = new MockHttpServletResponse();
        corsFilter.doFilter(request, response, new MockFilterChain());

        assertEquals("http://localhost:5173", response.getHeader("Access-Control-Allow-Origin"));
        assertEquals("true", response.getHeader("Access-Control-Allow-Credentials"));
    }

    @Test
    void shouldRejectDisallowedOrigin() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/maqams");
        request.addHeader("Origin", "https://unauthorized-domain.com");

        MockHttpServletResponse response = new MockHttpServletResponse();
        corsFilter.doFilter(request, response, new MockFilterChain());

        assertNull(response.getHeader("Access-Control-Allow-Origin"));
    }
}
