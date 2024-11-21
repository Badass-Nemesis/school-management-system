import express from 'express';
import { createClass, getClasses, getClassById, updateClass, deleteClass } from '../controllers/classController';
import { catchAsync } from '../utils/errorUtils';
import { requireAdminRole, requireTeacherOrAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to create a new class
router.post('/', requireAdminRole, catchAsync(createClass));

// route to get all classes
router.get('/', requireAdminRole, catchAsync(getClasses));

// route to get a class by ID
router.get('/:id', requireTeacherOrAdminRole, catchAsync(getClassById));

// route to update a class by ID
router.put('/:id', requireAdminRole, catchAsync(updateClass));

// route to delete a class by ID
router.delete('/:id', requireAdminRole, catchAsync(deleteClass));

export default router;
