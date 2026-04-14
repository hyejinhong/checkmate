package com.checkmate.server.domain.presence.redis;

import com.checkmate.server.domain.presence.dto.PresenceConnection;
import com.checkmate.server.domain.presence.PresenceStore;
import com.checkmate.server.domain.presence.dto.PresenceUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisPresenceStore implements PresenceStore {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper; // JSON 변환용

    private static final String ROOM_KEY_PREFIX = "presence:room:";
    private static final String CONN_KEY_PREFIX = "presence:conn:";
    private static final String VIEWER_KEY_PREFIX = "presence:viewer:";
    private static final long TTL_SECONDS = 60; // 1분 무응답 시 유령 유저 판단

    @Override
    public void connect(PresenceConnection conn) {
        String roomKey = ROOM_KEY_PREFIX + conn.getShareKey();
        String connKey = CONN_KEY_PREFIX + conn.getConnectionId();
        String viewerKey = VIEWER_KEY_PREFIX + conn.getShareKey() + ":" + conn.getViewerId();

        // 같은 viewerId의 이전 connectionId가 있으면 먼저 제거
        String oldConnId = redisTemplate.opsForValue().get(viewerKey);
        if (oldConnId != null) {
            redisTemplate.opsForZSet().remove(roomKey, oldConnId);
            redisTemplate.delete(CONN_KEY_PREFIX + oldConnId);
        }

        // 1. 방별 ZSET에 세션 ID 추가 (Score는 현재 시간)
        redisTemplate.opsForZSet().add(roomKey, conn.getConnectionId(), System.currentTimeMillis());

        // 2. 세션 상세 정보(Hash) 저장
        Map<String, Object> meta = objectMapper.convertValue(conn, Map.class);
        log.info("[Connect] meta: {}", meta);
        redisTemplate.opsForHash().putAll(connKey, meta);
        redisTemplate.expire(connKey, TTL_SECONDS, TimeUnit.SECONDS);

        // viewerId → connectionId 인덱스 저장
        redisTemplate.opsForValue().set(viewerKey, conn.getConnectionId(), TTL_SECONDS, TimeUnit.SECONDS);
    }

    @Override
    public void heartbeat(String connectionId) {
        String connKey = CONN_KEY_PREFIX + connectionId;
        String shareKey = (String) redisTemplate.opsForHash().get(connKey, "shareKey");
        String viewerId = (String) redisTemplate.opsForHash().get(connKey, "viewerId");

        // 상세 정보에서 shareKey를 꺼내와서 ZSET 점수 갱신
        if (shareKey != null) {
            redisTemplate.opsForZSet().add(ROOM_KEY_PREFIX + shareKey, connectionId, System.currentTimeMillis());
            redisTemplate.expire(connKey, TTL_SECONDS, TimeUnit.SECONDS);

            // viewerKey TTL도 같이 갱신
            String viewerKey = VIEWER_KEY_PREFIX + shareKey + ":" + viewerId;
            redisTemplate.expire(viewerKey, TTL_SECONDS, TimeUnit.SECONDS);
        }
    }

    @Override
    public void disconnect(String connectionId) {
        String connKey = CONN_KEY_PREFIX + connectionId;
        String shareKey = (String) redisTemplate.opsForHash().get(connKey, "shareKey");
        String viewerId = (String) redisTemplate.opsForHash().get(connKey, "viewerId");

        if (shareKey != null) {
            redisTemplate.opsForZSet().remove(ROOM_KEY_PREFIX + shareKey, connectionId);
            redisTemplate.delete(VIEWER_KEY_PREFIX + shareKey + ":" + viewerId);
        }
        redisTemplate.delete(connKey);
    }

    @Override
    public List<PresenceUser> getActiveUsers(String shareKey) {
        String roomKey = ROOM_KEY_PREFIX + shareKey;

        // ZSET에서 모든 세션 ID 조회
        Set<String> connIds = redisTemplate.opsForZSet().range(roomKey, 0, -1);
        if (connIds == null) return Collections.emptyList();

        return connIds.stream()
                .map(id -> {
                    Map<Object, Object> meta = redisTemplate.opsForHash().entries(CONN_KEY_PREFIX + id);
                    if (meta.isEmpty()) return null;
                    return PresenceUser.builder()
                            .userId((String) meta.get("viewerId"))
                            .nickname((String) meta.get("nickname"))
                            .color((String) meta.get("color"))
                            .emoji((String) meta.get("emoji"))
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}