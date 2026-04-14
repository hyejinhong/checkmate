package com.checkmate.server.domain.presence;

import com.checkmate.server.domain.presence.dto.PresenceConnection;
import com.checkmate.server.domain.presence.dto.PresenceUser;

import java.util.List;

public interface PresenceStore {
    // 유저가 접속했을 때 (정보 등록)
    void connect(PresenceConnection connection);

    // 접속 유지 (주기적 갱신)
    void heartbeat(String connectionId);

    // 유저가 나갔을 때 (정보 삭제)
    void disconnect(String connectionId);

    // 특정 방에 지금 누가 있는지 조회
    List<PresenceUser> getActiveUsers(String shareKey);
}