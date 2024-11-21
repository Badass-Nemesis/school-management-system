import express from 'express';
import { markAttendance, getAttendanceByClass, getAttendanceByStudent, deleteAttendance } from '../controllers/attendanceController';
import { requireTeacherOrAdminRole, requireAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to mark attendance for a student
router.post('/mark', requireTeacherOrAdminRole, markAttendance);

// route to get attendance records by class ID
router.get('/class/:classId', requireTeacherOrAdminRole, getAttendanceByClass);

// route to get attendance records by student ID
router.get('/student/:studentId', requireTeacherOrAdminRole, getAttendanceByStudent);

// route to delete attendance record by ID
router.get('/delete/:id', requireAdminRole, deleteAttendance);

export default router;
