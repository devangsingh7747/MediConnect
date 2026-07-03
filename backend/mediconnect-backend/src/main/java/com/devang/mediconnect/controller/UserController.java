package com.devang.mediconnect.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devang.mediconnect.dto.LoginRequest;
import com.devang.mediconnect.dto.LoginResponse;
import com.devang.mediconnect.entity.User;
import com.devang.mediconnect.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        System.out.println("REGISTER API HIT");
        System.out.println(user.getEmail());

        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest loginRequest) {

        try {

            System.out.println("LOGIN API HIT");
            System.out.println(loginRequest.getEmail());

            String token = userService.loginUser(
                    loginRequest.getEmail(),
                    loginRequest.getPassword());

            return new LoginResponse(token);

        } catch (Exception e) {

            e.printStackTrace();

            throw e;
        }
    }

    @GetMapping("/me")
    public User getCurrentUser(Principal principal) {

        return userService.getUserByEmail(principal.getName());

    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

}