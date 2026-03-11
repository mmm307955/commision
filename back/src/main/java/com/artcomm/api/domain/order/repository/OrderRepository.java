package com.artcomm.api.domain.order.repository;

import com.artcomm.api.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.buyer " +
            "JOIN FETCH o.commission c " +
            "JOIN FETCH c.artist " +
            "WHERE o.buyer.id = :buyerId " +
            "ORDER BY o.createdAt DESC")
    List<Order> findByBuyerIdWithDetails(Long buyerId);

    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.buyer " +
            "JOIN FETCH o.commission c " +
            "JOIN FETCH c.artist " +
            "LEFT JOIN FETCH o.orderOptions " +
            "WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(Long id);
}
