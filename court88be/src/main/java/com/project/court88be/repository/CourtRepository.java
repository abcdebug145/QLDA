package com.project.court88be.repository;

import com.project.court88be.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CourtRepository extends JpaRepository<Court, String> {
    Optional<Court> findByName(String name);
} 