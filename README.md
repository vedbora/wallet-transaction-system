 # Wallet Transaction System (Spring Boot + Kafka)

A backend Wallet Transaction System built using Spring Boot, Apache Kafka, Spring Data JPA, and H2 Database.
This project simulates real-world wallet operations such as user creation, credit/debit transactions, and wallet balance tracking with event-driven processing.

# Features

👤 Create Users

💰 Credit money to wallet

💸 Debit money from wallet

📊 View wallet balance

🔄 Transaction history with status

🧵 Event-driven architecture using Kafka

🧪 Embedded H2 database for easy testing

📦 RESTful APIs tested using Postman

# ech Stack

Java 17

Spring Boot

Spring Data JPA

Apache Kafka

H2 Database

Maven

Docker

Postman

# Kafka & Zookeeper Setup (Docker)

Command : docker run -d --name zookeeper -p 2181:2181 confluentinc/cp-zookeeper:7.6.0

# Start Kafka
Command : docker run -d --name kafka -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka:7.6.0

# Build the project
Command : mvn clean install

#  run the application
command: mvn spring-boot:run
