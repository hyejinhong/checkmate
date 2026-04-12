package com.checkmate.server.domain.memo.controller;

import com.checkmate.server.domain.memo.dto.MemoCreateRequest;
import com.checkmate.server.domain.memo.service.MemoService;
import com.checkmate.server.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/memos")
@RequiredArgsConstructor
public class MemoController {

    private final MemoService memoService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createMemo(@Valid @RequestBody MemoCreateRequest request) {
        String shareKey = memoService.createMemo(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(shareKey, "메모장이 성공적으로 생성되었습니다."));
    }
}