// client/services/patientCases.ts
import { apiClient } from "./api";

export interface PatientCase {
  _id: string;
  patientName: string;
  description: string;
  amountNeeded: number;
  amountRaised: number;
  imageUrl?: string;
}

export const getAllPatientCases = async (): Promise<PatientCase[]> => {
  const response = await apiClient.get<PatientCase[]>("/patient-cases");
  return response.data;
};
