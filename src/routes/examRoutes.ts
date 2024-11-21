import express from 'express';
import { addExam, getExams, updateExam, deleteExam } from '../controllers/examController';
import { requireTeacherOrAdminRole, requireAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to add a new exam
router.post('/add', requireTeacherOrAdminRole, addExam);

// route to get all exams for a class
router.get('/class/:classId', requireTeacherOrAdminRole, getExams);

// route to update exam details
router.put('/update/:id', requireTeacherOrAdminRole, updateExam);

// route to delete an exam
router.delete('/delete/:id', requireAdminRole, deleteExam);

export default router;
