package com.example.wallet.dto;

import com.example.wallet.model.enums.TransactionStatus;
import com.example.wallet.model.enums.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private Long userId;
    private Long walletId;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private Instant timestamp;
}

