package com.artcomm.api.auth.oauth2;

import com.artcomm.api.auth.jwt.JwtTokenProvider;
import com.artcomm.api.domain.user.entity.User;
import com.artcomm.api.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 로그인 성공 시 JWT를 발급하고 프론트엔드로 리다이렉트하는 핸들러.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

        private final JwtTokenProvider jwtTokenProvider;
        private final UserRepository userRepository;

        @Value("${app.frontend-url:http://localhost:5173}")
        private String frontendUrl;

        @Override
        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                        Authentication authentication) throws IOException {

                OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
                OAuth2User oAuth2User = oAuth2Token.getPrincipal();
                String registrationId = oAuth2Token.getAuthorizedClientRegistrationId(); // google, kakao
                String provider = registrationId.toUpperCase();

                OAuth2UserInfo userInfo = new OAuth2UserInfo(provider, oAuth2User.getAttributes());
                String providerId = userInfo.getProviderId();

                // DB에서 사용자 조회
                User user = userRepository.findByProviderAndProviderId(provider, providerId)
                                .orElseThrow(() -> new RuntimeException(
                                                "OAuth2 사용자를 찾을 수 없습니다: " + provider + "/" + providerId));

                // JWT 토큰 발급
                String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getRole());

                log.info("OAuth2 로그인 성공: userId={}, email={}, provider={}", user.getId(), user.getEmail(), provider);

                // 프론트엔드 콜백 URL로 리다이렉트 (토큰 & 사용자 정보 전달)
                String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth/callback")
                                .queryParam("token", token)
                                .queryParam("userId", user.getId())
                                .queryParam("email", user.getEmail())
                                .queryParam("nickname", user.getNickname())
                                .queryParam("role", user.getRole())
                                .encode()
                                .build()
                                .toUriString();

                getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }
}
