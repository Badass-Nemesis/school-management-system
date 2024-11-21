import mongoose, { Schema, Document } from 'mongoose';
import { StudentInterface } from '../types/types';

const studentSchema: Schema<StudentInterface & Document> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  profileImageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

const Student = mongoose.model<StudentInterface & Document>('Student', studentSchema);

export default Student;