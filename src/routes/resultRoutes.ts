import express from 'express';
import { recordResult, getResultsByStudent, getResultsByExam, updateResult, deleteResult } from '../controllers/resultController';
import { requireTeacherOrAdminRole, requireAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to record a new result
router.post('/record', requireTeacherOrAdminRole, recordResult);

// route to get results by student
router.get('/student/:studentId', requireTeacherOrAdminRole, getResultsByStudent);

// route to get results by exam
router.get('/exam/:examId', requireTeacherOrAdminRole, getResultsByExam);

// route to update a result
router.put('/update/:id', requireTeacherOrAdminRole, updateResult);

// route to delete a result
router.delete('/delete/:id', requireAdminRole, deleteResult);

export default router;
