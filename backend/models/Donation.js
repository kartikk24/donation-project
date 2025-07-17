import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending', // pending, success, failed
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);



















