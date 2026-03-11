package com.artcomm.api.auth.oauth2;

import java.util.Map;

/**
 * OAuth2 Provider별 사용자 정보 추출 유틸리티
 */
public class OAuth2UserInfo {

    private final String provider;
    private final Map<String, Object> attributes;

    public OAuth2UserInfo(String provider, Map<String, Object> attributes) {
        this.provider = provider;
        this.attributes = attributes;
    }

    public String getProviderId() {
        switch (provider.toUpperCase()) {
            case "GOOGLE":
                return (String) attributes.get("sub");
            case "KAKAO":
                return String.valueOf(attributes.get("id"));
            default:
                return null;
        }
    }

    public String getEmail() {
        switch (provider.toUpperCase()) {
            case "GOOGLE":
                return (String) attributes.get("email");
            case "KAKAO":
                @SuppressWarnings("unchecked")
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                if (kakaoAccount != null) {
                    return (String) kakaoAccount.get("email");
                }
                return null;
            default:
                return null;
        }
    }

    public String getNickname() {
        switch (provider.toUpperCase()) {
            case "GOOGLE":
                return (String) attributes.get("name");
            case "KAKAO":
                @SuppressWarnings("unchecked")
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                if (kakaoAccount != null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                    if (profile != null) {
                        return (String) profile.get("nickname");
                    }
                }
                return null;
            default:
                return null;
        }
    }

    public String getProfileImageUrl() {
        switch (provider.toUpperCase()) {
            case "GOOGLE":
                return (String) attributes.get("picture");
            case "KAKAO":
                @SuppressWarnings("unchecked")
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                if (kakaoAccount != null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                    if (profile != null) {
                        return (String) profile.get("profile_image_url");
                    }
                }
                return null;
            default:
                return null;
        }
    }
}
