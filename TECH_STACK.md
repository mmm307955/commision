# 커미미 (Comimi) 기술 스택

> 그림 커미션 플랫폼 — 2026

---

## Backend

| 구분 | 기술 | 버전 |
|------|------|------|
| **Language** | Java | 21 |
| **Framework** | Spring Boot | 3.4.3 |
| **ORM** | Spring Data JPA (Hibernate) | 6.6.8 |
| **Security** | Spring Security | 6.x |
| **인증** | JWT (jjwt) | 0.12.6 |
| **소셜 로그인** | Spring OAuth2 Client | (Boot 관리) |
| **Database** | PostgreSQL | 17.x |
| **API 문서** | SpringDoc OpenAPI (Swagger) | 2.8.6 |
| **유틸** | Lombok | (Boot 관리) |
| **빌드** | Gradle | Wrapper |
| **테스트** | JUnit 5 + Spring Security Test | (Boot 관리) |

### 주요 의존성 (`build.gradle`)
```
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-validation
spring-boot-starter-security
spring-boot-starter-oauth2-client
postgresql
lombok
springdoc-openapi-starter-webmvc-ui
jjwt-api / jjwt-impl / jjwt-jackson
```

---

## Frontend

| 구분 | 기술 | 버전 |
|------|------|------|
| **Language** | TypeScript (JSX) | — |
| **UI Library** | React | 18.3.1 |
| **Build Tool** | Vite | 6.3.5 |
| **Routing** | React Router | 7.13.0 |
| **CSS** | TailwindCSS | 4.1.12 |
| **UI 컴포넌트** | Radix UI + shadcn/ui | 다수 |
| **MUI** | MUI Material + Icons | 7.3.5 |
| **HTTP 클라이언트** | Axios | 1.13.x |
| **애니메이션** | Motion (Framer Motion) | 12.23.24 |
| **아이콘** | Lucide React | 0.487.0 |
| **차트** | Recharts | 2.15.2 |
| **폼** | React Hook Form | 7.55.0 |
| **DnD** | React DnD | 16.0.1 |
| **기타** | Sonner (토스트), Vaul (드로어), date-fns, cmdk 등 | — |

---

## 인프라 & 환경

| 구분 | 내용 |
|------|------|
| **로컬 실행** | 백엔드 `localhost:8080` / 프론트 `localhost:5173` |
| **DB** | PostgreSQL `localhost:5432/artcomm` |
| **프로파일** | `dev` (기본), `prod`, `oauth` |
| **인증 방식** | JWT (Stateless) + OAuth2 (Google, Kakao) |
| **API 스타일** | RESTful (`/api/**`) |
| **API 문서** | Swagger UI (`/swagger-ui/`) |

---

## 서버 실행 명령어

```bash
# 백엔드
cd back && ./gradlew bootRun

# 프론트엔드
cd front && npm run dev
```
