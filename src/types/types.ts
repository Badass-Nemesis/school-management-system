import { Types } from 'mongoose';

export interface TeacherInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
  subject: string;
  profileImageUrl?: string;
  createdAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

export interface StudentInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
  classId: Types.ObjectId;
  profileImageUrl?: string;
  createdAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

export interface ClassInterface {
  _id: string;
  name: string;
  teacherId: Types.ObjectId;
  studentCount?: number;
  createdAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

export interface AdminInterface {
  name: string;
  email: string;
  password: string;
  role: 'admin';
  createdAt?: Date;
}

export interface AuthInterface {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'teacher' | 'admin'; // optional, used during registration to determine the role
  subject?: string; // required for teacher registration
  classId?: string; // required for student registration
}

export interface AttendanceInterface {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExamInterface {
  _id: Types.ObjectId;
  name: string;
  classId: Types.ObjectId;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResultInterface {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  examId: Types.ObjectId;
  marksObtained: number;
  grade?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// did this because of the issue in authMiddleware, in req.user
// Extending the Request interface to include user information
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; role: 'student' | 'teacher' | 'admin' };
  }
}