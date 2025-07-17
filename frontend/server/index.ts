import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handlePatientCases,
  handlePatientCaseById,
} from "./routes/patient-cases";
import { handleNGOLogin, handleNGOSignup } from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/patient-cases", handlePatientCases);
  app.get("/api/patient-cases/:id", handlePatientCaseById);
  app.post("/api/auth/login", handleNGOLogin);
  app.post("/api/auth/signup", handleNGOSignup);

  return app;
}
