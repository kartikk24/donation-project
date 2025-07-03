import express from 'express';
import { createOrder, verifyPayment, getDonationsForNgo } from '../controllers/donationController.js';
import { verifyToken } from '../middleware/authmiddleware.js';
import PatientCase from "../models/patientCase.js";  // ✅ Add this import

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', verifyToken, getDonationsForNgo);

// ✅ NEW route: update raisedAmount after donation
router.post("/", async (req, res) => {
    console.log("Incoming donation request body:", req.body);
  const { patientId, amount } = req.body;

  try {
    const patientCase = await PatientCase.findById(patientId);
    if (!patientCase) {
      return res.status(404).json({ error: "Patient case not found" });
    }

    patientCase.raisedAmount += amount;
    await patientCase.save();

    res.json({ success: true, message: "Donation recorded successfully" });
  } catch (error) {
    console.error("Donation error:", error);
    res.status(500).json({ error: "Failed to process donation" });
  }
});

export default router;
