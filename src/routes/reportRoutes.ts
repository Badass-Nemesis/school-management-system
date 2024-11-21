import express from 'express';
import { generateClassReport, generateClassReportFile } from '../controllers/reportController';
import { requireTeacherOrAdminRole } from '../middlewares/authMiddleware';

const router = express.Router();

// route to generate a report for a class in JSON format
router.get('/class/:classId', requireTeacherOrAdminRole, generateClassReport);

// route to generate a report for a class in Excel or PDF format
router.get('/class/:classId/file', requireTeacherOrAdminRole, generateClassReportFile);

export default router;