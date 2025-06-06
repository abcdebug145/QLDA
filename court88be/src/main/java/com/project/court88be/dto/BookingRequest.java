package com.project.court88be.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {
    private LocalDate date;
    private int paymentPercent;
    private List<CourtBooking> courts;
    private UserInfo userInfo;

    @Data
    public static class CourtBooking {
        private String courtName;
        private List<SlotInfo> slots;
    }

    @Data
    public static class SlotInfo {
        private String timeSlot; // Format: HH:mm
        private int price;
    }

    @Data
    public static class UserInfo {
        private String name;
        private String phone;
    }
} 