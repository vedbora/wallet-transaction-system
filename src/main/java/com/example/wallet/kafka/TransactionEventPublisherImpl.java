package com.example.wallet.kafka;

import com.example.wallet.model.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventPublisherImpl implements TransactionEventPublisher {

    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;

    @Value("${app.kafka.topic.transaction}")
    private String transactionTopic;

    @Override
    public void publish(Transaction transaction) {
        TransactionEvent event = new TransactionEvent(
                transaction.getId(),
                transaction.getWallet().getUser().getId(),
                transaction.getWallet().getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getTimestamp()
        );
        kafkaTemplate.send(transactionTopic, String.valueOf(event.getTransactionId()), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish transaction event {}", event.getTransactionId(), ex);
                    } else {
                        log.info("Published transaction event {} to topic {}", event.getTransactionId(), transactionTopic);
                    }
                });
    }
}

