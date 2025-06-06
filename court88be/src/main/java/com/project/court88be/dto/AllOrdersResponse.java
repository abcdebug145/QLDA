package com.project.court88be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllOrdersResponse {
    private List<OrderResponse> orders;
    private List<BookingResponse> bookings;
} 