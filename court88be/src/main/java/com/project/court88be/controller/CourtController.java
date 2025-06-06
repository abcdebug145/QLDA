package com.project.court88be.controller;

import com.project.court88be.dto.ApiResponse;
import com.project.court88be.dto.CourtDTO;
import com.project.court88be.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courts")
@RequiredArgsConstructor
public class CourtController {
    private final CourtService courtService;

    @GetMapping
    public ApiResponse<List<CourtDTO>> getAllCourts() {
        return ApiResponse.<List<CourtDTO>>builder()
                .success(true)
                .message("Lấy danh sách sân thành công")
                .data(courtService.getAllCourts())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CourtDTO> getCourtById(@PathVariable String id) {
        return ApiResponse.<CourtDTO>builder()
                .success(true)
                .message("Lấy thông tin sân thành công")
                .data(courtService.getCourtById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<CourtDTO> createCourt(@RequestBody CourtDTO courtDTO) {
        return ApiResponse.<CourtDTO>builder()
                .success(true)
                .message("Tạo sân mới thành công")
                .data(courtService.createCourt(courtDTO))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CourtDTO> updateCourt(@PathVariable String id, @RequestBody CourtDTO courtDTO) {
        return ApiResponse.<CourtDTO>builder()
                .success(true)
                .message("Cập nhật thông tin sân thành công")
                .data(courtService.updateCourt(id, courtDTO))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCourt(@PathVariable String id) {
        courtService.deleteCourt(id);
        return ApiResponse.<Void>builder()
                .success(true)
                .message("Xóa sân thành công")
                .build();
    }
} 