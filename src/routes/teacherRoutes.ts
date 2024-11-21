import express from 'express';
import { getTeachers, getTeacherById, updateTeacher, deleteTeacher } from '../controllers/teacherController';
import { catchAsync } from '../utils/errorUtils';
import { requireAdminRole, requireTeacherOrAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to get all teachers
router.get('/', requireAdminRole, catchAsync(getTeachers));

// route to get a teacher by ID
router.get('/:id', requireTeacherOrAdminRole, catchAsync(getTeacherById));

// route to update a teacher by ID
router.put('/:id', requireTeacherOrAdminRole, catchAsync(updateTeacher));

// route to delete a teacher by ID
router.delete('/:id', requireAdminRole, catchAsync(deleteTeacher));

export default router;
