package com.checkmate.server.domain.memo.dto;

import com.checkmate.server.domain.memo.entity.Memo;
import com.checkmate.server.domain.memo.entity.MemoItem;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class MemoDetailResponse {
    private String title;
    private String colorCode;
    private LocalDateTime createdAt;
    private List<MemoItemResponse> items;

    @Getter
    @Builder
    public static class MemoItemResponse {
        private Long id;
        private String content;
        private boolean isCompleted;
        private Integer priority;

        public static MemoItemResponse from(MemoItem item) {
            return MemoItemResponse.builder()
                    .id(item.getId())
                    .content(item.getContent())
                    .isCompleted(item.isCompleted())
                    .priority(item.getPriority())
                    .build();
        }
    }

    public static MemoDetailResponse from(Memo memo) {
        return MemoDetailResponse.builder()
                .title(memo.getTitle())
                .colorCode(memo.getColorCode())
                .createdAt(memo.getCreatedAt())
                .items(memo.getItems().stream()
                        .map(item -> MemoItemResponse.builder()
                                .id(item.getId())
                                .content(item.getContent())
                                .isCompleted(item.isCompleted())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}