import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organisationType: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },  // ✅ add phone field
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
