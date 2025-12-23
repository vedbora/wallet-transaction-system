package com.example.wallet.kafka;

import com.example.wallet.model.Transaction;

public interface TransactionEventPublisher {

    void publish(Transaction transaction);
}

