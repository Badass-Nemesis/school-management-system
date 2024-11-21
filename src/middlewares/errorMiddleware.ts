import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '../utils/errorUtils';

// Global Error Handling Middleware, found this in a yt video
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    handleError(err, res);
};

export default errorHandler;
