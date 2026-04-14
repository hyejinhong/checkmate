package com.checkmate.server.domain.presence.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresenceUser {
    private String userId;     // 브라우저 식별자 (viewerId)
    private String nickname;   // 익명 닉네임
    private String color;      // 아바타 색상
    private String emoji;
}