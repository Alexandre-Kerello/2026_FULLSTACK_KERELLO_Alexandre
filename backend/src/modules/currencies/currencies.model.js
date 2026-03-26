import mongoose from "mongoose";

const currencySchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Currency code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Currency name is required'],
            trim: true,
        },
        symbol: {
            type: String,
            required: [true, 'Currency symbol is required'],
            trim: true,
        }
    },
    { timestamps: true }
);

const currency = mongoose.model('Currency', currencySchema);

export default currency;