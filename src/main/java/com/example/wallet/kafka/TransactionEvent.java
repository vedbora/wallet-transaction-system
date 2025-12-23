package com.example.wallet.kafka;

import com.example.wallet.model.enums.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEvent {
    private Long transactionId;
    private Long userId;
    private Long walletId;
    private BigDecimal amount;
    private TransactionType type;
    private Instant timestamp;
}

