# Wallet & Transaction Management System

Java 17, Spring Boot 3, Spring Data JPA, MySQL/H2, Kafka. Layered architecture with REST controllers, services, repositories, DTOs, and global exception handling. Designed for fintech-style wallet credit/debit with transactional consistency and async Kafka events.

## Architecture
- controller: REST endpoints (thin)
- service: business logic, transactions, balance validation, event trigger
- repository: Spring Data JPA interfaces
- model: JPA entities (User, Wallet, Transaction)
- dto: request/response models
- exception: custom + global handler
- config/kafka: Kafka wiring (producer/consumer), topic config

## Data model
- User (id, name, email unique) — one-to-one Wallet
- Wallet (id, user, balance BigDecimal)
- Transaction (id, wallet, amount, type CREDIT/DEBIT, status SUCCESS/FAILED, timestamp)

## APIs
- POST `/api/users`
- GET `/api/users/{id}`
- GET `/api/wallet/{userId}`
- POST `/api/transactions/credit`
- POST `/api/transactions/debit`
- GET `/api/transactions/{userId}`

## Setup
### Prereqs
- JDK 17, Maven 3.9+
- Docker (optional for MySQL/Kafka)

### Local dev (H2 + Kafka localhost)
```bash
mvn spring-boot:run
```
Defaults: H2 in-memory, Kafka at `localhost:9092`. Configure Kafka or comment Kafka beans if running without Kafka for quick API smoke.

### Prod-like (MySQL + Kafka)
Update `src/main/resources/application-mysql.yml` with credentials, then:
```bash
mvn clean package
java -jar target/wallet-transaction-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
```

### Example Docker for MySQL & Kafka (quick start)
```bash
# MySQL
docker run -d --name wallet-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=walletdb -e MYSQL_USER=wallet_user -e MYSQL_PASSWORD=change-me -p 3306:3306 mysql:8
# Kafka (using bitnami)
docker run -d --name wallet-kafka -p 9092:9092 -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092 -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 bitnami/kafka:3
```

## Kafka
- Topic: `wallet-transactions` (configurable via `app.kafka.topic.transaction`)
- Producer: publishes after successful DB commit; failures are logged but do not roll back the transaction.
- Consumer: logs events (extend to persist/audit as needed).

## Validation & errors
- Bean validation on DTOs; global handler returns structured `ApiError` with status, message, and details.

## Testing (manual/Postman)
See `POSTMAN_COLLECTION_NOTE.md` for step-by-step requests: create user → get user → get balance → credit → debit → list transactions; observe Kafka events.

## Interview notes (talk track)
- Transactional integrity: `@Transactional` ensures wallet balance update and ledger insert are atomic; BigDecimal prevents precision issues.
- Decoupled side effects: Kafka publish is fire-and-forget; core DB state is the source of truth.
- Layering: controllers thin, services hold business rules, repositories hide persistence, DTOs shield entities, exceptions centralized.
- Environment separation: H2 for dev, MySQL profile for prod with `ddl-auto=validate` to protect schema.

