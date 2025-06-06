package com.project.court88be.service;

import com.project.court88be.dto.BookingRequest;
import com.project.court88be.dto.BookingResponse;
import com.project.court88be.entity.Booking;
import com.project.court88be.entity.Court;
import com.project.court88be.entity.User;
import com.project.court88be.repository.BookingRepository;
import com.project.court88be.repository.CourtRepository;
import com.project.court88be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("H:mm");

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByPhone(String phone) {
        return bookingRepository.findByUser_Phone(phone).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByDate(LocalDate date) {
        return bookingRepository.findByDate(date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<BookingResponse> createBookings(BookingRequest request) {
        List<Booking> bookings = new ArrayList<>();
        
        // Tìm hoặc tạo user mới
        User user = userRepository.findByPhone(request.getUserInfo().getPhone())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .name(request.getUserInfo().getName())
                            .phone(request.getUserInfo().getPhone())
                            .build();
                    return userRepository.save(newUser);
                });

        // Xử lý từng sân và slot
        for (BookingRequest.CourtBooking courtBooking : request.getCourts()) {
            Court court = courtRepository.findByName(courtBooking.getCourtName())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sân: " + courtBooking.getCourtName()));

            for (BookingRequest.SlotInfo slotInfo : courtBooking.getSlots()) {
                LocalTime startTime = LocalTime.parse(slotInfo.getTimeSlot(), TIME_FORMATTER);
                LocalTime endTime = startTime.plusMinutes(30); // Mỗi slot là 30 phút

                Booking booking = Booking.builder()
                        .user(user)
                        .court(court)
                        .date(request.getDate())
                        .startTime(startTime)
                        .endTime(endTime)
                        .total(slotInfo.getPrice())
                        .status("APPROVED")
                        .build();
                
                bookings.add(bookingRepository.save(booking));
            }
        }

        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateBookingStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking với id: " + bookingId));
        
        booking.setStatus(status);
        return convertToResponse(bookingRepository.save(booking));
    }

    private BookingResponse convertToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .courtName(booking.getCourt().getName())
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .total(booking.getTotal())
                .status(booking.getStatus())
                .build();
    }
} 