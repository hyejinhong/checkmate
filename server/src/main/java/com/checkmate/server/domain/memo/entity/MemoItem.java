package com.checkmate.server.domain.memo.entity;

import com.checkmate.server.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "memo_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemoItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memo_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Memo memo;

    private String content;
    private boolean isCompleted;
    private int priority; // 순서 보장용

    @Builder
    public MemoItem(Memo memo, String content, int priority) {
        this.memo = memo;
        this.content = content;
        this.isCompleted = false;
        this.priority = priority;
    }
}
