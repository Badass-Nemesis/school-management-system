import { Request, Response, NextFunction } from 'express';
import Attendance from '../models/attendanceModel';
import Student from '../models/studentModel';
import { AppError, catchAsync } from '../utils/errorUtils';
import { isTeacherOfClass } from '../utils/validationUtils';

// Mark attendance for a student
export const markAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { studentId, classId, date, status } = req.body;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    if (req.user.role === 'teacher' && !(await isTeacherOfClass(req.user.id, classId))) {
        return next(new AppError('You are not authorized to mark attendance for this class.', 403));
    }

    const validStatuses = ['Present', 'Absent'];
    if (!validStatuses.includes(status)) {
        return next(new AppError('Invalid attendance status', 400));
    }

    const existingAttendance = await Attendance.findOne({ studentId, date });
    if (existingAttendance) {
        return next(new AppError('Attendance for this student on this date already exists.', 400));
    }

    const attendance = new Attendance({ studentId, classId, date, status });
    await attendance.save();
    res.status(201).json(attendance);
});

// Get attendance records by class
export const getAttendanceByClass = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { classId } = req.params;
    const { date } = req.query;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    if (req.user.role === 'teacher' && !(await isTeacherOfClass(req.user.id, classId))) {
        return next(new AppError('You are not authorized to view attendance for this class.', 403));
    }

    const query: any = { classId };
    if (date) {
        query.date = new Date(date as string);
    }

    const attendances = await Attendance.find(query);
    res.status(200).json(attendances);
});

// Get attendance records by student
export const getAttendanceByStudent = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    const student = await Student.findById(studentId);
    // Ensure student is defined
    if (!student) {
        return next(new AppError('No Student Found', 404));
    }

    if (req.user.role === 'teacher' && !(await isTeacherOfClass(req.user.id, student.classId.toString()))) {
        return next(new AppError('You are not authorized to view attendance for this student.', 403));
    }

    const query: any = { studentId };
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
    }

    const attendances = await Attendance.find(query);
    res.status(200).json(attendances);
});

// Delete attendance by ID
export const deleteAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    // Find and delete the attendance record by ID
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
        return next(new AppError('Attendance record not found', 404));
    }

    res.json({ message: 'Attendance record deleted successfully' });
});