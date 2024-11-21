import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start the server', error);
    process.exit(1);
});
