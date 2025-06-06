package com.project.court88be.repository;

import com.project.court88be.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByDate(LocalDate date);
    List<Booking> findByUser_Phone(String phone);
} 