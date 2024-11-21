import express from 'express';
import { getStudents, getStudentById, updateStudent, deleteStudent } from '../controllers/studentController';
import { catchAsync } from '../utils/errorUtils';
import { requireAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to get all students
router.get('/', requireAdminRole, catchAsync(getStudents));

// route to get a student by ID
router.get('/:id', catchAsync(getStudentById));

// route to update a student by ID
router.put('/:id', catchAsync(updateStudent));

// route to delete a student by ID
router.delete('/:id', requireAdminRole, catchAsync(deleteStudent));

export default router;
