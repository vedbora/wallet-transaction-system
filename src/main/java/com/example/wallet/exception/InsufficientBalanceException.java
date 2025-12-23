package com.example.wallet.exception;

import java.math.BigDecimal;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(BigDecimal attemptedAmount) {
        super("Insufficient balance for debit amount: " + attemptedAmount);
    }
}

