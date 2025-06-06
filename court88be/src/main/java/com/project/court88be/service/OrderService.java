package com.project.court88be.service;

import com.project.court88be.dto.OrderRequest;
import com.project.court88be.dto.OrderResponse;
import com.project.court88be.dto.AllOrdersResponse;
import com.project.court88be.dto.BookingResponse;
import com.project.court88be.entity.Order;
import com.project.court88be.entity.OrderItem;
import com.project.court88be.entity.User;
import com.project.court88be.entity.Booking;
import com.project.court88be.repository.OrderRepository;
import com.project.court88be.repository.UserRepository;
import com.project.court88be.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public AllOrdersResponse getAllOrdersAndBookings() {
        List<OrderResponse> orders = orderRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        List<BookingResponse> bookings = bookingRepository.findAll().stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());

        return AllOrdersResponse.builder()
                .orders(orders)
                .bookings(bookings)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByPhone(String phone) {
        return orderRepository.findByUser_Phone(phone).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Tìm user theo phone
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo order mới
        Order order = Order.builder()
                .user(user)
                .shippingFee(request.getShippingFee())
                .total(request.getTotal())
                .createdAt(LocalDateTime.now())
                .status("PENDING")
                .build();

        // Tạo các order items
        List<OrderItem> items = request.getProducts().stream()
                .map(product -> OrderItem.builder()
                        .order(order)
                        .name(product.getName())
                        .quantity(product.getQuantity())
                        .price(product.getPrice())
                        .build())
                .collect(Collectors.toList());

        order.setItems(items);
        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    private OrderResponse convertToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .products(order.getItems().stream()
                        .map(item -> OrderResponse.ProductOrder.builder()
                                .name(item.getName())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .shippingFee(order.getShippingFee())
                .total(order.getTotal())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus())
                .build();
    }

    @Transactional(readOnly = true)
    private BookingResponse convertToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .courtName(booking.getCourt().getName())
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .total(booking.getTotal())
                .status(booking.getStatus())
                .build();
    }

    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với id: " + orderId));
        order.setStatus(status);
        return convertToResponse(orderRepository.save(order));
    }
} 