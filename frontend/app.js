/**
 * Wallet Transaction System - Frontend
 * FINAL Production Version (Render)
 */

/* =============================
   BACKEND URL (FIXED)
============================= */
const API_BASE_URL = "https://wallet-transaction-system.onrender.com/api";

let transactionHistory = [];
let currentBalanceUserId = null;

/* =============================
   INIT AFTER DOM LOAD
============================= */
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
        transactionHistory = [];
        renderTransactionHistory();
    });

    document.getElementById("refreshBalanceBtn")?.addEventListener("click", () => {
        if (currentBalanceUserId) checkBalance(currentBalanceUserId, false);
    });

});

/* =============================
   FETCH WRAPPER (CORS SAFE)
============================= */
async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }

    return res.json();
}

/* =============================
   TOAST
============================= */
function showToast(title, msg, type = "info") {
    const c = document.getElementById("toastContainer");
    if (!c) return;

    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<strong>${title}</strong><div>${msg}</div>`;

    c.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

/* =============================
   HELPERS
============================= */
const formatCurrency = a =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(a);

const formatDate = ts => new Date(ts).toLocaleString("en-IN");

/* =============================
   TRANSACTIONS
============================= */
function addToHistory(tx) {
    transactionHistory.unshift(tx);
    if (transactionHistory.length > 30) transactionHistory.pop();
    renderTransactionHistory();
}

function renderTransactionHistory() {
    const c = document.getElementById("transactionHistory");
    if (!c) return;

    if (!transactionHistory.length) {
        c.innerHTML = "<p>No transactions yet</p>";
        return;
    }

    c.innerHTML = transactionHistory.map(tx => `
        <div class="tx ${tx.type.toLowerCase()}">
            <strong>${tx.type}</strong>
            <div>${formatCurrency(tx.amount)}</div>
            <small>${tx.status} | ${formatDate(tx.timestamp)}</small>
        </div>
    `).join("");
}

/* =============================
   BALANCE
============================= */
function updateBalance(userId, balance) {
    document.getElementById("balanceAmount").textContent = formatCurrency(balance);
    document.getElementById("balanceUserInfo").textContent = `User ID: ${userId}`;
    document.getElementById("balanceDisplayCard").style.display = "block";
    currentBalanceUserId = userId;
}

function checkBalance(userId, toast = true) {
    apiFetch(`${API_BASE_URL}/wallet/${userId}`)
        .then(d => {
            updateBalance(d.userId, d.balance);
            if (toast) showToast("Balance", formatCurrency(d.balance));
        })
        .catch(e => showToast("Error", e.message, "error"));
}

/* =============================
   CREATE USER
============================= */
document.getElementById("createUserForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const data = await apiFetch(`${API_BASE_URL}/users`, {
            method: "POST",
            body: JSON.stringify({
                name: userName.value.trim(),
                email: userEmail.value.trim()
            })
        });

        showToast("User Created", `${data.name} (ID: ${data.id})`, "success");
        e.target.reset();

    } catch (err) {
        showToast("Error", err.message, "error");
    }
});

/* =============================
   CREDIT
============================= */
document.getElementById("creditForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const tx = await apiFetch(`${API_BASE_URL}/transactions/credit`, {
            method: "POST",
            body: JSON.stringify({
                userId: +creditUserId.value,
                amount: +creditAmount.value
            })
        });

        addToHistory(tx);
        showToast("Credited", formatCurrency(tx.amount), "success");
        if (currentBalanceUserId === tx.userId) checkBalance(tx.userId, false);
        e.target.reset();

    } catch (err) {
        showToast("Credit Failed", err.message, "error");
    }
});

/* =============================
   DEBIT
============================= */
document.getElementById("debitForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const tx = await apiFetch(`${API_BASE_URL}/transactions/debit`, {
            method: "POST",
            body: JSON.stringify({
                userId: +debitUserId.value,
                amount: +debitAmount.value
            })
        });

        addToHistory(tx);
        showToast("Debited", formatCurrency(tx.amount), "success");
        if (currentBalanceUserId === tx.userId) checkBalance(tx.userId, false);
        e.target.reset();

    } catch (err) {
        showToast("Debit Failed", err.message, "error");
    }
});

/* =============================
   BALANCE FORM
============================= */
document.getElementById("balanceForm")?.addEventListener("submit", e => {
    e.preventDefault();
    checkBalance(+balanceUserId.value, true);
});
