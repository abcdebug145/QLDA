package com.project.court88be.service;

import com.project.court88be.dto.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(String userId);
    CartResponse addToCart(String userId, String productId, int quantity);
    CartResponse updateCartItem(String userId, String productId, int quantity);
    CartResponse removeFromCart(String userId, String productId);
    CartResponse clearCart(String userId);
}
