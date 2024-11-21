import { Request, Response, NextFunction } from 'express';
import Teacher from '../models/teacherModel';
import { AppError, catchAsync } from '../utils/errorUtils';
import { isValidName, isValidEmail, isValidCloudinaryUrl } from '../utils/validationUtils';

// get all teachers with pagination
export const getTeachers = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;
    const total = await Teacher.countDocuments();
    const teachers = await Teacher.find().skip(skip).limit(limit);

    res.json({ teachers, total, page, totalPages: Math.ceil(total / limit) });
});

// get a teacher by ID
export const getTeacherById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    if (req.user.role === 'teacher' && req.user.id !== id) {
        return next(new AppError('You are not authorized to view this teacher profile', 401));
    }

    let teacher = await Teacher.findOne({ _id: id, deleted: false });
    if (req.user.role === 'admin') {
        teacher = await Teacher.findOne({ _id: id });
    }

    if (!teacher) {
        return next(new AppError('Teacher not found', 404));
    }

    res.json(teacher);
});

// update a teacher by ID
export const updateTeacher = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { name, email, subject, profileImageUrl } = req.body;

    // Ensure req.user is defined
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    if (req.user.role === 'teacher' && req.user.id !== id) {
        return next(new AppError('You are not authorized to update this teacher profile', 401));
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
        return next(new AppError('Teacher not found', 404));
    }

    if (name && !isValidName(name)) {
        return next(new AppError('Name cannot be empty', 400));
    }
    if (email && !isValidEmail(email)) {
        return next(new AppError('Invalid email format', 400));
    }
    if (profileImageUrl && !isValidCloudinaryUrl(profileImageUrl)) {
        return next(new AppError('Invalid Cloudinary URL', 400));
    }
    if (subject && req.user && req.user.role !== 'admin') {
        return next(new AppError('Access denied. Only admins can update the subject.', 403));
    }

    // create an object with only provided fields (partial object)
    const updateData: Partial<typeof teacher> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (subject) updateData.subject = subject;
    if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });

    res.json(updatedTeacher);
});

// soft-delete a teacher by ID
export const deleteTeacher = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndUpdate(
        id,
        { deleted: true, deletedAt: new Date() },
        { new: true } // instructing MongoDB to return the document after the update
    );

    // this is basically an error handling code, so it is not redundant
    if (!deletedTeacher) {
        return next(new AppError('Teacher not found', 404));
    }

    res.json({ message: 'Teacher deleted successfully' });
});
