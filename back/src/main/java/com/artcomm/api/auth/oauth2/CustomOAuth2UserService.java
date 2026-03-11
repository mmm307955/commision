package com.artcomm.api.auth.oauth2;

import com.artcomm.api.domain.user.entity.User;
import com.artcomm.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * OAuth2 로그인 시 사용자 정보를 DB에 저장/업데이트하는 서비스.
 * Google, Kakao 등 provider별 사용자 정보를 파싱하여 User 엔티티로 변환합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google, kakao
        String provider = registrationId.toUpperCase();

        OAuth2UserInfo userInfo = new OAuth2UserInfo(provider, oAuth2User.getAttributes());

        String providerId = userInfo.getProviderId();
        String email = userInfo.getEmail();
        String nickname = userInfo.getNickname();
        String profileImageUrl = userInfo.getProfileImageUrl();

        log.info("OAuth2 로그인: provider={}, providerId={}, email={}, nickname={}",
                provider, providerId, email, nickname);

        // 기존 사용자 조회 (provider + providerId로 먼저 조회)
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);

        User user;
        if (existingUser.isPresent()) {
            // 기존 소셜 로그인 사용자: 정보 업데이트
            user = existingUser.get();
            user.updateOAuth2Info(
                    nickname != null ? nickname : user.getNickname(),
                    profileImageUrl);
        } else {
            // 신규 사용자: 회원 생성
            user = User.builder()
                    .email(email != null ? email : provider + "_" + providerId + "@social.user")
                    .nickname(nickname != null ? nickname : provider + " 사용자")
                    .profileImageUrl(profileImageUrl)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            userRepository.save(user);
        }

        return oAuth2User;
    }
}
