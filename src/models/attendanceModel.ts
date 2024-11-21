import mongoose, { Schema, Document } from 'mongoose';
import { AttendanceInterface } from '../types/types';

const attendanceSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Attendance = mongoose.model<AttendanceInterface & Document>('Attendance', attendanceSchema);

export default Attendance;
