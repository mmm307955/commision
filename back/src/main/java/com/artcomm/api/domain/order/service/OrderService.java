package com.artcomm.api.domain.order.service;

import com.artcomm.api.domain.commission.entity.Commission;
import com.artcomm.api.domain.commission.entity.CommissionOption;
import com.artcomm.api.domain.commission.repository.CommissionRepository;
import com.artcomm.api.domain.order.dto.OrderRequest;
import com.artcomm.api.domain.order.dto.OrderResponse;
import com.artcomm.api.domain.order.entity.Order;
import com.artcomm.api.domain.order.entity.OrderOption;
import com.artcomm.api.domain.order.repository.OrderRepository;
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
public class OrderService {

    private final OrderRepository orderRepository;
    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;

    /**
     * 주문 생성 — 옵션 가격을 스냅샷으로 복사하여 저장
     */
    @Transactional
    public OrderResponse createOrder(Long buyerId, OrderRequest request) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new BusinessException(404, "사용자를 찾을 수 없습니다."));

        Commission commission = commissionRepository.findByIdWithDetails(request.getCommissionId())
                .orElseThrow(() -> new BusinessException(404, "커미션을 찾을 수 없습니다."));

        if (!commission.getStatus().equals("OPEN")) {
            throw new BusinessException(400, "현재 신청 마감된 커미션입니다.");
        }

        // 선택된 옵션의 가격 계산
        int optionTotal = 0;
        Order order = Order.builder()
                .buyer(buyer)
                .commission(commission)
                .totalPrice(0) // 아래에서 계산 후 설정
                .requestDetail(request.getRequestDetail())
                .build();

        for (Long optionId : request.getSelectedOptionIds()) {
            CommissionOption commOption = commission.getOptions().stream()
                    .filter(o -> o.getId().equals(optionId))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException(400, "유효하지 않은 옵션 ID: " + optionId));

            OrderOption orderOption = OrderOption.builder()
                    .order(order)
                    .optionName(commOption.getOptionName())
                    .optionPrice(commOption.getAdditionalPrice())
                    .build();

            order.getOrderOptions().add(orderOption);
            optionTotal += commOption.getAdditionalPrice();
        }

        order.updateTotalPrice(commission.getBasePrice() + optionTotal);
        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    /**
     * 내 주문 목록 조회
     */
    public List<OrderResponse> getMyOrders(Long buyerId) {
        return orderRepository.findByBuyerIdWithDetails(buyerId).stream()
                .map(OrderResponse::from)
                .toList();
    }

    /**
     * 주문 상태 변경 (PENDING → PAID → IN_PROGRESS → REVIEW → COMPLETED / CANCELLED)
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new BusinessException(404, "주문을 찾을 수 없습니다."));

        order.updateStatus(newStatus);
        return OrderResponse.from(order);
    }
}
