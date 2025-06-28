import express from 'express';
import { registerNgo, loginNgo } from '../controllers/ngoController.js';
import { verifyToken } from '../middleware/authmiddleware.js';
import { getNgoProfile } from '../controllers/ngoController.js';
import { updateNgoProfile } from '../controllers/ngoController.js';
import { deleteNgoAccount } from '../controllers/ngoController.js';


const router = express.Router();

router.post('/register', registerNgo);
router.post('/login', loginNgo);
router.get('/profile', verifyToken, getNgoProfile);
router.put('/profile', verifyToken, updateNgoProfile);
// ✅ Delete NGO account (protected)
router.delete('/profile', verifyToken, deleteNgoAccount);


// 🔐 Protected route
// router.get('/profile', verifyToken, (req, res) => {
//   res.status(200).json({ msg: "Protected NGO profile accessed", ngoId: req.ngo.id });
// });
// router.get('/profile', verifyToken, getNgoProfile);

export default router;
