import mongoose from 'mongoose';

async function connectDB() {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
        throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB:', mongoose.connection.name);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
}

export default connectDB;