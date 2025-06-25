import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// ✅ Load environment variables
dotenv.config();

// ✅ Import routes (first)
import authRoutes from './routes/auth.js';
import ngoRoutes from './routes/ngo.js';

// ✅ Initialize express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngo', ngoRoutes);

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
