package com.checkmate.server.domain.presence.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresenceConnection {
    private String connectionId; // 웹소켓 세션 ID
    private String viewerId;     // 브라우저 고유 ID
    private String shareKey;     // 접속한 메모장 키
    private String nickname;     // 닉네임
    private String color;        // 색상
    private String emoji;
}