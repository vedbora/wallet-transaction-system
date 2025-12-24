# Wallet Transaction System - Frontend Demo

A simple, clean frontend to demonstrate the Spring Boot backend Wallet Transaction System.

## 🚀 How to Run

### Prerequisites
- Spring Boot backend running on `http://localhost:8081`
- A modern web browser (Chrome, Firefox, Edge, etc.)

### Steps

1. **Start the Backend**
   ```bash
   # In the project root directory
   mvn spring-boot:run
   ```
   Ensure the backend is running on port 8081 (or update `API_BASE_URL` in `app.js`).

2. **Open the Frontend**
   - Simply open `index.html` in your web browser
   - You can double-click the file, or use:
     ```bash
     # Windows
     start index.html
     
     # Mac
     open index.html
     
     # Linux
     xdg-open index.html
     ```

3. **Test the APIs**
   - Use the forms on the page to interact with the backend
   - All responses (success/error) will be displayed in JSON format below each form

## 📋 Usage Flow

1. **Create a User**: Enter name and email → User and wallet are created automatically
2. **Credit Amount**: Enter user ID and amount → Money is added to wallet
3. **Debit Amount**: Enter user ID and amount → Money is deducted (fails if insufficient balance)
4. **Check Balance**: Enter user ID → Current wallet balance is displayed

## 🔧 Configuration

If your backend runs on a different port or host, edit `app.js` and change:
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

## 📝 Notes

- This is a **demonstration frontend only** - no authentication, no production features
- All API calls use the Fetch API (native JavaScript)
- Error handling displays backend error messages clearly
- Responses are shown as formatted JSON for easy reading

## 🎯 For Interview Explanation

**How Frontend Connects to Backend:**

1. **HTTP Communication**: The frontend uses the Fetch API (native browser API) to make HTTP requests to the Spring Boot backend REST endpoints.

2. **RESTful API**: The backend exposes REST endpoints:
   - `POST /api/users` - Create user
   - `POST /api/transactions/credit` - Credit wallet
   - `POST /api/transactions/debit` - Debit wallet
   - `GET /api/wallet/{userId}` - Get balance

3. **Request Flow**:
   - User fills form → JavaScript collects data → Fetch API sends JSON request → Backend processes → JSON response returned → Frontend displays result

4. **CORS**: If you encounter CORS errors, the backend needs to allow requests from `file://` origin. For production, you'd serve the frontend from a web server or configure CORS properly in Spring Boot.

5. **Error Handling**: The frontend catches HTTP errors (4xx, 5xx) and displays the backend's error message (from `ApiError` DTO) to the user.

6. **No Framework**: This uses plain HTML/CSS/JavaScript to keep it simple and demonstrate core concepts without framework overhead.

