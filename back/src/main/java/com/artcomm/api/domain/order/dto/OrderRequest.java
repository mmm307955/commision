package com.artcomm.api.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class OrderRequest {

    @NotNull(message = "커미션 ID는 필수입니다.")
    private Long commissionId;

    @NotBlank(message = "요구사항은 필수입니다.")
    private String requestDetail;

    private List<Long> selectedOptionIds = new ArrayList<>(); // 선택한 옵션의 ID 목록
}
