Postman guidance (to be converted to a collection):

Variables:
- {{baseUrl}} = http://localhost:8080

1) Create User
   - POST {{baseUrl}}/api/users
   - Body (JSON): { "name": "Alice", "email": "alice@example.com" }
   - Expect: 201 with id, name, email

2) Get User
   - GET {{baseUrl}}/api/users/{{userId}}
   - Expect: 200

3) Get Wallet Balance
   - GET {{baseUrl}}/api/wallet/{{userId}}
   - Expect: 200 with balance

4) Credit Wallet
   - POST {{baseUrl}}/api/transactions/credit
   - Body: { "userId": {{userId}}, "amount": 100.50 }
   - Expect: 201 with transaction payload; balance increases

5) Debit Wallet
   - POST {{baseUrl}}/api/transactions/debit
   - Body: { "userId": {{userId}}, "amount": 25.00 }
   - Expect: 201 if funds; 400 InsufficientBalance if not

6) List Transactions
   - GET {{baseUrl}}/api/transactions/{{userId}}
   - Expect: 200 list ordered desc by timestamp

Kafka verification (manual):
- Start local Kafka with topic wallet-transactions.
- Produce/consume to check events when credit/debit calls succeed.

