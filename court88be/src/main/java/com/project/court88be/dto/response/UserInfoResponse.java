package com.project.court88be.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfoResponse {
    private String id;
    private String phone;
    private String name;
    private String address;
    private String role;
}