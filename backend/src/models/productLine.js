import mongoose from 'mongoose';

const productLineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String},
  cultivationProcess: { type: String },
  packagingUnit: { type: String },
  certifications: { type: String},
  harvestDate: { type: Date},
  batchId: { type: String, unique: true},
  transportationRoute: { type: String },
  description: { type: String },
  image: { type: String }, // URL or path to the image
  qrCode: { type: String}, // URL or path to the QR code image
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('ProductLine', productLineSchema);