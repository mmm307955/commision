package com.artcomm.api.global.config;

import com.artcomm.api.auth.jwt.JwtAuthenticationFilter;
import com.artcomm.api.auth.oauth2.CustomOAuth2UserService;
import com.artcomm.api.auth.oauth2.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정
 * - JWT 기반 Stateless 인증
 * - OAuth2 소셜 로그인 (Google, Kakao)
 * - 인증 불필요: 회원가입, 로그인, 커미션 조회, Swagger, OAuth2
 * - 인증 필요: 커미션 등록/수정/삭제, 주문
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> {
                                })
                                .csrf(AbstractHttpConfigurer::disable)
                                // OAuth2 로그인 플로우는 세션이 필요 (authorization request 상태 저장)
                                // JWT 인증은 JwtAuthenticationFilter로 여전히 stateless하게 동작
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                                .authorizeHttpRequests(auth -> auth
                                                // 인증 불필요
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/commissions/**").permitAll()
                                                // 인증 필요
                                                .requestMatchers("/api/orders/**").authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/commissions/**").authenticated()
                                                .requestMatchers(HttpMethod.PUT, "/api/commissions/**").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/commissions/**")
                                                .authenticated()
                                                // 나머지
                                                .anyRequest().permitAll())
                                // OAuth2 소셜 로그인 설정
                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2LoginSuccessHandler))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
