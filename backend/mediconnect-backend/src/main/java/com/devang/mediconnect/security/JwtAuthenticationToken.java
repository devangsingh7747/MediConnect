package com.devang.mediconnect.security;

import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class JwtAuthenticationToken extends UsernamePasswordAuthenticationToken {

    public JwtAuthenticationToken(String email) {
        super(email, null, Collections.emptyList());
    }
}