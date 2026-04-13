package com.checkmate.server.domain.memo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PinVerifyRequest {
    private String pin;
}