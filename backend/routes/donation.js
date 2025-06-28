import express from 'express';
import { createOrder, verifyPayment,getDonationsForNgo } from '../controllers/donationController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment); // optional: protect with verifyToken
router.get('/history', verifyToken, getDonationsForNgo);

export default router;
