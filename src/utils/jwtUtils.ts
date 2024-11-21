import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorUtils';

// generate a JWT
export const generateToken = (userId: string, role: 'student' | 'teacher' | 'admin'): string => {
    // return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string);
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

// verify a JWT
export const verifyToken = (token: string): { id: string; role: 'student' | 'teacher' | 'admin' } => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: 'student' | 'teacher' | 'admin' };
    } catch (err) {
        throw new AppError('Token verification failed', 401);
    }
};
