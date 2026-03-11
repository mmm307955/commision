-- =============================================
-- 커미미(Comimi) 커미션 플랫폼 DDL (PostgreSQL)
-- 개선 사항 적용 버전
-- =============================================

-- 1. 사용자 테이블 (Users)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),                          -- nullable: 소셜 로그인 사용자
    nickname VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',               -- USER, ADMIN
    profile_image_url VARCHAR(500),                 -- 프로필 이미지
    bio TEXT,                                       -- 창작자 자기소개
    provider VARCHAR(20) DEFAULT 'LOCAL',           -- LOCAL, GOOGLE, KAKAO
    provider_id VARCHAR(255),                       -- 소셜 로그인 고유 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 커미션 게시글 테이블 (Commissions)
CREATE TABLE IF NOT EXISTS commissions (
    id BIGSERIAL PRIMARY KEY,
    artist_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL DEFAULT 0,
    thumbnail_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'OPEN',              -- OPEN, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 3. 커미션 옵션 테이블 (Commission_Options)
CREATE TABLE IF NOT EXISTS commission_options (
    id BIGSERIAL PRIMARY KEY,
    commission_id BIGINT NOT NULL,
    option_name VARCHAR(100) NOT NULL,
    additional_price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 가격 변경 이력 추적
    FOREIGN KEY (commission_id) REFERENCES commissions (id) ON DELETE CASCADE
);

-- 4. 주문/신청 테이블 (Orders)
-- 상태: PENDING(입금대기) → PAID(입금확인) → IN_PROGRESS(작업중) → REVIEW(검토) → COMPLETED(완료) / CANCELLED(취소)
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    commission_id BIGINT NOT NULL,
    total_price INTEGER NOT NULL,
    request_detail TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users (id),
    FOREIGN KEY (commission_id) REFERENCES commissions (id)
);

-- 5. 주문 선택 옵션 테이블 (Order_Options)
-- 결제 당시의 가격 스냅샷 저장
CREATE TABLE IF NOT EXISTS order_options (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    option_name VARCHAR(100) NOT NULL,
    option_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);

-- =============================================
-- 인덱스 (FK 컬럼 조회 성능 향상)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_commissions_artist_id ON commissions(artist_id);
CREATE INDEX IF NOT EXISTS idx_commission_options_commission_id ON commission_options(commission_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_commission_id ON orders(commission_id);
CREATE INDEX IF NOT EXISTS idx_order_options_order_id ON order_options(order_id);
