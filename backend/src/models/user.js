import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'farmer', 'customer'], required: true },
  phoneNumber: { type: String },
  address: { type: String },
  cart: {type: Array, default: [] },
}, { timestamps: true });

export default mongoose.model('User', userSchema);