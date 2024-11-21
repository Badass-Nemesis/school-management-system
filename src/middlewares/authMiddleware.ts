import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { AppError } from '../utils/errorUtils';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return next(new AppError('No token, authorization denied', 401));
    }

    try {
        const decoded = verifyToken(token);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        return next(new AppError('Token is not valid', 401));
    }
};

// checking if the user is a teacher or not
export const requireTeacherRole = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        return next(new AppError('Access denied. Requires teacher role.', 403));
    }
};

// checking if the user is an admin or not
export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return next(new AppError('Access denied. Requires admin role.', 403));
    }
};

// checking if the user is an admin/teacher or not
export const requireTeacherOrAdminRole = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'admin' || req.user?.role === 'teacher')) {
        next();
    } else {
        return next(new AppError('Access denied. Requires admin or teacher role.', 403));
    }
};

export default authMiddleware; // by-default I'm sending authMiddleware, not putting export before every const
