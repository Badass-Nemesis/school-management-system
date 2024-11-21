import { Request, Response, NextFunction } from 'express';
import Exam from '../models/examModel';
import Result from '../models/resultModel';
import Class from '../models/classModel'; // Import the Class model to verify teacher-class association
import { AppError, catchAsync } from '../utils/errorUtils';
import { ExamInterface } from '../types/types';

// Add a new exam
export const addExam = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { name, classId, date } = req.body as ExamInterface;

    // Check if all required fields are provided
    if (!name || !classId || !date) {
        return next(new AppError('All fields are required: name, classId, date', 400));
    }

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Verify that the teacher is associated with the class
    if (req.user.role === 'teacher') {
        const classData = await Class.findById(classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to add an exam for this class', 403));
        }
    }

    // Check if an exam with the same name (converted to lowercase) already exists for the same class
    const existingExam = await Exam.findOne({ name: name.toLowerCase(), classId });
    if (existingExam) {
        return next(new AppError('An exam with this name already exists for this class', 409));
    }

    const exam = new Exam({ name: name.toLowerCase(), classId, date });
    await exam.save();
    res.status(201).json(exam);
});

// Get all exams for a class
export const getExams = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { classId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Verify that the teacher is associated with the class
    if (req.user.role === 'teacher') {
        const classData = await Class.findById(classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to view exams for this class', 403));
        }
    }

    const total = await Exam.countDocuments({ classId });
    const exams = await Exam.find({ classId }).skip(skip).limit(limit);

    res.json({ exams, total, page, totalPages: Math.ceil(total / limit) });
});

// Update exam details
export const updateExam = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { name, date } = req.body;

    const exam = await Exam.findById(id);
    if (!exam) {
        return next(new AppError('Exam not found', 404));
    }

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Verify that the teacher is associated with the class
    if (req.user.role === 'teacher') {
        const classData = await Class.findById(exam.classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to update this exam', 403));
        }
    }

    if (name) exam.name = name;
    if (date) exam.date = date;
    exam.updatedAt = new Date();

    await exam.save();
    res.json(exam);
});

// Delete an exam
export const deleteExam = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    // Check for results associated with the exam
    const results = await Result.find({ examId: id });
    if (results.length > 0) {
        return next(new AppError('Cannot delete exam with associated results. Please delete the results first.', 400));
    }

    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
        return next(new AppError('Exam not found', 404));
    }

    res.json({ message: 'Exam deleted successfully' });
});