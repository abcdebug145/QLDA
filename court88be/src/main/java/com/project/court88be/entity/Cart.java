package com.project.court88be.entity;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(exclude = "items")
@EqualsAndHashCode(exclude = "items")
@Entity
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<CartItem> items = new java.util.HashSet<>();

    public Cart() {}
    // Lombok Builder needs an all-args constructor for @Builder
    public Cart(String id, User user, Set<CartItem> items) {
        this.id = id;
        this.user = user;
        this.items = (items != null) ? items : new java.util.HashSet<>();
    }
    // getter, setter
}
