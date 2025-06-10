package com.project.court88be.dto.request;

import lombok.Data;

@Data
public class AddCartItemRequest {
    private String userId;
    private String productId;
    private int quantity;
}
