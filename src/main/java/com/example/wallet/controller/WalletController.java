package com.example.wallet.controller;

import com.example.wallet.dto.WalletBalanceResponse;
import com.example.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/{userId}")
    public WalletBalanceResponse getBalance(@PathVariable Long userId) {
        return new WalletBalanceResponse(userId, walletService.getBalance(userId));
    }
}

