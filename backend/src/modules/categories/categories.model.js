import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        color: {
            type: String,
            required: [true, 'Category color is required'],
            trim: true,
        }
    },
    { timestamps: true }
);

const category = mongoose.model('Category', categorySchema);

export default category;