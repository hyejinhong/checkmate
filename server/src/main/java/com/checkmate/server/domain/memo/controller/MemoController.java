package com.checkmate.server.domain.memo.controller;

import com.checkmate.server.domain.memo.dto.ItemCreateRequest;
import com.checkmate.server.domain.memo.dto.MemoCreateRequest;
import com.checkmate.server.domain.memo.dto.MemoDetailResponse;
import com.checkmate.server.domain.memo.dto.PinVerifyRequest;
import com.checkmate.server.domain.memo.service.MemoService;
import com.checkmate.server.global.constant.ErrorCode;
import com.checkmate.server.global.dto.ApiResponse;
import com.checkmate.server.global.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memos")
@RequiredArgsConstructor
public class MemoController {

    private final MemoService memoService;

    @GetMapping("/{shareKey}")
    public ApiResponse<MemoDetailResponse> getMemo(@PathVariable String shareKey) {
        return ApiResponse.success(memoService.getMemo(shareKey));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createMemo(@Valid @RequestBody MemoCreateRequest request) {
        String shareKey = memoService.createMemo(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(shareKey, "메모장이 성공적으로 생성되었습니다."));
    }

    @PostMapping("/{shareKey}/verify")
    public ApiResponse<Boolean> verifyPin(
            @PathVariable String shareKey,
            @RequestBody PinVerifyRequest request
    ) {
        boolean isValid = memoService.verifyPin(shareKey, request.getPin());
        if (!isValid) {
            throw new BusinessException(ErrorCode.INVALID_PIN); // 401 또는 403 에러
        }
        return ApiResponse.success(true);
    }

    @PostMapping("/{shareKey}/items")
    public ApiResponse<MemoDetailResponse.MemoItemResponse> addItem(
            @PathVariable String shareKey,
            @RequestBody ItemCreateRequest request
    ) {
        // Service에서 비즈니스 로직 처리 후 저장된 아이템 정보를 반환
        MemoDetailResponse.MemoItemResponse newItem = memoService.addItem(shareKey, request.getContent());
        return ApiResponse.success(newItem);
    }

    @PatchMapping("/{shareKey}/items/{itemId}/toggle")
    public ApiResponse<Boolean> toggleItem(@PathVariable String shareKey, @PathVariable Long itemId) {
        memoService.toggleItemStatus(itemId);
        return ApiResponse.success(true);
    }

    @PutMapping("/{shareKey}/items/{itemId}")
    public ApiResponse<Boolean> updateItem(
            @PathVariable String shareKey,
            @PathVariable Long itemId,
            @RequestBody ItemCreateRequest request
    ) {
        memoService.updateItemContent(itemId, request.getContent());
        return ApiResponse.success(true);
    }

    @DeleteMapping("/{shareKey}/items/{itemId}")
    public ApiResponse<Boolean> deleteItem(@PathVariable String shareKey, @PathVariable Long itemId) {
        memoService.deleteItem(itemId);
        return ApiResponse.success(true);
    }
}