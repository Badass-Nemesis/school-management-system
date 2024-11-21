import mongoose, { Schema, Document } from 'mongoose';
import { AdminInterface } from '../types/types';

const adminSchema: Schema<AdminInterface & Document> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model<AdminInterface & Document>('Admin', adminSchema);

export default Admin;
