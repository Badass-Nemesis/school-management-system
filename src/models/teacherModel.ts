import mongoose, { Schema, Document } from 'mongoose';
import { TeacherInterface } from '../types/types';

const teacherSchema: Schema<TeacherInterface & Document> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  subject: { type: String, required: true },
  profileImageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

const Teacher = mongoose.model<TeacherInterface & Document>('Teacher', teacherSchema);

export default Teacher;