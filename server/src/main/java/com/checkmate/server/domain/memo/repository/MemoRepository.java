package com.checkmate.server.domain.memo.repository;

import com.checkmate.server.domain.memo.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemoRepository extends JpaRepository<Memo, Long> {
    Optional<Memo> findByShareKey(String shareKey);
}