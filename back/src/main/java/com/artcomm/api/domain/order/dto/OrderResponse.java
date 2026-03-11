package com.artcomm.api.domain.order.dto;

import com.artcomm.api.domain.order.entity.Order;
import com.artcomm.api.domain.order.entity.OrderOption;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {

    private Long id;
    private String commissionTitle;
    private String commissionThumbnailUrl;
    private String creatorNickname;
    private Integer totalPrice;
    private String requestDetail;
    private String status;
    private List<OptionSnapshot> selectedOptions;
    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class OptionSnapshot {
        private String optionName;
        private Integer optionPrice;

        public static OptionSnapshot from(OrderOption opt) {
            return OptionSnapshot.builder()
                    .optionName(opt.getOptionName())
                    .optionPrice(opt.getOptionPrice())
                    .build();
        }
    }

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .commissionTitle(order.getCommission().getTitle())
                .commissionThumbnailUrl(order.getCommission().getThumbnailUrl())
                .creatorNickname(order.getCommission().getArtist().getNickname())
                .totalPrice(order.getTotalPrice())
                .requestDetail(order.getRequestDetail())
                .status(order.getStatus())
                .selectedOptions(order.getOrderOptions().stream()
                        .map(OptionSnapshot::from)
                        .toList())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
