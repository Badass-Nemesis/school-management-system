// found this type of code once, while checking stackoverflow, so used it here 

import { Request, Response, NextFunction } from 'express';

// custom error class
export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// error handling middleware
export const handleError = (err: AppError, res: Response): void => { // Changed res type from any to Response
    res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error',
    });
};

// catch async errors
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Promise<any> with Promise<void> is working, haha
        return fn(req, res, next).catch(next);
    };
};

