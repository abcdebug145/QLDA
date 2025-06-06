package com.project.court88be.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateUserRequest {
    private String phone;
    private String password;
    private String name;
    private String address;
    private String role;
}
