package com.project.court88be.enums;

public enum ShiftType {
    MORNING("MORNING", "07:00-11:00"),
    AFTERNOON("AFTERNOON", "13:00-17:00"),
    EVENING("EVENING", "18:00-22:00");

    private final String description;
    private final String timeRange;

    ShiftType(String description, String timeRange) {
        this.description = description;
        this.timeRange = timeRange;
    }

    public String getDescription() {
        return description;
    }

    public String getTimeRange() {
        return timeRange;
    }
} 