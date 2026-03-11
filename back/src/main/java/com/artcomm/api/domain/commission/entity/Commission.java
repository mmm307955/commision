package com.artcomm.api.domain.commission.entity;

import com.artcomm.api.domain.user.entity.User;
import com.artcomm.api.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commissions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Commission extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private User artist;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price", nullable = false)
    @Builder.Default
    private Integer basePrice = 0;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(length = 20)
    @Builder.Default
    private String status = "OPEN"; // OPEN, CLOSED

    @OneToMany(mappedBy = "commission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CommissionOption> options = new ArrayList<>();

    public void update(String title, String description, Integer basePrice, String thumbnailUrl) {
        this.title = title;
        this.description = description;
        this.basePrice = basePrice;
        this.thumbnailUrl = thumbnailUrl;
    }
}
