package com.project.court88be.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String phone;
    private String address;
    private String role;
} 