import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';


import cors from 'cors';

import authRoutes from './routes/auth.js';
import ngoRoutes from './routes/ngo.js';
import donationRoutes from './routes/donation.js';
import patientCaseRoutes from './routes/patientCase.js';


// ✅ Initialize express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());


// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/donation', donationRoutes);
app.use("/api/cases", patientCaseRoutes);
app.use('/api/patient-cases', patientCaseRoutes);


// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err));
