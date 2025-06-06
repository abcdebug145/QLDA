package com.project.court88be.controller;

import com.project.court88be.dto.AllOrdersResponse;
import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.UserOrdersResponse;
import com.project.court88be.dto.request.CreateUserRequest;
import com.project.court88be.dto.request.UpdateUserRequest;
import com.project.court88be.dto.response.CreateUserResponse;
import com.project.court88be.dto.response.UserInfoResponse;
import com.project.court88be.service.UserService;
import com.project.court88be.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final OrderService orderService;

    @PostMapping("/register")
    public ApiResponse<CreateUserResponse> register(@RequestBody CreateUserRequest request) {
        return ApiResponse.<CreateUserResponse>builder()
                .success(true)
                .message("Đăng ký tài khoản thành công")
                .data(userService.createUser(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<CreateUserResponse> login(@RequestBody CreateUserRequest request) {
        return ApiResponse.<CreateUserResponse>builder()
                .success(true)
                .message("Đăng nhập thành công")
                .data(userService.login(request))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<UserInfoResponse> getCurrentUser(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return ApiResponse.<UserInfoResponse>builder()
                .success(true)
                .message("Lấy thông tin người dùng thành công")
                .data(userService.getUserInfoFromToken(token))
                .build();
    }

    @GetMapping("/orders")
    public ApiResponse<UserOrdersResponse> getUserOrders(@RequestParam String phone) {
        return ApiResponse.<UserOrdersResponse>builder()
                .success(true)
                .message("Lấy danh sách đơn hàng của người dùng thành công")
                .data(userService.getUserOrders(phone))
                .build();
    }

    @GetMapping("/oab")
    public ApiResponse<AllOrdersResponse> getAllOrdersAndBookings() {
        return ApiResponse.<AllOrdersResponse>builder()
                .success(true)
                .message("Lấy danh sách đơn hàng và đặt sân thành công")
                .data(orderService.getAllOrdersAndBookings())
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserInfoResponse>> getAllUsers() {
        return ApiResponse.<List<UserInfoResponse>>builder()
                .success(true)
                .message("Lấy danh sách người dùng thành công")
                .data(userService.getAllUsers())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserInfoResponse> getUserById(@PathVariable String id) {
        return ApiResponse.<UserInfoResponse>builder()
                .success(true)
                .message("Lấy thông tin người dùng thành công")
                .data(userService.getUserById(id))
                .build();
    }

    @PutMapping("/{phone}")
    public ApiResponse<UserInfoResponse> updateUser(
            @PathVariable String phone,
            @RequestBody UpdateUserRequest request) {
        return ApiResponse.<UserInfoResponse>builder()
                .success(true)
                .message("Cập nhật thông tin người dùng thành công")
                .data(userService.updateUser(phone, request))
                .build();
    }

    @DeleteMapping("/{phone}")
    public ApiResponse<Void> deleteUser(@PathVariable String phone) {
        userService.deleteUser(phone);
        return ApiResponse.<Void>builder()
                .success(true)
                .message("Xóa người dùng thành công")
                .build();
    }
}
