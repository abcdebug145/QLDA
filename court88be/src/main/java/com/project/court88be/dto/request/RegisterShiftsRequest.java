package com.project.court88be.dto.request;

import com.project.court88be.enums.ShiftType;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class RegisterShiftsRequest {
    private Map<String, List<ShiftType>> shifts;
} 