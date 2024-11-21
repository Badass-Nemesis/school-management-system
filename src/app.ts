import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import classRoutes from './routes/classRoutes';
import authRoutes from './routes/authRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import examRoutes from './routes/examRoutes';
import resultRoutes from './routes/resultRoutes';
import reportRoutes from './routes/reportRoutes';
import authMiddleware from './middlewares/authMiddleware';
import errorHandler from './middlewares/errorMiddleware';

// Import error handling utilities
// import { AppError, handleError } from './utils/errorUtils'; // no need after importing the errorHandler middleware

const app: Application = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev')); // log to console for development

// uncomment the lines below to enable file logging with morgan
// const logStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: logStream }));

// routes
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/teachers', authMiddleware, teacherRoutes);
app.use('/api/classes', authMiddleware, classRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/exams', authMiddleware, examRoutes);
app.use('/api/results', authMiddleware, resultRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// global error handling middleware
app.use(errorHandler); // using the error handling middleware

export default app;
