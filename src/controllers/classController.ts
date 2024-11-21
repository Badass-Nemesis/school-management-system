import { Request, Response, NextFunction } from 'express';
import Class from '../models/classModel';
import { AppError, catchAsync } from '../utils/errorUtils';
import { isValidName } from '../utils/validationUtils';

// create a new class
export const createClass = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { name, teacherId, studentCount } = req.body;

    if (!name || !isValidName(name)) {
        return next(new AppError('Class name cannot be empty', 400));
    }

    // Convert class name to lowercase for case-insensitive comparison
    const lowerCaseName = name.toLowerCase();

    // Check if a class with the same name (case-insensitive) already exists
    const existingClass = await Class.findOne({ name: lowerCaseName });
    if (existingClass) {
        return next(new AppError('Class name already exists, including the deleted classes', 400));
    }

    const newClass = new Class({ name: lowerCaseName, teacherId, studentCount });
    await newClass.save();
    return res.status(201).json(newClass);
});

// get all classes with pagination
export const getClasses = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;
    const total = await Class.countDocuments();
    const classes = await Class.find().skip(skip).limit(limit);

    return res.status(200).json({ classes, total, page, totalPages: Math.ceil(total / limit) });
});

// get a class by ID
export const getClassById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    let classData = await Class.findOne({ _id: id, deleted: false });
    if (req.user && req.user.role === 'admin') {
        classData = await Class.findOne({ _id: id });
    }

    if (!classData) {
        return next(new AppError('Class not found', 404));
    }
    return res.status(200).json(classData);
});

// update a class by ID
export const updateClass = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { name, teacherId, studentCount } = req.body;

    if (name && !isValidName(name)) {
        return next(new AppError('Class name cannot be empty', 400));
    }

    const updatedClass = await Class.findByIdAndUpdate(id, { name, teacherId, studentCount }, { new: true });
    if (!updatedClass) {
        return next(new AppError('Class not found', 404));
    }
    return res.status(200).json(updatedClass);
});

// delete a class by ID
export const deleteClass = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
        return next(new AppError('Class not found', 404));
    }
    return res.status(200).json({ message: 'Class deleted' });
});
