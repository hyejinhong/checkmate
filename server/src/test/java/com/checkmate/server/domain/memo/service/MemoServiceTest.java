package com.checkmate.server.domain.memo.service;

import com.checkmate.server.domain.memo.dto.MemoCreateRequest;
import com.checkmate.server.domain.memo.entity.Memo;
import com.checkmate.server.domain.memo.repository.MemoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;


@ExtendWith(MockitoExtension.class)
class MemoServiceTest {

    @Mock
    private MemoRepository memoRepository;

    @InjectMocks
    private MemoService memoService;

    @Test
    @DisplayName("메모 생성 시 shareKey(UUID)가 포함된 성공 응답을 반환한다")
    void createMemo_success() {
        // given
        MemoCreateRequest request = new MemoCreateRequest("여행 준비", "#FFFFFF", "1234");
        Memo memo = Memo.builder()
                .title(request.getTitle())
                .colorCode(request.getColorCode())
                .pin(request.getPin())
                .build();

        given(memoRepository.save(any(Memo.class))).willReturn(memo);

        // when
        String shareKey = memoService.createMemo(request);

        // then
        assertThat(shareKey).isNotNull();
        assertThat(shareKey.length()).isEqualTo(36); // UUID 길이 확인
        verify(memoRepository, times(1)).save(any(Memo.class));
    }
}