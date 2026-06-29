package com.devang.mediconnect.service.impl;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.service.TestService;

@Service
public class TestServiceImpl implements TestService {

    @Override
    public String getWelcomeMessage() {
        return "🚀 Welcome to MediConnect Backend!";
    }

}