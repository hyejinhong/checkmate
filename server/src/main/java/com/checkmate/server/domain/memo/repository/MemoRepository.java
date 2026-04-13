package com.checkmate.server.domain.memo.repository;

import com.checkmate.server.domain.memo.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface MemoRepository extends JpaRepository<Memo, Long> {

    @Query("select m from Memo m left join fetch m.items where m.shareKey = :shareKey")
    Optional<Memo> findByShareKey(@Param("shareKey") String shareKey);
}