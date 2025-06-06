package com.project.court88be.service;

import com.project.court88be.dto.CourtDTO;
import com.project.court88be.entity.Court;
import com.project.court88be.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourtService {
    private final CourtRepository courtRepository;

    public List<CourtDTO> getAllCourts() {
        return courtRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourtDTO getCourtById(String id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân với id: " + id));
        return convertToDTO(court);
    }

    @Transactional
    public CourtDTO createCourt(CourtDTO courtDTO) {
        Court court = Court.builder()
                .name(courtDTO.getName())
                .build();
        return convertToDTO(courtRepository.save(court));
    }

    @Transactional
    public CourtDTO updateCourt(String id, CourtDTO courtDTO) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân với id: " + id));
        
        court.setName(courtDTO.getName());
        
        return convertToDTO(courtRepository.save(court));
    }

    @Transactional
    public void deleteCourt(String id) {
        if (!courtRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sân với id: " + id);
        }
        courtRepository.deleteById(id);
    }

    private CourtDTO convertToDTO(Court court) {
        return CourtDTO.builder()
                .id(court.getId())
                .name(court.getName())
                .build();
    }
} 