import { RequestHandler } from "express";
import { PatientCasesResponse, PatientCase } from "@shared/api";

// Mock data for demonstration
const mockPatientCases: PatientCase[] = [
  {
    id: "1",
    patientName: "Sarah Ahmed",
    illness: "Heart Surgery Required",
    description:
      "7-year-old Sarah needs urgent heart surgery to repair a congenital defect. Without this surgery, her condition will worsen rapidly.",
    requiredAmount: 25000,
    collectedAmount: 8500,
    verified: true,
    ngoName: "Children's Medical Foundation",
    location: "Mumbai, India",
    urgency: "critical",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    patientName: "Miguel Rodriguez",
    illness: "Cancer Treatment",
    description:
      "35-year-old father of two diagnosed with leukemia needs chemotherapy treatment to save his life.",
    requiredAmount: 45000,
    collectedAmount: 32000,
    verified: true,
    ngoName: "Hope Cancer Center",
    location: "Mexico City, Mexico",
    urgency: "high",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "3",
    patientName: "Amara Okafor",
    illness: "Emergency Surgery",
    description:
      "22-year-old student needs emergency surgery after a severe accident. Time is critical for her recovery.",
    requiredAmount: 18000,
    collectedAmount: 2400,
    verified: true,
    ngoName: "Emergency Medical Aid",
    location: "Lagos, Nigeria",
    urgency: "critical",
    createdAt: "2024-01-25T14:15:00Z",
  },
  {
    id: "4",
    patientName: "Chen Wei",
    illness: "Kidney Transplant",
    description:
      "45-year-old teacher needs a kidney transplant. With proper treatment, he can return to his students.",
    requiredAmount: 60000,
    collectedAmount: 41000,
    verified: true,
    ngoName: "Organ Transplant Foundation",
    location: "Beijing, China",
    urgency: "medium",
    createdAt: "2024-01-30T09:45:00Z",
  },
  {
    id: "5",
    patientName: "Isabella Santos",
    illness: "Spinal Surgery",
    description:
      "16-year-old dancer needs spinal surgery after an injury. This surgery will help her walk again.",
    requiredAmount: 35000,
    collectedAmount: 12500,
    verified: true,
    ngoName: "Youth Medical Support",
    location: "São Paulo, Brazil",
    urgency: "high",
    createdAt: "2024-02-01T16:20:00Z",
  },
  {
    id: "6",
    patientName: "David Thompson",
    illness: "Liver Treatment",
    description:
      "28-year-old father needs liver treatment due to a rare genetic condition affecting his family.",
    requiredAmount: 55000,
    collectedAmount: 18000,
    verified: true,
    ngoName: "Liver Disease Foundation",
    location: "London, UK",
    urgency: "medium",
    createdAt: "2024-02-05T11:10:00Z",
  },
];

export const handlePatientCases: RequestHandler = (req, res) => {
  const response: PatientCasesResponse = {
    cases: mockPatientCases,
    totalCases: mockPatientCases.length,
  };

  res.json(response);
};

export const handlePatientCaseById: RequestHandler = (req, res) => {
  const { id } = req.params;

  const patientCase = mockPatientCases.find(
    (patientCase) => patientCase.id === id,
  );

  if (!patientCase) {
    res.status(404).json({ error: "Patient case not found" });
    return;
  }

  res.json(patientCase);
};
