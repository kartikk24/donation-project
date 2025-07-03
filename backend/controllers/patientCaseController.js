import PatientCase from '../models/patientCase.js';

export const createCase = async (req, res) => {
  try {
    const ngoId = req.ngo.id;
    const { patientName, patientAge, diagnosis, treatmentDetails, description, amountNeeded, imageUrl } = req.body;

    const newCase = new PatientCase({
      ngoId,
      patientName,
      patientAge,
      diagnosis,
      treatmentDetails,
      description,
      imageUrl,
      amountNeeded,
    });

    await newCase.save();
    res.status(201).json({ msg: "Patient case created successfully", case: newCase });
  } catch (err) {
    console.error("Error creating case:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// export const getCases = async (req, res) => {
//   try {
//     // const ngoId = req.ngo.id;
//     const cases = await PatientCase.find(); //{ngoId}
//     res.status(200).json(cases);
//   } catch (err) {
//     console.error("Error fetching cases:", err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };
export const getCases = async (req, res) => {
  try {
    const cases = await PatientCase.find();

    const transformedCases = cases.map(c => ({
      id: c._id.toString(),                  // ✅ map _id → id for frontend
      patientName: c.patientName,
      patientAge: c.patientAge,
      diagnosis: c.diagnosis,
      treatmentDetails: c.treatmentDetails,
      description: c.description,
      targetAmount: c.amountNeeded,          // ✅ match frontend naming
      raisedAmount: c.amountRaised || 0,     // ✅ match frontend naming
      createdAt: c.createdAt,
    }));

    res.status(200).json(transformedCases);
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Public endpoint: get all patient cases (for donors browsing)
export const getAllCases = async (req, res) => {
  try {
    const cases = await PatientCase.find();
    res.status(200).json({ cases });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const ngoId = req.ngo.id;

    const updatedCase = await PatientCase.findOneAndUpdate(
      { _id: caseId, ngoId },
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

export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const ngoId = req.ngo.id;

    const deletedCase = await PatientCase.findOneAndDelete({ _id: caseId, ngoId });

    if (!deletedCase) return res.status(404).json({ msg: "Case not found or unauthorized" });

    res.status(200).json({ msg: "Case deleted" });
  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
