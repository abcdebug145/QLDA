package com.project.court88be.service;

import com.project.court88be.dto.request.RegisterShiftsRequest;
import com.project.court88be.dto.response.ShiftResponse;
import com.project.court88be.entity.Shift;
import com.project.court88be.entity.User;
import com.project.court88be.enums.ShiftStatus;
import com.project.court88be.enums.ShiftType;
import com.project.court88be.repository.ShiftRepository;
import com.project.court88be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftService {
    private final ShiftRepository shiftRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<ShiftResponse> registerMultipleShifts(String phone, Map<LocalDate, List<ShiftType>> shifts) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với số điện thoại: " + phone));

        List<ShiftResponse> registeredShifts = new ArrayList<>();

        for (Map.Entry<LocalDate, List<ShiftType>> entry : shifts.entrySet()) {
            LocalDate date = entry.getKey();
            List<ShiftType> shiftTypes = entry.getValue();

            for (ShiftType shiftType : shiftTypes) {
                boolean alreadyRegistered = !shiftRepository.findByUserAndDateAndType(user, date, shiftType).isEmpty();
                if (alreadyRegistered) {
                    throw new RuntimeException(
                            String.format("Người dùng đã đăng ký ca làm việc cho ngày %s và loại ca %s", date, shiftType));
                }

                Shift shift = Shift.builder()
                        .user(user)
                        .type(shiftType)
                        .date(date)
                        .active(true)
                        .status(ShiftStatus.ABSENT)
                        .build();

                registeredShifts.add(convertToResponse(shiftRepository.save(shift)));
            }
        }
        return registeredShifts;
    }

    @Transactional(readOnly = true)
    public List<ShiftResponse> getShiftsByPhone(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với số điện thoại: " + phone));
        return shiftRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShiftResponse> getShiftsByPhoneAndDate(String phone, String dateStr) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với số điện thoại: " + phone));
        LocalDate date = LocalDate.parse(dateStr);
        return shiftRepository.findByUserAndDate(user, date).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShiftResponse updateShiftStatus(String shiftId, ShiftStatus status) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca làm việc với id: " + shiftId));
        shift.setStatus(status);
        if (status == ShiftStatus.STARTED) {
            shift.setStartAt(LocalDateTime.now());
        } else if (status == ShiftStatus.ENDED) {
            shift.setEndAt(LocalDateTime.now());
        }
        return convertToResponse(shiftRepository.save(shift));
    }

    private ShiftResponse convertToResponse(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .type(shift.getType())
                .date(shift.getDate())
                .active(shift.isActive())
                .description(shift.getType().getDescription())
                .timeRange(shift.getType().getTimeRange())
                .startAt(shift.getStartAt())
                .endAt(shift.getEndAt())
                .build();
    }
} 