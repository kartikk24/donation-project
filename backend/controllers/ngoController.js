import Ngo from '../models/Ngo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



export const registerNgo = async (req, res) => {
  try {
    const { name, email, organizationName, password } = req.body;

    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) return res.status(400).json({ msg: 'NGO already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newNgo = new Ngo({ name, email, organizationName, password: hashedPassword });
    await newNgo.save();

    res.status(201).json({ msg: 'NGO registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const loginNgo = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await Ngo.findOne({ email });
    if (!ngo) return res.status(404).json({ msg: 'NGO not found' });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        organizationName: ngo.organizationName,
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
// it gives you the profile.
export const getNgoProfile = async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.ngo.id).select('-password'); // exclude hashed password
    if (!ngo) return res.status(404).json({ msg: 'NGO not found' });

    res.status(200).json(ngo);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const updateNgoProfile = async (req, res) => {
  try {
    const { name, organizationName } = req.body;

    const updatedNgo = await Ngo.findByIdAndUpdate(
      req.ngo.id,
      { name, organizationName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      msg: 'NGO profile updated successfully',
      ngo: {
        id: updatedNgo._id,
        name: updatedNgo.name,
        email: updatedNgo.email,
        organizationName: updatedNgo.organizationName,
      },
    });
  } catch (err) {
    console.error('Error updating NGO profile:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const deleteNgoAccount = async (req, res) => {
  try {
    await Ngo.findByIdAndDelete(req.ngo.id);
    res.status(200).json({ msg: 'NGO account deleted successfully' });
  } catch (err) {
    console.error('Error deleting NGO account:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


