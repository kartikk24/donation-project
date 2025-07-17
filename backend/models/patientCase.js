// import mongoose from 'mongoose';

// const patientCaseSchema = new mongoose.Schema({
//   ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
//   patientName: { type: String, required: true },
//   age: { type: Number, required: true },                         // renamed from patientAge
//   condition: { type: String, required: true },                   // renamed from diagnosis
//   description: { type: String, required: true },
//   requiredAmount: { type: Number, required: true },              // renamed from amountNeeded
//   collectedAmount: { type: Number, default: 0 },                 // renamed from amountRaised

//   urgency: { 
//     type: String, 
//     enum: ['low', 'medium', 'high', 'critical'], 
//     default: 'medium',
//     required: true,
//   },
//   location: { type: String, required: true },

//   createdAt: { type: Date, default: Date.now },
// });


// export default mongoose.model('PatientCase', patientCaseSchema);
import mongoose from 'mongoose';

const patientCaseSchema = new mongoose.Schema({
  patientName: String,
  age: Number,
  condition: String,
  requiredAmount: Number,
  raisedAmount: {
    type: Number,
    default: 0,
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo',
    required: true
  },
  // Add timestamps if needed
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
export default mongoose.models.PatientCase || mongoose.model("PatientCase", patientCaseSchema);
