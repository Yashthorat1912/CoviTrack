package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(List.of("http://127.0.0.1:5500", "http://127.0.0.1:5501", "http://localhost:3000"));// ✅//
                                                                                                                        // Allow
                                                                                                                        // frontend
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept")); // ✅ Added "Accept"
    configuration.setExposedHeaders(List.of("Authorization")); // ✅ Allow frontend to access JWT token in response
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF for APIs
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Enable CORS
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, "/api/covid/**").permitAll() // ✅ Allow all GET requests
            .requestMatchers(HttpMethod.POST, "/api/covid/add-state").permitAll() // ✅ Allow adding state data
            .requestMatchers(HttpMethod.POST, "/api/contacts").permitAll()
            .requestMatchers("/auth/register", "/auth/login", "/covid/global").permitAll()
            .anyRequest().permitAll()); // 🔒 Secure other API endpoints

    return http.build();
  }
}
