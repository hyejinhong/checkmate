package com.checkmate.server.domain.presence.controller;

import com.checkmate.server.domain.presence.PresenceStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceStore presenceStore;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/memo/{shareKey}/presence/heartbeat")
    public void handleHeartbeat(@DestinationVariable String shareKey,
                                @Header("simpSessionId") String sessionId) {
        log.debug("[Heartbeat] sessionId: {}", sessionId);
        presenceStore.heartbeat(sessionId);
    }

    @MessageMapping("/memo/{shareKey}/presence/join")
    public void handleJoin(@DestinationVariable String shareKey) {
        var users = presenceStore.getActiveUsers(shareKey);
        log.info("[Join] Room: {}, ActiveUsers: {}", shareKey, users.size());
        messagingTemplate.convertAndSend(
                "/topic/memo/" + shareKey + "/presence", users
        );
    }
}