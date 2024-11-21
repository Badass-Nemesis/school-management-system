import mongoose, { Schema, Document } from 'mongoose';
import { ClassInterface } from '../types/types';

const classSchema: Schema<ClassInterface & Document> = new Schema({
  name: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  studentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

const Class = mongoose.model<ClassInterface & Document>('Class', classSchema);

export default Class;