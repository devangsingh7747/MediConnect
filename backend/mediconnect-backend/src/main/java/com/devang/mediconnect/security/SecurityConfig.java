package com.devang.mediconnect.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.devang.mediconnect.service.impl.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomUserDetailsService userDetailsService;

        public SecurityConfig(
                JwtAuthenticationFilter jwtAuthenticationFilter,
                CustomUserDetailsService userDetailsService) {

                this.jwtAuthenticationFilter =
                        jwtAuthenticationFilter;

                this.userDetailsService =
                        userDetailsService;
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider =
                        new DaoAuthenticationProvider();

                provider.setUserDetailsService(
                        userDetailsService
                );

                provider.setPasswordEncoder(
                        new BCryptPasswordEncoder()
                );

                return provider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                HttpSecurity http) throws Exception {

                http
                        .cors(cors ->
                                cors.configurationSource(
                                        request -> {

                                        CorsConfiguration configuration =
                                                new CorsConfiguration();

                                        configuration.addAllowedOrigin(
                                                "http://localhost:5173"
                                        );

                                        configuration.addAllowedMethod("*");
                                        configuration.addAllowedHeader("*");

                                        configuration.setAllowCredentials(
                                                true
                                        );

                                        return configuration;
                                        }
                                )
                        )

                        .csrf(csrf -> csrf.disable())

                        .sessionManagement(session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                        )

                        .authorizeHttpRequests(auth -> auth

                                /*
                                * Public authentication endpoints only.
                                */
                                .requestMatchers(
                                        "/api/users/login",
                                        "/api/users/register",
                                        "/api/users/register/**"
                                )
                                .permitAll()

                                /*
                                * JWT is mandatory for current-user APIs.
                                * These rules must appear before the broad
                                * temporary permit-all rules.
                                */
                                .requestMatchers(
                                        "/api/users/me",
                                        "/api/patients/me",
                                        "/api/patients/me/**",
                                        "/api/doctors/me",
                                        "/api/doctors/me/**"
                                )
                                .authenticated()

                                /*
                                * Temporary development access.
                                *
                                * We will gradually remove these broad rules
                                * as appointment, notification and admin
                                * ownership security is implemented.
                                */
                                .requestMatchers(
                                        "/api/patients/**",
                                        "/api/doctors/**",
                                        "/api/appointments/**",
                                        "/api/dashboard/**",
                                        "/api/notifications/**"
                                )
                                .permitAll()

                                .anyRequest()
                                .authenticated()
                        )

                        .authenticationProvider(
                                authenticationProvider()
                        )

                        .addFilterBefore(
                                jwtAuthenticationFilter,
                                UsernamePasswordAuthenticationFilter.class
                        );

                return http.build();
        }
}