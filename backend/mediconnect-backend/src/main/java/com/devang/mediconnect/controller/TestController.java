package com.devang.mediconnect.controller;

import com.devang.mediconnect.service.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("/api/test")
    public String testApi() {
        return testService.getWelcomeMessage();
    }
}