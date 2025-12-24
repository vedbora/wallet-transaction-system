/**
 * Wallet Transaction System - Modern Frontend
 * Production Ready (Render Hosted Backend)
 * Clean UI | Toast Notifications | No Raw JSON
 */

const API_BASE_URL = "https://wallet-transaction-system.onrender.com";

let transactionHistory = [];
let currentBalanceUserId = null;

/* =============================
   SAFE INIT AFTER DOM LOAD
============================= */
document.addEventListener("DOMContentLoaded", () => {

    const debugToggle = document.getElementById("debugToggle");
    if (debugToggle) {
        debugToggle.addEventListener("change", (e) => {
            document.querySelectorAll(".debug-output").forEach(el => {
                el.style.display = e.target.checked ? "block" : "none";
            });
        });
    }

    document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
        transactionHistory = [];
        renderTransactionHistory();
    });

    document.getElementById("refreshBalanceBtn")?.addEventListener("click", () => {
        if (currentBalanceUserId) {
            checkBalance(currentBalanceUserId, false);
        }
    });
});

/* =============================
   TOAST NOTIFICATION
============================= */
function showToast(title, message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = { success: "✅", error: "❌", info: "ℹ️" };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <strong>${title}</strong>
            <div>${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* =============================
   HELPERS
============================= */
const formatCurrency = amt =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt);

const formatDateTime = ts =>
    new Date(ts).toLocaleString("en-IN");

async function handleApiError(res) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}

function showDebug(id, data) {
    const el = document.getElementById(id);
    if (el) el.textContent = JSON.stringify(data, null, 2);
}

/* =============================
   TRANSACTION HISTORY
============================= */
function addToHistory(tx) {
    transactionHistory.unshift(tx);
    if (transactionHistory.length > 30) transactionHistory.pop();
    renderTransactionHistory();
}

function renderTransactionHistory() {
    const container = document.getElementById("transactionHistory");
    if (!container) return;

    if (!transactionHistory.length) {
        container.innerHTML = `<p class="empty">No transactions yet</p>`;
        return;
    }

    container.innerHTML = transactionHistory.map(tx => `
        <div class="transaction ${tx.type.toLowerCase()}">
            <div>
                <strong>${tx.type}</strong>
                <span>${tx.status}</span>
            </div>
            <div>${formatCurrency(tx.amount)}</div>
            <small>${formatDateTime(tx.timestamp)}</small>
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

/* =============================
   CREATE USER
============================= */
document.getElementById("createUserForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const name = userName.value.trim();
    const email = userEmail.value.trim();

    try {
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });

        const data = await handleApiError(res);
        showToast("User Created", `${data.name} (ID: ${data.id})`, "success");
        showDebug("createUserDebug", data);
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

    const userId = +creditUserId.value;
    const amount = +creditAmount.value;

    try {
        const res = await fetch(`${API_BASE_URL}/wallet/${userId}/credit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });

        const tx = await handleApiError(res);
        addToHistory(tx);
        showToast("Credited", formatCurrency(amount), "success");
        if (currentBalanceUserId === userId) checkBalance(userId, false);

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

    const userId = +debitUserId.value;
    const amount = +debitAmount.value;

    try {
        const res = await fetch(`${API_BASE_URL}/wallet/${userId}/debit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });

        const tx = await handleApiError(res);
        addToHistory(tx);
        showToast("Debited", formatCurrency(amount), "success");
        if (currentBalanceUserId === userId) checkBalance(userId, false);

        e.target.reset();
    } catch (err) {
        showToast("Debit Failed", err.message, "error");
    }
});

/* =============================
   CHECK BALANCE
============================= */
function checkBalance(userId, toast = true) {
    fetch(`${API_BASE_URL}/wallet/${userId}`)
        .then(handleApiError)
        .then(data => {
            updateBalance(data.userId, data.balance);
            if (toast) showToast("Balance", formatCurrency(data.balance), "info");
            showDebug("balanceDebug", data);
        })
        .catch(err => showToast("Error", err.message, "error"));
}

document.getElementById("balanceForm")?.addEventListener("submit", e => {
    e.preventDefault();
    checkBalance(+balanceUserId.value, true);
});
