package com.project.court88be.dto.response;

import com.project.court88be.enums.ShiftType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ShiftResponse {
    private String id;
    private ShiftType type;
    private LocalDate date;
    private boolean active;
    private String description;
    private String timeRange;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
} 