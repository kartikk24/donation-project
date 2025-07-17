import { RequestHandler } from "express";
import {
  NGOLoginRequest,
  NGOSignupRequest,
  NGOAuthResponse,
} from "@shared/api";

// Mock NGO database
const mockNGOs = [
  {
    id: "1",
    name: "Children's Medical Foundation",
    email: "admin@childrenmedical.org",
    password: "password123", // In real app, this would be hashed
    phone: "+1-555-0101",
    verified: true,
  },
  {
    id: "2",
    name: "Hope Cancer Center",
    email: "contact@hopecancer.org",
    password: "secure456",
    phone: "+1-555-0102",
    verified: true,
  },
];

export const handleNGOLogin: RequestHandler = (req, res) => {
  const { email, password }: NGOLoginRequest = req.body;

  if (!email || !password) {
    const response: NGOAuthResponse = {
      success: false,
      message: "Email and password are required",
    };
    res.status(400).json(response);
    return;
  }

  const ngo = mockNGOs.find(
    (n) => n.email === email && n.password === password,
  );

  if (!ngo) {
    const response: NGOAuthResponse = {
      success: false,
      message: "Invalid email or password",
    };
    res.status(401).json(response);
    return;
  }

  const response: NGOAuthResponse = {
    success: true,
    message: "Login successful",
    ngo: {
      id: ngo.id,
      name: ngo.name,
      email: ngo.email,
      phone: ngo.phone,
      verified: ngo.verified,
    },
    token: `mock-jwt-token-${ngo.id}`,
  };

  res.json(response);
};

export const handleNGOSignup: RequestHandler = (req, res) => {
  const { name, email, password, phone }: NGOSignupRequest = req.body;

  if (!name || !email || !password || !phone) {
    const response: NGOAuthResponse = {
      success: false,
      message: "All fields are required",
    };
    res.status(400).json(response);
    return;
  }

  // Check if NGO already exists
  const existingNGO = mockNGOs.find((n) => n.email === email);
  if (existingNGO) {
    const response: NGOAuthResponse = {
      success: false,
      message: "An NGO with this email already exists",
    };
    res.status(409).json(response);
    return;
  }

  // Create new NGO
  const newNGO = {
    id: (mockNGOs.length + 1).toString(),
    name,
    email,
    password, // In real app, this would be hashed
    phone,
    verified: false, // New NGOs need verification
  };

  mockNGOs.push(newNGO);

  const response: NGOAuthResponse = {
    success: true,
    message: "NGO registration successful. Please wait for verification.",
    ngo: {
      id: newNGO.id,
      name: newNGO.name,
      email: newNGO.email,
      phone: newNGO.phone,
      verified: newNGO.verified,
    },
    token: `mock-jwt-token-${newNGO.id}`,
  };

  res.status(201).json(response);
};
