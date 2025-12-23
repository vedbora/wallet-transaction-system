package com.example.wallet.service;

import com.example.wallet.exception.WalletNotFoundException;
import com.example.wallet.model.Wallet;
import com.example.wallet.repository.WalletRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;

    @Transactional(readOnly = true)
    public Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(userId));
    }

    @Transactional(readOnly = true)
    public BigDecimal getBalance(Long userId) {
        return getWalletByUserId(userId).getBalance();
    }
}

