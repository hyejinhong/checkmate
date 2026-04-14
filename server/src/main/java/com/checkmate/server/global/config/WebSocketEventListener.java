package com.checkmate.server.global.config;

import com.checkmate.server.domain.presence.PresenceStore;
import com.checkmate.server.domain.presence.dto.PresenceConnection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final PresenceStore presenceStore;
    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // 프론트엔드에서 연결 시점에 헤더에 담아 보낼 정보
        String sessionId = headerAccessor.getSessionId();
        String shareKey = headerAccessor.getFirstNativeHeader("shareKey");
        String viewerId = headerAccessor.getFirstNativeHeader("viewerId");
        String nickname = headerAccessor.getFirstNativeHeader("nickname");
        String color = headerAccessor.getFirstNativeHeader("color");
        String emoji = headerAccessor.getFirstNativeHeader("emoji");

        if (shareKey != null && viewerId != null) {
            // 나갈 때 disconnnect 쓰기 위해 세션 속성에 shareKey 저장
            Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
            if (sessionAttributes != null) {
                sessionAttributes.put("shareKey", shareKey);
            }

            PresenceConnection conn = PresenceConnection.builder()
                    .connectionId(sessionId)
                    .viewerId(viewerId)
                    .shareKey(shareKey)
                    .nickname(nickname)
                    .color(color)
                    .emoji(emoji)
                    .build();

            presenceStore.connect(conn);
            log.info("[Connect] Room: {}, User: {}", shareKey, nickname);

            // 입장 알림 (명단 갱신)
            broadcastPresence(shareKey);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // 입장시 저장한 shareKey 꺼냄
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        String shareKey = (sessionAttributes != null) ? (String) sessionAttributes.get("shareKey") : null;

        presenceStore.disconnect(sessionId);
        log.info("[Disconnect] Session: {}, Room: {}", sessionId, shareKey);

        if (shareKey != null) {
            // 퇴장 알림 (명단 갱신)
            broadcastPresence(shareKey);
        }
    }

    private void broadcastPresence(String shareKey) {
        messagingTemplate.convertAndSend("/topic/memo/" + shareKey + "/presence",
                presenceStore.getActiveUsers(shareKey));
    }
}