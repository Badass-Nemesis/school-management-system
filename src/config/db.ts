import mongoose from 'mongoose';
import { AppError } from '../utils/errorUtils';

const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI: string = process.env.MONGO_URI || '';
    if (!MONGO_URI) {
      throw new AppError('MONGO_URI is not defined', 500);
    }
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    // Log the error and rethrow to be caught by the global error handler
    // console.error('Failed to connect to MongoDB', error); // do i need it now though?
    throw new AppError('Failed to connect to MongoDB', 500);
  }
};

export default connectDB;
