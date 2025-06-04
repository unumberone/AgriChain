import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productLine: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductLine', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: '' }, // Optional image URL
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  unit: { type: String, required: true }, // e.g., kg, liter, etc.
}, { timestamps: true });

export default mongoose.model('Product', productSchema);