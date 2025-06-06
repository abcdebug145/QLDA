package com.project.court88be.entity;

import com.project.court88be.enums.ShiftType;
import com.project.court88be.enums.ShiftStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftType type;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private boolean active;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftStatus status;

    @Column(nullable = true)
    private LocalDateTime startAt;

    @Column(nullable = true)
    private LocalDateTime endAt;

    // Có thể thêm các trường khác nếu cần (checkIn, checkOut, ...)
} 