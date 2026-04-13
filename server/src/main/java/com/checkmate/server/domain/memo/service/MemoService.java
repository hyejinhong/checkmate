package com.checkmate.server.domain.memo.service;

import com.checkmate.server.domain.memo.dto.MemoCreateRequest;
import com.checkmate.server.domain.memo.dto.MemoDetailResponse;
import com.checkmate.server.domain.memo.dto.MemoWebSocketMessage;
import com.checkmate.server.domain.memo.entity.Memo;
import com.checkmate.server.domain.memo.entity.MemoItem;
import com.checkmate.server.domain.memo.repository.MemoItemRepository;
import com.checkmate.server.domain.memo.repository.MemoRepository;
import com.checkmate.server.global.constant.ErrorCode;
import com.checkmate.server.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemoService {

    private final MemoRepository memoRepository;
    private final MemoItemRepository memoItemRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public String createMemo(MemoCreateRequest request) {
        // 비밀번호 암호화
        String hashedPin = null;
        if (request.getPin() != null && !request.getPin().isBlank()) {
            hashedPin = encryptSHA256(request.getPin());
        }

        // 1. 엔티티 생성
        Memo memo = Memo.builder()
                .title(request.getTitle())
                .colorCode(request.getColorCode())
                .pin(hashedPin)
                .build();

        // 2. DB 저장
        Memo savedMemo = memoRepository.save(memo);

        // 3. 프론트가 이동할 URL을 만들 때 쓸 shareKey 반환
        return savedMemo.getShareKey();
    }

    @Transactional(readOnly = true)
    public MemoDetailResponse getMemo(String shareKey) {
        Memo memo = memoRepository.findByShareKey(shareKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMO_NOT_FOUND));

        return MemoDetailResponse.from(memo);
    }

    @Transactional(readOnly = true)
    public boolean verifyPin(String shareKey, String inputPin) {
        Memo memo = memoRepository.findByShareKey(shareKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMO_NOT_FOUND));

        // 입력받은 PIN을 해시화하여 DB에 저장된 값과 비교
        String hashedInput = encryptSHA256(inputPin);
        return memo.getPin().equals(hashedInput);
    }

    /**
     * 문자열을 SHA-256으로 단방향 해시 암호화하는 유틸리티 메서드
     */
    private String encryptSHA256(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(text.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(md.digest());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 암호화 알고리즘을 사용할 수 없습니다.", e);
        }
    }

    /**
     * 바이트 배열을 16진수 문자열로 변환
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b : bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }

    @Transactional
    public MemoDetailResponse.MemoItemResponse addItem(String shareKey, String content) {
        Memo memo = memoRepository.findByShareKey(shareKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMO_NOT_FOUND));

        MemoItem item = MemoItem.builder()
                .content(content)
                .isCompleted(false)
                .memo(memo)
                .build();

        memo.addItem(item); // 연관관계 편의 메소드 활용
        memoItemRepository.save(item);

        MemoDetailResponse.MemoItemResponse response = MemoDetailResponse.MemoItemResponse.from(item);

        // 소켓 구독자들에게 발행 알림
        messagingTemplate.convertAndSend("/topic/memo/" + shareKey,
                MemoWebSocketMessage.of("ITEM_ADDED", response));

        return  response;
    }

    @Transactional
    public void toggleItemStatus(Long itemId) {
        MemoItem item = memoItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEM_NOT_FOUND));
        item.toggleCompleted(); // 엔티티에 비즈니스 로직 추가 권장
    }

    @Transactional
    public void updateItemContent(Long itemId, String content) {
        MemoItem item = memoItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ITEM_NOT_FOUND));
        item.updateContent(content);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        memoItemRepository.deleteById(itemId);
    }
}