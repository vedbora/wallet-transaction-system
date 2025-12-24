package com.example.wallet.config;

import org.springframework.context.annotation.Configuration;

/**
 * DEPRECATED: CORS Configuration
 * 
 * This class is deprecated because Spring Security ignores WebMvcConfigurer-based CORS.
 * CORS is now configured in SecurityConfig.java at the security filter level.
 * 
 * This class is kept for reference but does not affect CORS behavior when Spring Security is enabled.
 * 
 * @deprecated Use SecurityConfig.corsConfigurationSource() instead
 */
@Configuration
@Deprecated
public class CorsConfig {
    // This class is intentionally empty.
    // CORS is now handled by SecurityConfig.java
}
