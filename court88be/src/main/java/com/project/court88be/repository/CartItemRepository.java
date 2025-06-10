package com.project.court88be.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.court88be.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
}
