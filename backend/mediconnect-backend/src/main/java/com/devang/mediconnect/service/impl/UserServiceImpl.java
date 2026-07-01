package com.devang.mediconnect.service.impl;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.User;
import com.devang.mediconnect.repository.UserRepository;
import com.devang.mediconnect.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.devang.mediconnect.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                    BCryptPasswordEncoder passwordEncoder,
                    JwtUtil jwtUtil) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
}

    @Override
    public User registerUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public String loginUser(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return null;
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        return jwtUtil.generateToken(user.getEmail());
    }

}