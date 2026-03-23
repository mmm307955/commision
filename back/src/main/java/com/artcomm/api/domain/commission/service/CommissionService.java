package com.artcomm.api.domain.commission.service;

import com.artcomm.api.domain.commission.dto.CommissionRequest;
import com.artcomm.api.domain.commission.dto.CommissionResponse;
import com.artcomm.api.domain.commission.entity.Commission;
import com.artcomm.api.domain.commission.entity.CommissionOption;
import com.artcomm.api.domain.commission.repository.CommissionRepository;
import com.artcomm.api.domain.user.entity.User;
import com.artcomm.api.domain.user.repository.UserRepository;
import com.artcomm.api.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;

    /**
     * 커미션 목록 조회
     */
    public List<CommissionResponse> getAllCommissions() {
        return commissionRepository.findAllWithArtist().stream()
                .map(CommissionResponse::from)
                .toList();
    }

    /**
     * 커미션 상세 조회 (옵션 포함)
     */
    public CommissionResponse getCommission(Long id) {
        Commission commission = commissionRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new BusinessException(404, "커미션을 찾을 수 없습니다. id=" + id));
        return CommissionResponse.from(commission);
    }

    /**
     * 커미션 등록 (옵션 리스트 포함)
     */
    @Transactional
    public CommissionResponse createCommission(Long artistId, CommissionRequest request) {
        User artist = userRepository.findById(artistId)
                .orElseThrow(() -> new BusinessException(404, "사용자를 찾을 수 없습니다."));

        Commission commission = Commission.builder()
                .artist(artist)
                .title(request.getTitle())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .thumbnailUrl(request.getThumbnailUrl())
                .build();

        // 옵션 추가
        for (CommissionRequest.OptionRequest optReq : request.getOptions()) {
            CommissionOption option = CommissionOption.builder()
                    .commission(commission)
                    .optionName(optReq.getOptionName())
                    .additionalPrice(optReq.getAdditionalPrice())
                    .build();
            commission.getOptions().add(option);
        }

        Commission saved = commissionRepository.save(commission);
        return CommissionResponse.from(saved);
    }

    /**
     * 커미션 수정
     */
    @Transactional
    public CommissionResponse updateCommission(Long id, Long artistId, CommissionRequest request) {
        Commission commission = commissionRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new BusinessException(404, "커미션을 찾을 수 없습니다."));

        if (!commission.getArtist().getId().equals(artistId)) {
            throw new BusinessException(403, "본인의 커미션만 수정할 수 있습니다.");
        }

        commission.update(request.getTitle(), request.getDescription(),
                request.getBasePrice(), request.getThumbnailUrl());

        // 기존 옵션 삭제 후 재등록
        commission.getOptions().clear();
        for (CommissionRequest.OptionRequest optReq : request.getOptions()) {
            CommissionOption option = CommissionOption.builder()
                    .commission(commission)
                    .optionName(optReq.getOptionName())
                    .additionalPrice(optReq.getAdditionalPrice())
                    .build();
            commission.getOptions().add(option);
        }

        return CommissionResponse.from(commission);
    }

    /**
     * 커미션 삭제
     */
    @Transactional
    public void deleteCommission(Long id, Long artistId) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new BusinessException(404, "커미션을 찾을 수 없습니다."));

        if (!commission.getArtist().getId().equals(artistId)) {
            throw new BusinessException(403, "본인의 커미션만 삭제할 수 있습니다.");
        }

        commissionRepository.delete(commission);
    }

}
