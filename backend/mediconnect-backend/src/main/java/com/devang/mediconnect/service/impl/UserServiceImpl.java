package com.devang.mediconnect.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.User;
import com.devang.mediconnect.repository.UserRepository;
import com.devang.mediconnect.security.JwtUtil;
import com.devang.mediconnect.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository,
                    BCryptPasswordEncoder passwordEncoder,
                    JwtUtil jwtUtil,
                    AuthenticationManager authenticationManager) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    this.authenticationManager = authenticationManager;
}

    @Override
    public User registerUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole("PATIENT");

        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public String loginUser(String email, String password) {

        try {

            System.out.println("Email: " + email);
            System.out.println("Password: " + password);

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            System.out.println("Authentication Successful");

        } catch (Exception e) {

            e.printStackTrace();

            throw e;
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return null;
        }

        return jwtUtil.generateToken(user.getEmail());
    }

}