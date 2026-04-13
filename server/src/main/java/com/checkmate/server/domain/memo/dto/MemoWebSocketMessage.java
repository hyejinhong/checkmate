package com.checkmate.server.domain.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoWebSocketMessage<T> {
    private String type; // ITEM_ADDED, ITEM_UPDATED, ITEM_DELETED 등
    private T data;      // 실제 전달할 데이터

    public static <T> MemoWebSocketMessage<T> of(String type, T data) {
        return MemoWebSocketMessage.<T>builder()
                .type(type)
                .data(data)
                .build();
    }
}