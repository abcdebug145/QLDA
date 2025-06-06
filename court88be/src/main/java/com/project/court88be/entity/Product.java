package com.project.court88be.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;

@Data
@Entity
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String image; // Đường dẫn ảnh
    private int price;
    private int stock; // Số lượng tồn kho

    // getter, setter
}
