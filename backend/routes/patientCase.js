import express from 'express';
import { verifyToken } from '../middleware/authmiddleware.js';
import { createCase, getCases, updateCase, deleteCase ,getAllCases} from '../controllers/patientCaseController.js';

const router = express.Router();
console.log("Sending patient cases:", getCases);


router.post('/create', verifyToken, createCase); 
router.get('/', getCases);          
router.put('/:id', verifyToken, updateCase);     
router.delete('/:id', verifyToken, deleteCase); 
// 🌐 Public endpoint for donors
router.get('/public', getAllCases); 

export default router;
