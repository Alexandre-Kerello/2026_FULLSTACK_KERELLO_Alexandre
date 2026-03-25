import mongoose from "mongoose";
import "../accounts/accounts.model.js";
import "../categories/categories.model.js";
import "../currencies/currencies.model.js";

const transactionSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: [true, 'Account ID is required'],
        },
        label: {
            type: String,
            required: [true, 'Transaction label is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Transaction amount is required'],
        },
        type: {
            type: String,
            required: [true, 'Transaction type is required'],
            enum: ['credit', 'debit'],
        },
        currencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency',
            required: [true, 'Currency ID is required'],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        date: {
            type: Date,
            required: [true, 'Transaction date is required'],
        },
    },
    { timestamps: true }
);

const transaction = mongoose.model('Transaction', transactionSchema);

export default transaction;