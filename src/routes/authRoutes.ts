import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { catchAsync } from '../utils/errorUtils';

const router = express.Router();

// route to register a new user
router.post('/register', catchAsync(registerUser));

// route to login a user
router.post('/login', catchAsync(loginUser));

export default router;
