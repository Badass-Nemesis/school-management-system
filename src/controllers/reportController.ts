import { Request, Response, NextFunction } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
// import { Readable } from 'stream'; // not using it
import Class from '../models/classModel';
import Teacher from '../models/teacherModel';
import Student from '../models/studentModel';
import { AppError, catchAsync } from '../utils/errorUtils';

// generate a report for a class
export const generateClassReport = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { classId } = req.params;
    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Fetch class details
    const classData = await Class.findById(classId);
    if (!classData) {
        return next(new AppError('Class not found', 404));
    }

    // Fetch teacher information
    const teacherData = await Teacher.findById(classData.teacherId);
    if (!teacherData) {
        return next(new AppError('Teacher not found', 404));
    }

    // Verify that the teacher is associated with the class
    if (req.user.role === 'teacher' && classData.teacherId.toString() !== req.user.id) {
        return next(new AppError('You are not authorized to generate a report for this class', 403));
    }

    // Fetch students associated with the class
    const students = await Student.find({ classId });

    // Format report data
    const report = {
        class: {
            id: classData._id,
            name: classData.name,
            studentCount: classData.studentCount,
            createdAt: classData.createdAt
        },
        teacher: {
            id: teacherData._id,
            name: teacherData.name,
            email: teacherData.email,
            subject: teacherData.subject,
            profileImageUrl: teacherData.profileImageUrl
        },
        students: students.map(student => ({
            id: student._id,
            name: student.name,
            email: student.email,
            profileImageUrl: student.profileImageUrl
        }))
    };

    // Respond with the report
    res.status(200).json(report);
});

// generate a report for a class in Excel or PDF format
export const generateClassReportFile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { classId } = req.params;
    const { format } = req.query; // 'excel' or 'pdf'

    if (!req.user) {
        return next(new AppError('Authorization required', 401));
    }

    // Fetch class details
    const classData = await Class.findById(classId);
    if (!classData) {
        return next(new AppError('Class not found', 404));
    }

    // Fetch teacher information
    const teacherData = await Teacher.findById(classData.teacherId);
    if (!teacherData) {
        return next(new AppError('Teacher not found', 404));
    }

    // Verify that the teacher is associated with the class
    if (req.user.role === 'teacher' && classData.teacherId.toString() !== req.user.id) {
        return next(new AppError('You are not authorized to generate a report for this class', 403));
    }

    // Fetch students associated with the class
    const students = await Student.find({ classId });

    if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Class Report');

        worksheet.columns = [
            { header: 'Student ID', key: 'id', width: 20 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Profile Image URL', key: 'profileImageUrl', width: 50 },
        ];

        students.forEach(student => {
            worksheet.addRow({
                id: student._id,
                name: student.name,
                email: student.email,
                profileImageUrl: student.profileImageUrl,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=class_report.xlsx');
        res.send(buffer);
    } else if (format === 'pdf') {
        const doc = new PDFDocument();
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=class_report.pdf',
        });

        doc.pipe(stream);

        doc.fontSize(16).text('Class Report', { align: 'center' });
        doc.fontSize(12).text(`Class Name: ${classData.name}`);
        doc.fontSize(12).text(`Teacher: ${teacherData.name} (${teacherData.email})`);
        doc.moveDown();

        students.forEach(student => {
            doc.text(`Student ID: ${student._id}`);
            doc.text(`Name: ${student.name}`);
            doc.text(`Email: ${student.email}`);
            if (student.profileImageUrl) {
                doc.text(`Profile Image URL: ${student.profileImageUrl}`);
            }
            doc.moveDown();
        });

        doc.end();
    } else {
        return next(new AppError('Invalid format specified. Use "excel" or "pdf".', 400));
    }
});