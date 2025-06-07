package com.project.court88be.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ProductResponse {
    private String id;
    private String name;
    private String image;
    private int price;
    private int stock;
} 