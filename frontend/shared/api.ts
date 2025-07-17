export interface NGO {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
}

export interface PatientCase {
  _id: string;
  patientName: string;
  age: number;
  condition: string;
  description: string;
  status: "pending" | "active" | "resolved";
  requiredAmount: number;
  collectedAmount: number;
  imageUrl?: string;
  verified: boolean;
  ngo: {
    _id: string;
    name: string;
  }; // ✅ allow both raw ID and populated object
  ngoName: string;
  location: string;
  urgency: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

export interface CreateCaseRequest {
  patientName: string;
  age: number;
  condition: string;
  description: string;
  status: "pending" | "active";
  requiredAmount: number;
  ngoId?: string;
  ngoName?: string;
  location: string;
  urgency: "low" | "medium" | "high" | "critical";
}

export interface UpdateCaseRequest extends CreateCaseRequest {
  id: string;
}

export interface PatientCasesResponse {
  cases: PatientCase[];
  totalCases: number;
}

export interface NGOLoginRequest {
  email: string;
  password: string;
}

export interface NGOSignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface NGOAuthResponse {
  success: boolean;
  message: string;
  ngo?: NGO;
  token?: string;
}
