import PatientCase from '../models/patientCase.js';
import Ngo from '../models/Ngo.js'; // ✅ ensure path is correct

// ✅ Create a new patient case
export const createCase = async (req, res) => {
  try {
    const ngo = req.ngo.id; // from verified JWT

    const {
      patientName,
      age,
      condition,
      description,
      requiredAmount,
      urgency,
      location,
    } = req.body;

    const newCase = new PatientCase({
      ngo, // ✅ correct field
      patientName,
      age,
      condition,
      description,
      requiredAmount,
      urgency,
      location,
      collectedAmount: 0,
      status: 'pending',
    });

    await newCase.save();
    res.status(201).json({ msg: "Patient case created successfully", case: newCase });
  } catch (err) {
    console.error("Error creating case:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get all patient cases (public for donors)
export const getCases = async (req, res) => {
  try {
    const cases = await PatientCase.find().populate("ngo", "name").lean();

    if (!Array.isArray(cases)) {
      console.error("❌ Unexpected result from DB (not array):", cases);
      return res.status(500).json({ msg: "Unexpected DB response" });
    }

    const transformedCases = cases.map(c => ({
      _id: c._id.toString(),
      patientName: c.patientName,
      illness: c.condition,
      description: c.description,
      requiredAmount: Number(c.requiredAmount) || 1,
      collectedAmount: Number(c.collectedAmount) || 0,
      urgency: c.urgency || "high",
      location: c.location || "Unknown",
      ngoName: c.ngo?.name || "Unknown NGO",
      createdAt: c.createdAt,
    }));

    res.status(200).json({ cases: transformedCases });
  } catch (err) {
    console.error("❌ Error fetching cases:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get a single case by ID
export const getCaseById = async (req, res) => {
  try {
    const patientCase = await PatientCase.findById(req.params.id).populate("ngo", "_id name").lean();

    if (!patientCase) {
      return res.status(404).json({ msg: "Patient case not found" });
    }

    const transformedCase = {
      _id: patientCase._id.toString(),
      patientName: patientCase.patientName,
      condition: patientCase.condition,
      description: patientCase.description,
      requiredAmount: patientCase.requiredAmount,
      collectedAmount: patientCase.collectedAmount || 0,
      urgency: patientCase.urgency || "medium",
      location: patientCase.location || "Unknown",
      ngo: {
        _id: patientCase.ngo?._id || null,
        name: patientCase.ngo?.name || "Unknown NGO",
      },
      createdAt: patientCase.createdAt,
    };

    res.status(200).json(transformedCase);
  } catch (err) {
    console.error("Error fetching case by ID:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Update case by NGO (secured)
export const updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const ngo = req.ngo.id;

    const updatedCase = await PatientCase.findOneAndUpdate(
      { _id: caseId, ngo },
      req.body,
      { new: true }
    );

    if (!updatedCase) return res.status(404).json({ msg: "Case not found or unauthorized" });

    res.status(200).json({ msg: "Case updated", case: updatedCase });
  } catch (err) {
    console.error("Error updating case:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Delete case by NGO (secured)
export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const ngo = req.ngo.id;

    const deletedCase = await PatientCase.findOneAndDelete({ _id: caseId, ngo });

    if (!deletedCase) return res.status(404).json({ msg: "Case not found or unauthorized" });

    res.status(200).json({ msg: "Case deleted" });
  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
