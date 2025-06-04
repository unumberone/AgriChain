import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['success', 'fail'], default: 'success' },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người nông dân cung cấp sản phẩm
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);