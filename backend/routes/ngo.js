import express from 'express';
import { registerNgo, loginNgo } from '../controllers/ngoController.js';

const router = express.Router();

router.post('/register', registerNgo);
router.post('/login', loginNgo);

export default router;
