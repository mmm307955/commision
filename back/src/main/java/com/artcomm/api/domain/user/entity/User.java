package com.artcomm.api.domain.user.entity;

import com.artcomm.api.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 255) // nullable: 소셜 로그인 사용자는 비밀번호 없음
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(length = 20)
    @Builder.Default
    private String role = "USER"; // USER, ADMIN

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 20)
    @Builder.Default
    private String provider = "LOCAL"; // LOCAL, GOOGLE, KAKAO

    @Column(name = "provider_id", length = 255)
    private String providerId;

    /**
     * 소셜 로그인 시 기존 사용자 정보 업데이트
     */
    public void updateOAuth2Info(String nickname, String profileImageUrl) {
        this.nickname = nickname;
        if (profileImageUrl != null) {
            this.profileImageUrl = profileImageUrl;
        }
    }
}
