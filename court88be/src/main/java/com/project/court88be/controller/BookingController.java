package com.project.court88be.controller;

import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.BookingRequest;
import com.project.court88be.dto.BookingResponse;
import com.project.court88be.dto.AllDataResponse;
import com.project.court88be.service.BookingService;
import com.project.court88be.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final OrderService orderService;

    @GetMapping
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Lấy danh sách đặt sân thành công")
                .data(bookingService.getAllBookings())
                .build();
    }

    @GetMapping("/user")
    public ApiResponse<List<BookingResponse>> getBookingsByPhone(@RequestParam String phone) {
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Lấy danh sách đặt sân theo số điện thoại thành công")
                .data(bookingService.getBookingsByPhone(phone))
                .build();
    }

    @GetMapping("/date")
    public ApiResponse<List<BookingResponse>> getBookingsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Lấy danh sách đặt sân theo ngày thành công")
                .data(bookingService.getBookingsByDate(date))
                .build();
    }

    @PostMapping
    public ApiResponse<List<BookingResponse>> createBooking(@RequestBody BookingRequest request) {
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Tạo đặt sân thành công")
                .data(bookingService.createBookings(request))
                .build();
    }

    @PutMapping("/{bookingId}/status")
    public ApiResponse<BookingResponse> updateBookingStatus(
            @PathVariable String bookingId,
            @RequestParam String status) {
        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Cập nhật trạng thái đặt sân thành công")
                .data(bookingService.updateBookingStatus(bookingId, status))
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<AllDataResponse> getAllData() {
        AllDataResponse response = AllDataResponse.builder()
                .orders(orderService.getAllOrders())
                .bookings(bookingService.getAllBookings())
                .build();
        
        return ApiResponse.<AllDataResponse>builder()
                .success(true)
                .message("Lấy tất cả dữ liệu thành công")
                .data(response)
                .build();
    }
} 