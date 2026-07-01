package com.devang.mediconnect.service;

import com.devang.mediconnect.entity.User;

public interface UserService {

    User registerUser(User user);

    User getUserByEmail(String email);

    String loginUser(String email, String password);

}