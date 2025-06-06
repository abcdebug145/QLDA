package com.project.court88be.dto.request;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class BookingRequest {
    private Date date;
    private int paymentPercent;
    private List<CourtBooking> courts;
    private UserInfo userInfo;

    @Data
    public static class CourtBooking {
        private String courtName;
        private List<String> slots;
    }

    @Data
    public static class UserInfo {
        private String name;
        private String phone;
    }
}