import express from 'express';
import { registerNgo, loginNgo } from '../controllers/ngoController.js';

const router = express.Router();

// ✅ This route logs and then handles registration
router.post('/register', (req, res, next) => {
  console.log('📥 Register route hit');
  next();
}, registerNgo);

// ✅ Login route
router.post('/login', loginNgo);

export default router;
