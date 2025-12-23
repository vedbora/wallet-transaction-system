package com.example.wallet.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TransactionEventConsumer {

    @KafkaListener(topics = "${app.kafka.topic.transaction}", groupId = "${app.kafka.consumer-group:wallet-consumers}")
    public void consume(TransactionEvent event) {
        log.info("Consumed transaction event: txId={}, userId={}, amount={}, type={}, timestamp={}",
                event.getTransactionId(), event.getUserId(), event.getAmount(), event.getType(), event.getTimestamp());
    }
}

