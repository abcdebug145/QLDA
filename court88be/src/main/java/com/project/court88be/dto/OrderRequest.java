package com.project.court88be.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<ProductOrder> products;
    private int shippingFee;
    private int total;
    private String phone;

    @Data
    public static class ProductOrder {
        private String name;
        private int quantity;
        private int price;
    }
} 