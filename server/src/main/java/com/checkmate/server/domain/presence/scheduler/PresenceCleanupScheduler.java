package com.checkmate.server.domain.presence.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class PresenceCleanupScheduler {

    private final StringRedisTemplate redisTemplate;

    private static final String ROOM_KEY_PREFIX = "presence:room:";
    private static final long STALE_THRESHOLD_MS = 60_000; // 60초

    @Scheduled(fixedDelay = 30_000) // 30초마다 실행
    public void cleanupStaleConnections() {
        // presence:room:* 키 전체 스캔
        Set<String> roomKeys = redisTemplate.keys(ROOM_KEY_PREFIX + "*");
        if (roomKeys == null) return;

        long cutoff = System.currentTimeMillis() - STALE_THRESHOLD_MS;

        for (String roomKey : roomKeys) {
            // score(타임스탬프)가 cutoff보다 오래된 member 제거
            redisTemplate.opsForZSet().removeRangeByScore(roomKey, 0, cutoff);
        }
    }
}