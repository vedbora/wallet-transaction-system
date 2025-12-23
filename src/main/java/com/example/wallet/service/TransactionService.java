package com.example.wallet.service;

import com.example.wallet.exception.InsufficientBalanceException;
import com.example.wallet.exception.UserNotFoundException;
import com.example.wallet.kafka.TransactionEventPublisher;
import com.example.wallet.model.Transaction;
import com.example.wallet.model.User;
import com.example.wallet.model.Wallet;
import com.example.wallet.model.enums.TransactionStatus;
import com.example.wallet.model.enums.TransactionType;
import com.example.wallet.repository.TransactionRepository;
import com.example.wallet.repository.UserRepository;
import com.example.wallet.repository.WalletRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionEventPublisher eventPublisher;

    @Transactional
    public Transaction credit(Long userId, BigDecimal amount) {
        Wallet wallet = getWalletForUpdate(userId);

        wallet.setBalance(wallet.getBalance().add(amount));
        Transaction tx = buildTransaction(wallet, amount, TransactionType.CREDIT, TransactionStatus.SUCCESS);

        walletRepository.save(wallet);
        Transaction saved = transactionRepository.save(tx);

        publishEventAsync(saved);
        return saved;
    }

    @Transactional
    public Transaction debit(Long userId, BigDecimal amount) {
        Wallet wallet = getWalletForUpdate(userId);

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(amount);
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        Transaction tx = buildTransaction(wallet, amount, TransactionType.DEBIT, TransactionStatus.SUCCESS);

        walletRepository.save(wallet);
        Transaction saved = transactionRepository.save(tx);

        publishEventAsync(saved);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsForUser(Long userId) {
        ensureUserExists(userId);
        return transactionRepository.findByWalletUserIdOrderByTimestampDesc(userId);
    }

    private Wallet getWalletForUpdate(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new com.example.wallet.exception.WalletNotFoundException(userId));
    }

    private void ensureUserExists(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    private Transaction buildTransaction(Wallet wallet, BigDecimal amount, TransactionType type, TransactionStatus status) {
        return Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .status(status)
                .build();
    }

    private void publishEventAsync(Transaction transaction) {
        // Fire-and-forget; Kafka delivery failures must not affect DB transaction.
        eventPublisher.publish(transaction);
    }
}

