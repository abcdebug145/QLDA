package com.project.court88be.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class UserOrdersResponse {
    private List<OrderResponse> orders;
    private List<BookingResponse> bookings;
} 