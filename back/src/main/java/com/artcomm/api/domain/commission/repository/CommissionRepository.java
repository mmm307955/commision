package com.artcomm.api.domain.commission.repository;

import com.artcomm.api.domain.commission.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommissionRepository extends JpaRepository<Commission, Long> {

    @Query("SELECT c FROM Commission c JOIN FETCH c.artist ORDER BY c.createdAt DESC")
    List<Commission> findAllWithArtist();

    @Query("SELECT c FROM Commission c JOIN FETCH c.artist LEFT JOIN FETCH c.options WHERE c.id = :id")
    Optional<Commission> findByIdWithDetails(Long id);

    List<Commission> findByArtistIdOrderByCreatedAtDesc(Long artistId);
}
