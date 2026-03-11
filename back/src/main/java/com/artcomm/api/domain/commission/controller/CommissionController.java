package com.artcomm.api.domain.commission.controller;

import com.artcomm.api.domain.commission.dto.CommissionRequest;
import com.artcomm.api.domain.commission.dto.CommissionResponse;
import com.artcomm.api.domain.commission.service.CommissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Commission", description = "커미션 API")
@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    @Operation(summary = "커미션 목록 조회")
    @GetMapping
    public ResponseEntity<List<CommissionResponse>> getAllCommissions() {
        return ResponseEntity.ok(commissionService.getAllCommissions());
    }

    @Operation(summary = "커미션 상세 조회")
    @GetMapping("/{id}")
    public ResponseEntity<CommissionResponse> getCommission(@PathVariable Long id) {
        return ResponseEntity.ok(commissionService.getCommission(id));
    }

    @Operation(summary = "커미션 등록 (옵션 포함)")
    @PostMapping
    public ResponseEntity<CommissionResponse> createCommission(
            Authentication authentication,
            @Valid @RequestBody CommissionRequest request) {
        Long artistId = (Long) authentication.getPrincipal();
        CommissionResponse response = commissionService.createCommission(artistId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "커미션 수정")
    @PutMapping("/{id}")
    public ResponseEntity<CommissionResponse> updateCommission(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody CommissionRequest request) {
        Long artistId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(commissionService.updateCommission(id, artistId, request));
    }

    @Operation(summary = "커미션 삭제")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommission(
            @PathVariable Long id,
            Authentication authentication) {
        Long artistId = (Long) authentication.getPrincipal();
        commissionService.deleteCommission(id, artistId);
        return ResponseEntity.noContent().build();
    }
}
