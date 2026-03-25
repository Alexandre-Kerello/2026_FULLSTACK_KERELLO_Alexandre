import mongoose from "mongoose";
import "../users/users.model.js";
import "../currencies/currencies.model.js";

const accountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        name: {
            type: String,
            required: [true, 'Account name is required'],
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'Account type is required'],
            enum: ['checking', 'savings', 'credit', 'investment'],
        },
        balance: {
            type: Number,
            required: [true, 'Account balance is required'],
            default: 0,
        },
        currency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency',
            required: [true, 'Currency is required'],
        }
    },
    { timestamps: true }
);

const account = mongoose.model('Account', accountSchema);

export default account;