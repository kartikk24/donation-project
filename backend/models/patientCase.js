import mongoose from 'mongoose';

const patientCaseSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  diagnosis: { type: String, required: true },
  treatmentDetails: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },  // if you add image upload later
  amountNeeded: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('PatientCase', patientCaseSchema);
