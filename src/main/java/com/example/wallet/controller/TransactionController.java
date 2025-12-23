package com.example.wallet.controller;

import com.example.wallet.dto.TransactionRequest;
import com.example.wallet.dto.TransactionResponse;
import com.example.wallet.model.Transaction;
import com.example.wallet.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/credit")
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse credit(@Valid @RequestBody TransactionRequest request) {
        Transaction tx = transactionService.credit(request.getUserId(), request.getAmount());
        return toResponse(tx);
    }

    @PostMapping("/debit")
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse debit(@Valid @RequestBody TransactionRequest request) {
        Transaction tx = transactionService.debit(request.getUserId(), request.getAmount());
        return toResponse(tx);
    }

    @GetMapping("/{userId}")
    public List<TransactionResponse> list(@PathVariable Long userId) {
        return transactionService.getTransactionsForUser(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse toResponse(Transaction tx) {
        return new TransactionResponse(
                tx.getId(),
                tx.getWallet().getUser().getId(),
                tx.getWallet().getId(),
                tx.getAmount(),
                tx.getType(),
                tx.getStatus(),
                tx.getTimestamp()
        );
    }
}

