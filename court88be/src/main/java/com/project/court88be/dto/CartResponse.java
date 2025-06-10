package com.project.court88be.dto;

import java.util.List;

import lombok.Data;

@Data
public class CartResponse {
    private String phone;
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private String productId;
        private String name;
        private String image;
        private int price;
        private int quantity;
    }
}
