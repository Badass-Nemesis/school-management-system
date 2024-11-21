import mongoose, { Schema, Document } from 'mongoose';
import { ResultInterface } from '../types/types';

const resultSchema: Schema<ResultInterface & Document> = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    marksObtained: { type: Number, required: true },
    grade: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Result = mongoose.model<ResultInterface & Document>('Result', resultSchema);

export default Result;
