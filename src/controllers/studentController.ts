import { Request, Response, NextFunction } from 'express';
import Student from '../models/studentModel';
import Class from '../models/classModel';
import { AppError, catchAsync } from '../utils/errorUtils';
import { isValidName, isValidEmail, isValidCloudinaryUrl } from '../utils/validationUtils';

// get all students with pagination and filtering by classId
export const getStudents = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const classId = req.query.classId as string;

  // empty object, so that the .find({}) can return all documents if there's no classId given by frontend
  const query: any = {};
  if (classId) {
    query.classId = classId;
  }

  const skip = (page - 1) * limit;
  const total = await Student.countDocuments(query);
  const students = await Student.find(query).skip(skip).limit(limit);

  res.json({ students, total, page, totalPages: Math.ceil(total / limit) });
});

// get a student by ID
export const getStudentById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { id } = req.params;
  let student = await Student.findOne({ _id: id, deleted: false });
  if (req.user && req.user.role === 'admin') {
    student = await Student.findOne({ _id: id });
  }

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.json(student);
});

// update a student by ID
export const updateStudent = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { id } = req.params;
  const { name, email, classId, profileImageUrl } = req.body;

  // Ensure req.user is defined
  if (!req.user) {
    return next(new AppError('Authorization required', 401));
  }

  if (req.user.role === 'student' && req.user.id !== id) {
    return next(new AppError('You are not authorized to update this student profile', 401));
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

  const student = await Student.findById(id);
  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  // checking if the new classId exists and if the user has an admin role or not
  if (classId) {
    if (req.user && req.user.role !== 'admin') {
      return next(new AppError('Access denied. Only admins can update the classId.', 403));
    }

    // Find the previous class if it exists
    if (student.classId && student.classId !== classId) {
      const previousClass = await Class.findById(student.classId);
      if (previousClass) {
        // Decrement the student count of the previous class
        if (previousClass.studentCount !== undefined) {
          previousClass.studentCount -= 1;
        }
        await previousClass.save();
      }
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return next(new AppError('Class not found', 404));
    }

    // Increment the student count of the new class
    if (classData.studentCount !== undefined) {
      classData.studentCount += 1;
    } else {
      classData.studentCount = 1; // initialize studentCount if undefined, just in case of unknown error
    }
    await classData.save();
  }

  // create an object with only provided fields (partial object)
  const updateData: Partial<typeof student> = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (classId) updateData.classId = classId;
  if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;

  const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true });

  res.json(updatedStudent);
});

// soft-delete a student by ID
export const deleteStudent = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { id } = req.params;

  const student = await Student.findByIdAndUpdate(
    id,
    { deleted: true, deletedAt: new Date() },
    { new: true }
  );

  // this is basically an error handling code, so it is not redundant
  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  // decrementing student count in the associated class, because student was deleted, duh!!
  if (student.classId) {
    const classData = await Class.findById(student.classId);
    if (classData && classData.studentCount !== undefined) {
      classData.studentCount -= 1;
      await classData.save();
    }
  }

  res.json({ message: 'Student deleted successfully' });
});
