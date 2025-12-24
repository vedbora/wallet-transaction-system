/**
 * Wallet Transaction System - Modern Frontend
 * 
 * User-friendly UI with toast notifications, transaction cards, and clean design
 * No raw JSON shown to users (optional debug toggle available)
 */

// Backend API URL - Auto-detect based on current host
const API_BASE_URL = window.location.hostname.includes('render.com') 
    ? 'https://wallet-transaction-system.onrender.com/api'
    : 'http://localhost:8081/api';
let transactionHistory = [];
let currentBalanceUserId = null;

// Initialize debug toggle
document.getElementById('debugToggle').addEventListener('change', (e) => {
    const debugOutputs = document.querySelectorAll('.debug-output');
    debugOutputs.forEach(output => {
        output.style.display = e.target.checked ? 'block' : 'none';
    });
});

// Clear history button
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    transactionHistory = [];
    renderTransactionHistory();
});

// Refresh balance button
document.getElementById('refreshBalanceBtn').addEventListener('click', () => {
    if (currentBalanceUserId) {
        checkBalance(currentBalanceUserId, false);
    }
});

/**
 * Toast Notification System
 */
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Format date/time
 */
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
}

/**
 * Handle API errors
 */
async function handleApiError(response) {
    if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            } else {
                errorMessage = JSON.stringify(errorData, null, 2);
            }
        } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

/**
 * Show debug output (if enabled)
 */
function showDebug(elementId, data) {
    const debugDiv = document.getElementById(elementId);
    if (debugDiv) {
        debugDiv.textContent = JSON.stringify(data, null, 2);
    }
}

/**
 * Add transaction to history
 */
function addToHistory(transaction) {
    transactionHistory.unshift(transaction);
    if (transactionHistory.length > 50) {
        transactionHistory = transactionHistory.slice(0, 50);
    }
    renderTransactionHistory();
}

/**
 * Render transaction history
 */
function renderTransactionHistory() {
    const container = document.getElementById('transactionHistory');
    
    if (transactionHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No transactions yet</p>
                <small>Transactions will appear here after credit/debit operations</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactionHistory.map(tx => {
        const isCredit = tx.type === 'CREDIT';
        const isSuccess = tx.status === 'SUCCESS';
        
        return `
            <div class="transaction-item ${isCredit ? 'credit' : 'debit'}">
                <div class="transaction-header">
                    <span class="transaction-type ${isCredit ? 'credit' : 'debit'}">
                        ${isCredit ? '💰 Credit' : '💸 Debit'}
                    </span>
                    <span class="transaction-status ${isSuccess ? 'success' : 'failed'}">
                        ${tx.status}
                    </span>
                </div>
                <div class="transaction-amount" style="color: ${isCredit ? 'var(--success)' : 'var(--danger)'}">
                    ${isCredit ? '+' : '-'}${formatCurrency(Math.abs(tx.amount))}
                </div>
                <div class="transaction-details">
                    <span class="transaction-id">TX#${tx.id}</span>
                    <span class="transaction-time">${formatDateTime(tx.timestamp)}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update balance display
 */
function updateBalanceDisplay(userId, balance) {
    const card = document.getElementById('balanceDisplayCard');
    const amountEl = document.getElementById('balanceAmount');
    const userEl = document.getElementById('balanceUserInfo');
    
    card.style.display = 'block';
    amountEl.textContent = formatCurrency(balance);
    userEl.textContent = `User ID: ${userId}`;
    currentBalanceUserId = userId;
}

/**
 * Create User
 */
document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        
        const data = await handleApiError(response);
        showDebug('createUserDebug', data);
        
        showToast(
            'User Created Successfully!',
            `${data.name} (ID: ${data.id}) - Wallet initialized with ₹0.00`,
            'success'
        );
        
        form.reset();
    } catch (error) {
        showDebug('createUserDebug', { error: error.message });
        showToast('Error Creating User', error.message, 'error');
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
});

/**
 * Credit Amount
 */
document.getElementById('creditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    
    const userId = parseInt(document.getElementById('creditUserId').value);
    const amount = parseFloat(document.getElementById('creditAmount').value);
    
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/credit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        });
        
        const data = await handleApiError(response);
        showDebug('creditDebug', data);
        
        // Add to history
        addToHistory(data);
        
        // Update balance if same user
        if (currentBalanceUserId === userId) {
            checkBalance(userId, false);
        }
        
        showToast(
            'Amount Credited!',
            `₹${amount.toFixed(2)} added to wallet. Transaction ID: ${data.id}`,
            'success'
        );
        
        form.reset();
    } catch (error) {
        showDebug('creditDebug', { error: error.message });
        showToast('Credit Failed', error.message, 'error');
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
});

/**
 * Debit Amount
 */
document.getElementById('debitForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    
    const userId = parseInt(document.getElementById('debitUserId').value);
    const amount = parseFloat(document.getElementById('debitAmount').value);
    
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/debit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        });
        
        const data = await handleApiError(response);
        showDebug('debitDebug', data);
        
        // Add to history
        addToHistory(data);
        
        // Update balance if same user
        if (currentBalanceUserId === userId) {
            checkBalance(userId, false);
        }
        
        showToast(
            'Amount Debited!',
            `₹${amount.toFixed(2)} deducted from wallet. Transaction ID: ${data.id}`,
            'success'
        );
        
        form.reset();
    } catch (error) {
        showDebug('debitDebug', { error: error.message });
        showToast('Debit Failed', error.message, 'error');
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
});

/**
 * Check Balance
 */
function checkBalance(userId, showToast = true) {
    const form = document.getElementById('balanceForm');
    const button = form.querySelector('button[type="submit"]');
    
    button.classList.add('loading');
    button.disabled = true;
    
    fetch(`${API_BASE_URL}/wallet/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(handleApiError)
    .then(data => {
        showDebug('balanceDebug', data);
        updateBalanceDisplay(data.userId, data.balance);
        
        if (showToast) {
            showToast(
                'Balance Retrieved',
                `Current balance: ${formatCurrency(data.balance)}`,
                'info'
            );
        }
        
        form.reset();
    })
    .catch(error => {
        showDebug('balanceDebug', { error: error.message });
        if (showToast) {
            showToast('Error Fetching Balance', error.message, 'error');
        }
    })
    .finally(() => {
        button.classList.remove('loading');
        button.disabled = false;
    });
}

document.getElementById('balanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = parseInt(document.getElementById('balanceUserId').value);
    checkBalance(userId, true);
});
