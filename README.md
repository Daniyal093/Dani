# EarnSite v4 — Offline UI Package (Withdrawal >= $1000)

This package provides a local, client-side UI that mimics an earning platform for testing or presentation. Everything is stored locally in the browser (no servers).

Key updates in v4:
- Referral link generation fixed and reliable for file:// and http(s).
- Withdraw modal supports EasyPaisa and JazzCash, with Name, Account Number and Amount fields.
- Minimum withdrawal amount: $1000. Requests below $1000 are blocked.
- All withdrawal requests are recorded with status "Pending". Balance is deducted when request submitted.
- Preset amounts available and custom amount field.

Seeded users for testing:
- user1 / pass123 (balance $1200)
- user2 / pass123 (balance $1500)

How to use:
1. Unzip and open `login.html` in your browser.
2. Login with seeded user or create a new account.
3. Generate referral link, use Share modal, simulate shares, or request withdrawal (if balance >= $1000).

Ethics reminder: This UI is for testing/presentation only. Do not use to deceive people or commit fraud.
