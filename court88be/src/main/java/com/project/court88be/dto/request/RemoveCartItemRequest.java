package com.project.court88be.dto.request;

import lombok.Data;

@Data
public class RemoveCartItemRequest {
    private String userId;
    private String productId;
}
