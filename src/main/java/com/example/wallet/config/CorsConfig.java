package com.example.wallet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration for Frontend Access
 * 
 * Allows the frontend (local, Render, or any origin) to make API calls
 * to the Spring Boot backend without CORS errors.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://wallet-transaction-system-1.onrender.com",
                    "https://wallet-transaction-system.onrender.com",
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:8081",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:8080",
                    "http://127.0.0.1:8081"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific Render domains and localhost for development
        List<String> allowedOrigins = Arrays.asList(
            "https://wallet-transaction-system-1.onrender.com",
            "https://wallet-transaction-system.onrender.com",
            "http://localhost:3000",
            "http://localhost:8080",
            "http://localhost:8081",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:8081"
        );
        
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // Cache preflight for 1 hour
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
