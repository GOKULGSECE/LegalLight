package com.example.demo.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.Models.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}
