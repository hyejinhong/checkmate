package com.checkmate.server.domain.memo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemoCreateRequest {
    @NotBlank
    @Size(max = 100)
    private String title;

    @Pattern(regexp = "^#[0-9a-fA-F]{6}$")
    private String colorCode;

    @Pattern(regexp = "^[0-9]{4}$")
    private String pin;
}