import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { createCase, getCases, updateCase, deleteCase,getCaseById } from '../controllers/patientCaseController.js';
import PatientCase from "../models/patientCase.js";


const router = express.Router();
// console.log("Sending patient cases:", getCases);

 // adjust path as needed



router.post('/create', verifyToken, createCase); 
router.get('/', getCases);          
router.put('/:id', verifyToken, updateCase);     
router.delete('/:id', verifyToken, deleteCase); 
// 🌐 Public endpoint for donors
router.get("/my-cases", verifyToken, async (req, res) => {
  try {
    const ngoId = req.ngo.id;
    // console.log("Fetching cases for NGO:", ngoId);

    const cases = await PatientCase.find({ ngo:ngoId });
    // console.log("Cases found:", cases.length);

    res.status(200).json( cases ); // ✅ return object, not array
  } catch (err) {
    console.error("Error fetching NGO cases:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/:id", getCaseById);



export default router;
