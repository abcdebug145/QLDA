package com.project.court88be.controller;

import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.AllOrdersResponse;
import com.project.court88be.dto.OrderRequest;
import com.project.court88be.dto.OrderResponse;
import com.project.court88be.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/user")
    public ApiResponse<List<OrderResponse>> getOrdersByPhone(@RequestParam String phone) {
        return ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .message("Lấy danh sách đơn hàng theo số điện thoại thành công")
                .data(orderService.getOrdersByPhone(phone))
                .build();
    }

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Tạo đơn hàng thành công")
                .data(orderService.createOrder(request))
                .build();
    }

    @PutMapping("/status/{orderId}")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        return ApiResponse.<OrderResponse>builder()
                .success(true)
                .message("Cập nhật trạng thái đơn hàng thành công")
                .data(orderService.updateOrderStatus(orderId, status))
                .build();
    }
} 