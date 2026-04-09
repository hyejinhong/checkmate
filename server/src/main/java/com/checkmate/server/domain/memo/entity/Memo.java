package com.checkmate.server.domain.memo.entity;

import com.checkmate.server.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "memos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Memo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shareKey;

    private String title;
    private String colorCode;
    private String pin;

    @OneToMany(mappedBy = "memo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MemoItem> items = new ArrayList<>();

    @Builder
    public Memo(String title, String colorCode, String pin) {
        this.shareKey = UUID.randomUUID().toString();
        this.title = title;
        this.colorCode = colorCode;
        this.pin = pin;
    }
}