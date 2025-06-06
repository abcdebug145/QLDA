package com.project.court88be.repository;

import com.project.court88be.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUser_Phone(String phone);
} 