package com.project.court88be.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Entity
@Table(name = "court")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name; // SÂN 1, SÂN 2, ...
    private int price; // Giá sân theo giờ
    private boolean active;

    // getter, setter
}
