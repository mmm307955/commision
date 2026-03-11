package com.artcomm.api.domain.commission.dto;

import com.artcomm.api.domain.commission.entity.Commission;
import com.artcomm.api.domain.commission.entity.CommissionOption;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CommissionResponse {

    private Long id;
    private String title;
    private String description;
    private Integer basePrice;
    private String thumbnailUrl;
    private String status;

    // 창작자 정보
    private Long artistId;
    private String artistNickname;
    private String artistProfileImageUrl;

    private List<OptionResponse> options;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    public static class OptionResponse {
        private Long id;
        private String optionName;
        private Integer additionalPrice;

        public static OptionResponse from(CommissionOption option) {
            return OptionResponse.builder()
                    .id(option.getId())
                    .optionName(option.getOptionName())
                    .additionalPrice(option.getAdditionalPrice())
                    .build();
        }
    }

    public static CommissionResponse from(Commission commission) {
        return CommissionResponse.builder()
                .id(commission.getId())
                .title(commission.getTitle())
                .description(commission.getDescription())
                .basePrice(commission.getBasePrice())
                .thumbnailUrl(commission.getThumbnailUrl())
                .status(commission.getStatus())
                .artistId(commission.getArtist().getId())
                .artistNickname(commission.getArtist().getNickname())
                .artistProfileImageUrl(commission.getArtist().getProfileImageUrl())
                .options(commission.getOptions().stream()
                        .map(OptionResponse::from)
                        .toList())
                .createdAt(commission.getCreatedAt())
                .updatedAt(commission.getUpdatedAt())
                .build();
    }
}
