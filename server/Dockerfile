# --- 1단계: 빌드 스테이지 ---
# Gradle과 JDK가 포함된 이미지를 사용하여 JAR 생성
FROM gradle:7.6-jdk17-alpine AS builder
WORKDIR /build

# 빌드 효율을 위해 설정 파일들을 먼저 복사하고 종속성 다운로드
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# 실제 빌드 수행 (테스트는 제외)
RUN ./gradlew clean build -x test

# --- 2단계: 실행 스테이지 ---
# 실행을 위한 경량화된 런타임 이미지
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 빌드 스테이지에서 생성된 JAR 파일만 가져오기
COPY --from=builder /build/build/libs/*.jar app.jar

# 타임존 설정
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

ENTRYPOINT ["java", "-jar", "app.jar"]