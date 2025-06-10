package com.project.court88be.service.impl;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.court88be.dto.CartResponse;
import com.project.court88be.entity.Cart;
import com.project.court88be.entity.CartItem;
import com.project.court88be.entity.Product;
import com.project.court88be.entity.User;
import com.project.court88be.repository.CartItemRepository;
import com.project.court88be.repository.CartRepository;
import com.project.court88be.repository.ProductRepository;
import com.project.court88be.repository.UserRepository;
import com.project.court88be.service.CartService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> createCart(user));
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(String userId, String productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> createCart(user));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst().orElse(null);
        if (item == null) {
            item = CartItem.builder().cart(cart).product(product).quantity(quantity).build();
            cartItemRepository.save(item);
            cart.getItems().add(item);
        } else {
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        }
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(String userId, String productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> createCart(user));
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst().orElse(null);
        if (item != null) {
            if (quantity <= 0) {
                cartItemRepository.delete(item);
                cart.getItems().remove(item);
            } else {
                item.setQuantity(quantity);
                cartItemRepository.save(item);
            }
        }
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(String userId, String productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> createCart(user));
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst().orElse(null);
        if (item != null) {
            cartItemRepository.delete(item);
            cart.getItems().remove(item);
        }
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> createCart(user));
        // Xóa tất cả cart items
        for (CartItem item : cart.getItems()) {
            cartItemRepository.delete(item);
        }
        cart.getItems().clear();
        cartRepository.save(cart);
        return toResponse(cart);
    }

    private Cart createCart(User user) {
        Cart cart = Cart.builder().user(user).build();
        return cartRepository.save(cart);
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse resp = new CartResponse();
        resp.setPhone(cart.getUser().getPhone());
        resp.setItems(cart.getItems().stream().map(item -> {
            CartResponse.CartItemDTO dto = new CartResponse.CartItemDTO();
            dto.setProductId(item.getProduct().getId());
            dto.setName(item.getProduct().getName());
            dto.setImage(item.getProduct().getImage());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());
            return dto;
        }).collect(Collectors.toList()));
        return resp;
    }
}
