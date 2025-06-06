package com.project.court88be.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.court88be.dto.request.CreateUserRequest;
import com.project.court88be.dto.request.UpdateUserRequest;
import com.project.court88be.dto.response.CreateUserResponse;
import com.project.court88be.dto.response.UserInfoResponse;
import com.project.court88be.entity.User;
import com.project.court88be.enums.Role;
import com.project.court88be.repository.UserRepository;
import com.project.court88be.security.JwtTokenProvider;
import com.project.court88be.dto.BookingResponse;
import com.project.court88be.dto.OrderResponse;
import com.project.court88be.dto.UserOrdersResponse;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final BookingService bookingService;
    private final OrderService orderService;

    public CreateUserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword() == null ? "1" : request.getPassword());
        System.out.println("ROLE: " + request.getRole());

        Role userRole;
        try {
            userRole = request.getRole() == null ? Role.CUSTOMER : Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role không hợp lệ. Các giá trị hợp lệ là: OWNER, STAFF, CUSTOMER");
        }

        User user = User.builder()
                .phone(request.getPhone())
                .password(encodedPassword)
                .name(request.getName())
                .address(request.getAddress())
                .role(userRole)
                .build();

        userRepository.save(user);

        String token = tokenProvider.generateToken(user);

        return CreateUserResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .name(user.getName())
                .address(user.getAddress())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    public CreateUserResponse login(CreateUserRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("Số điện thoại hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Số điện thoại hoặc mật khẩu không đúng");
        }

        String token = tokenProvider.generateToken(user);
        return CreateUserResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .name(user.getName())
                .address(user.getAddress())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    public UserInfoResponse getUserInfoFromToken(String token) {
        String phone = tokenProvider.getUsernameFromJWT(token);
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return UserInfoResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .name(user.getName())
                .address(user.getAddress())
                .role(user.getRole().name())
                .build();
    }

    public UserOrdersResponse getUserOrders(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với số điện thoại: " + phone));

        List<BookingResponse> bookings = bookingService.getBookingsByPhone(phone);
        List<OrderResponse> orders = orderService.getOrdersByPhone(phone);

        return UserOrdersResponse.builder()
                .bookings(bookings)
                .orders(orders)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserInfoResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserInfoResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserInfoResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + id));
        return convertToUserInfoResponse(user);
    }

    @Transactional
    public UserInfoResponse updateUser(String phone, UpdateUserRequest request) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với số điện thoại: " + phone));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));

        return convertToUserInfoResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với số điện thoại: " + phone));
        userRepository.delete(user);
    }

    private UserInfoResponse convertToUserInfoResponse(User user) {
        return UserInfoResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .name(user.getName())
                .address(user.getAddress())
                .role(user.getRole().name())
                .build();
    }
}
