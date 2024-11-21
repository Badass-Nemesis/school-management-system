import { Request, Response, NextFunction } from 'express';

// middleware to log request details, I don't think I'm using this middleware anywhere. But still I'll keep this
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
};

export default loggerMiddleware;
