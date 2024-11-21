import { Request, Response, NextFunction } from 'express';
import Student from '../models/studentModel';
import Teacher from '../models/teacherModel';
import Admin from '../models/adminModel'; // Import Admin model
import Class from '../models/classModel'; // Import Class model
import { generateToken } from '../utils/jwtUtils';
import { hashPassword, verifyPassword } from '../utils/hashUtils';
import { AppError, catchAsync } from '../utils/errorUtils';
import { isValidEmail, isValidPassword, isValidName } from '../utils/validationUtils';
import { AuthInterface } from '../types/types';

// registering a new user (student, teacher, or admin)
export const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email, password, name, role, subject, classId } = req.body as AuthInterface;

    if (!isValidEmail(email)) {
        return next(new AppError('Invalid email format', 400));
    }
    if (!isValidPassword(password)) {
        return next(new AppError('Password must be at least 8 characters long and contain letters and numbers', 400));
    }
    if (!name || !isValidName(name)) {
        return next(new AppError('Name cannot be empty', 400));
    }

    // Check all databases for existing email
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingStudent || existingTeacher || existingAdmin) {
        return next(new AppError('An account with this email already exists, including previously deleted accounts. Please contact support for assistance.', 400));
    }

    const hashedPassword = await hashPassword(password);

    if (role === 'student') {
        if (!classId) {
            return next(new AppError('Class ID is required for students', 400));
        }

        // Check if the class with the given ID exists
        const classData = await Class.findById(classId);
        if (!classData) {
            return next(new AppError('Class not found with the provided ID', 404));
        }

        const session = await Student.startSession();
        session.startTransaction();

        try {
            const newStudent = new Student({ email, password: hashedPassword, name, classId, role });
            await newStudent.save({ session });

            // Increment student count in the class
            await Class.findByIdAndUpdate(classId, { $inc: { studentCount: 1 } }, { new: true, session });

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json(newStudent);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError('Failed to register student', 500));
        }
    } else if (role === 'teacher') {
        if (!subject) {
            return next(new AppError('Subject is required for teachers', 400));
        }
        const newTeacher = new Teacher({ email, password: hashedPassword, name, subject, role });
        await newTeacher.save();
        return res.status(201).json(newTeacher);
    } else {
        const newAdmin = new Admin({ email, password: hashedPassword, name, role });
        await newAdmin.save();
        return res.status(201).json(newAdmin);
    }
});

// logging in a user (student, teacher, or admin)
export const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email, password, role } = req.body as AuthInterface;

    if (!isValidEmail(email)) {
        return next(new AppError('Invalid email format', 400));
    }
    if (!isValidPassword(password)) {
        return next(new AppError('Invalid credentials', 400));
    }

    let user;
    switch (role) {
        case 'student':
            user = await Student.findOne({ email, deleted: false });
            break;
        case 'teacher':
            user = await Teacher.findOne({ email, deleted: false });
            break;
        case 'admin':
            user = await Admin.findOne({ email });
            break;
        default:
            return next(new AppError('Invalid role specified', 400));
    }

    // console.log(role); // debugging
    if (!user) {
        return next(new AppError('Invalid credentials', 400));
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
        return next(new AppError('Invalid credentials', 400));
    }

    // user._id was giving so much errors, this is a hotfix
    const token = generateToken((user._id as unknown) as string, role);

    return res.status(200).json({ token });
});
