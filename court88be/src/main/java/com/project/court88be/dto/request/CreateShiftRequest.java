package com.project.court88be.dto.request;

import com.project.court88be.enums.ShiftType;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class CreateShiftRequest {
    // Nếu tạo một ca
    private ShiftType type;
    private LocalDate date;
    private boolean active = true;

    // Nếu tạo nhiều ca
    private Map<LocalDate, List<ShiftType>> shifts;
} 