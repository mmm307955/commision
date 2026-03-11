package com.artcomm.api.domain.commission.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class CommissionRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    private String description;

    @NotNull(message = "기본 가격은 필수입니다.")
    @Min(value = 0, message = "가격은 0 이상이어야 합니다.")
    private Integer basePrice;

    private String thumbnailUrl;

    @Valid
    private List<OptionRequest> options = new ArrayList<>();

    @Getter
    @NoArgsConstructor
    public static class OptionRequest {
        @NotBlank(message = "옵션명은 필수입니다.")
        private String optionName;

        @NotNull(message = "추가 가격은 필수입니다.")
        @Min(value = 0, message = "추가 가격은 0 이상이어야 합니다.")
        private Integer additionalPrice;
    }
}
