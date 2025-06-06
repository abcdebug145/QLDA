package com.project.court88be.entity;

import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;
import lombok.Builder;

@Data
@Entity
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private Set<CartItem> items;

    // getter, setter
}
