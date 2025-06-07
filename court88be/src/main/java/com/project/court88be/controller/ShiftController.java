package com.project.court88be.controller;

import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.request.RegisterShiftsRequest;
import com.project.court88be.dto.response.ShiftResponse;
import com.project.court88be.enums.ShiftStatus;
import com.project.court88be.enums.ShiftType;
import com.project.court88be.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;

    @PostMapping("/register/{phone}")
    public ApiResponse<List<ShiftResponse>> registerMultipleShifts(
            @PathVariable String phone,
            @RequestBody RegisterShiftsRequest request) {
        try {
            Map<LocalDate, List<ShiftType>> shifts = request.getShifts().entrySet().stream()
                    .collect(Collectors.toMap(
                            entry -> LocalDate.parse(entry.getKey()),
                            Map.Entry::getValue
                    ));
            return ApiResponse.<List<ShiftResponse>>builder()
                    .success(true)
                    .message("Đăng ký ca làm việc thành công")
                    .data(shiftService.registerMultipleShifts(phone, shifts))
                    .build();
        } catch (RuntimeException e) {
            return ApiResponse.<List<ShiftResponse>>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }
    }

    @GetMapping("/user/{phone}")
    public ApiResponse<List<ShiftResponse>> getShiftsByPhone(@PathVariable String phone) {
        return ApiResponse.<List<ShiftResponse>>builder()
                .success(true)
                .message("Lấy danh sách ca làm việc của người dùng thành công")
                .data(shiftService.getShiftsByPhone(phone))
                .build();
    }

    @GetMapping("/user/{phone}/date")
    public ApiResponse<List<ShiftResponse>> getShiftsByPhoneAndDate(
            @PathVariable String phone,
            @RequestParam String date) {
        return ApiResponse.<List<ShiftResponse>>builder()
                .success(true)
                .message("Lấy danh sách ca làm việc của người dùng theo ngày thành công")
                .data(shiftService.getShiftsByPhoneAndDate(phone, date))
                .build();
    }

    @PutMapping("/status/{shiftId}")
    public ApiResponse<ShiftResponse> updateShiftStatus(
            @PathVariable String shiftId,
            @RequestParam ShiftStatus status) {
        return ApiResponse.<ShiftResponse>builder()
                .success(true)
                .message("Cập nhật trạng thái ca làm việc thành công")
                .data(shiftService.updateShiftStatus(shiftId, status))
                .build();
    }
} 