// mongo-init.js
db = db.getSiblingDB('bankmanager');

// ── Users ──────────────────────────────────────────────────────────────
db.createUser({
    user: 'appuser',
    pwd: 'apppassword',
    roles: [
        { role: 'readWrite', db: 'bankmanager' }
    ]
});

// ── Collections ──────────────────────────────────────────────────────────────

// Currencies
db.createCollection('currencies');
db.currencies.createIndex({ code: 1 }, { unique: true });

// Categories
db.createCollection('categories');
db.categories.createIndex({ name: 1 });

// Users
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

// Accounts
db.createCollection('accounts');
db.accounts.createIndex({ userId: 1 });
db.accounts.createIndex({ currencyId: 1 });

// Transactions
db.createCollection('transactions');
db.transactions.createIndex({ accountId: 1 });
db.transactions.createIndex({ categoryId: 1 });
db.transactions.createIndex({ currencyId: 1 });
db.transactions.createIndex({ date: -1 });
db.transactions.createIndex({ createdAt: -1 });

// ── Seed data ──────────────────────────────────
db.currencies.insertMany([
    { _id: ObjectId(), code: 'EUR', name: 'Euro', symbol: '€' },
    { _id: ObjectId(), code: 'USD', name: 'US Dollar', symbol: '$' },
    { _id: ObjectId(), code: 'GBP', name: 'British Pound', symbol: '£' }
]);

db.categories.insertMany([
    { _id: ObjectId(), name: 'Alimentation', color: '#FF5733' },
    { _id: ObjectId(), name: 'Loisirs', color: '#33FF57' },
    { _id: ObjectId(), name: 'Loyer', color: '#3357FF' },
    { _id: ObjectId(), name: 'Transport', color: '#E67E22' },
    { _id: ObjectId(), name: 'Santé', color: '#8E44AD' },
    { _id: ObjectId(), name: 'Revenus', color: '#27AE60' },
    { _id: ObjectId(), name: 'Épargne', color: '#2980B9' },
    { _id: ObjectId(), name: 'Assurance', color: '#C0392B' },
    { _id: ObjectId(), name: 'Shopping', color: '#D35400' },
    { _id: ObjectId(), name: 'Virement', color: '#2ECC71' },
    { _id: ObjectId(), name: 'Autre', color: '#7F8C8D' }
]);

print('✅ BankManager DB initialisée avec succès');
