package com.example.wallet.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WalletBalanceResponse {

    private Long userId;
    private BigDecimal balance;
}

