import mongoose, { Schema, Document } from 'mongoose';
import { ExamInterface } from '../types/types';

const examSchema: Schema<ExamInterface & Document> = new Schema({
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Exam = mongoose.model<ExamInterface & Document>('Exam', examSchema);

export default Exam;
