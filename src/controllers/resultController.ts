import { Request, Response, NextFunction } from 'express';
import Result from '../models/resultModel';
import Exam from '../models/examModel';
import Student from '../models/studentModel';
import Class from '../models/classModel';
import { AppError, catchAsync } from '../utils/errorUtils';
import { ResultInterface } from '../types/types';

// Record a new result
export const recordResult = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { studentId, examId, marksObtained, grade } = req.body as ResultInterface;

    // Check if all required fields are provided
    if (!studentId || !examId || marksObtained === undefined) {
        return next(new AppError('All fields are required: studentId, examId, marksObtained', 400));
    }

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Check if the exam and student exist
    const exam = await Exam.findById(examId);
    const student = await Student.findById(studentId);
    if (!exam || !student) {
        return next(new AppError('Exam or Student not found', 404));
    }

    // Verify that the teacher is associated with the class
    if (req.user.role === 'teacher') {
        const classData = await Class.findById(student.classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to record a result for this class', 403));
        }
    }

    // Check if a result for the same student and exam already exists
    const existingResult = await Result.findOne({ studentId, examId });
    if (existingResult) {
        return next(new AppError('A result for this student and exam already exists', 409));
    }

    const result = new Result({ studentId, examId, marksObtained, grade });
    await result.save();
    res.status(201).json(result);
});

// Get results by student
export const getResultsByStudent = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { studentId } = req.params;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    const student = await Student.findById(studentId);
    if (!student) {
        return next(new AppError('Student not found', 404));
    }

    // Verify that the teacher is associated with the student's class
    if (req.user.role === 'teacher') {
        const classData = await Class.findById(student.classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to view results for this student', 403));
        }
    }

    const results = await Result.find({ studentId }).populate('examId', 'name date');
    res.status(200).json(results);
});

// Get results by exam
export const getResultsByExam = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { examId } = req.params;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
        return next(new AppError('Exam not found', 404));
    }

    // Verify that the teacher is associated with the exam's class
    if (req.user.role === 'teacher') {
        const classData = await Class.findById(exam.classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to view results for this exam', 403));
        }
    }

    const results = await Result.find({ examId }).populate('studentId', 'name email');
    res.status(200).json(results);
});

// Update a result
export const updateResult = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { marksObtained, grade } = req.body;

    const result = await Result.findById(id);
    if (!result) {
        return next(new AppError('Result not found', 404));
    }

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Verify that the teacher is associated with the exam's class
    if (req.user.role === 'teacher') {
        const exam = await Exam.findById(result.examId);
        if (!exam) {
            return next(new AppError('Exam not found', 404));
        }

        const classData = await Class.findById(exam.classId);
        if (!classData || classData.teacherId.toString() !== req.user.id) {
            return next(new AppError('You are not authorized to update this result', 403));
        }
    }

    if (marksObtained !== undefined) result.marksObtained = marksObtained;
    if (grade) result.grade = grade;
    result.updatedAt = new Date();

    await result.save();
    res.json(result);
});

// Delete a result
export const deleteResult = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    const result = await Result.findByIdAndDelete(id);
    if (!result) {
        return next(new AppError('Result not found', 404));
    }

    res.json({ message: 'Result deleted successfully' });
});