package com.checkmate.server.global.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Success
    SUCCESS(HttpStatus.OK, "S000", "요청에 성공했습니다."),

    // Memo Domain
    MEMO_NOT_FOUND(HttpStatus.NOT_FOUND, "M001", "해당 메모를 찾을 수 없습니다."),
    INVALID_PIN(HttpStatus.UNAUTHORIZED, "M002", "PIN 번호가 일치하지 않습니다."),

    // Global
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "G001", "잘못된 입력값입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "G002", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}