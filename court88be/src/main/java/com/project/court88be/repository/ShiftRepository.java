package com.project.court88be.repository;

import com.project.court88be.entity.Shift;
import com.project.court88be.entity.User;
import com.project.court88be.enums.ShiftType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, String> {
    List<Shift> findByUserAndDate(User user, LocalDate date);
    List<Shift> findByUserAndDateAndType(User user, LocalDate date, ShiftType type);
    List<Shift> findByUser(User user);
} 