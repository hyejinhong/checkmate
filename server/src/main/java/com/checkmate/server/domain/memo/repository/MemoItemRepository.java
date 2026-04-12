package com.checkmate.server.domain.memo.repository;

import com.checkmate.server.domain.memo.entity.Memo;
import com.checkmate.server.domain.memo.entity.MemoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MemoItemRepository extends JpaRepository<MemoItem, Long> {
    List<MemoItem> findAllByMemoOrderByPriorityAsc(Memo memo);
}