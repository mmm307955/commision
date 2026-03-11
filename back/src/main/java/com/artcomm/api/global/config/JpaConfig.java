package com.artcomm.api.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA Auditing 활성화 — BaseEntity의 @CreatedDate, @LastModifiedDate가 동작하도록 합니다.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
