package com.project.court88be.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.court88be.entity.Cart;
import com.project.court88be.entity.User;

public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByUser(User user);
}
