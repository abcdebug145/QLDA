package com.project.court88be.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.CartResponse;
import com.project.court88be.dto.request.AddCartItemRequest;
import com.project.court88be.dto.request.RemoveCartItemRequest;
import com.project.court88be.dto.request.UpdateCartItemRequest;
import com.project.court88be.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @GetMapping
    public ApiResponse<CartResponse> getCart(@RequestParam String userId) {
        return ApiResponse.<CartResponse>builder()
            .success(true)
            .data(cartService.getCartByUserId(userId))
            .build();
    }
    @PostMapping("/clear")
    public ApiResponse<CartResponse> clearCart(@RequestParam String userId) {
        logger.info("[CLEAR CART] userId={}", userId);
        return ApiResponse.<CartResponse>builder()
            .success(true)
            .data(cartService.clearCart(userId))
            .build();
    }
    @PostMapping("/add")
    public ApiResponse<CartResponse> addToCart(@RequestBody AddCartItemRequest req) {
        logger.info("[ADD CART] userId={}, productId={}, quantity={}", req.getUserId(), req.getProductId(), req.getQuantity());
        return ApiResponse.<CartResponse>builder()
            .success(true)
            .data(cartService.addToCart(req.getUserId(), req.getProductId(), req.getQuantity()))
            .build();
    }

    @PostMapping("/update")
    public ApiResponse<CartResponse> updateCartItem(@RequestBody UpdateCartItemRequest req) {
        logger.info("[UPDATE CART] userId={}, productId={}, quantity={}", req.getUserId(), req.getProductId(), req.getQuantity());
        return ApiResponse.<CartResponse>builder()
            .success(true)
            .data(cartService.updateCartItem(req.getUserId(), req.getProductId(), req.getQuantity()))
            .build();
    }

    @PostMapping("/remove")
    public ApiResponse<CartResponse> removeFromCart(@RequestBody RemoveCartItemRequest req) {
        logger.info("[REMOVE CART] userId={}, productId={}", req.getUserId(), req.getProductId());
        return ApiResponse.<CartResponse>builder()
            .success(true)
            .data(cartService.removeFromCart(req.getUserId(), req.getProductId()))
            .build();
    }
}
