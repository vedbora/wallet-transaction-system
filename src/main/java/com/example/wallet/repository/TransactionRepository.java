package com.example.wallet.repository;

import com.example.wallet.model.Transaction;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByWalletUserIdOrderByTimestampDesc(Long userId);
}

