package com.project.court88be.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;

@Data
@Entity
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private Cart cart;

    @ManyToOne
    private Product product;

    private int quantity;

    // getter, setter
}