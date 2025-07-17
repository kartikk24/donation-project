import { useState } from "react";
import { apiClient } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function AddCase() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    diagnosis: "",
    treatmentDetails: "",
    description: "",
    amountNeeded: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as an admin to add a case!");
        return;
      }

      const response = await apiClient.post(
        "/patient-cases/create", // ✅ point to your protected backend route
        {
          patientName: formData.patientName,
          patientAge: Number(formData.patientAge),
          diagnosis: formData.diagnosis,
          treatmentDetails: formData.treatmentDetails,
          description: formData.description,
          amountNeeded: Number(formData.amountNeeded),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Case created:", response.data);
      alert("Case created successfully!");
      navigate("/admin-dashboard"); // ✅ redirect to admin page if you have one
    } catch (err: any) {
      console.error("Error creating case:", err.response?.data || err.message);
      alert("Failed to create case. See console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow">
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        className="w-full border p-2 rounded"
        value={formData.patientName}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="patientAge"
        placeholder="Patient Age"
        className="w-full border p-2 rounded"
        value={formData.patientAge}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="diagnosis"
        placeholder="Diagnosis"
        className="w-full border p-2 rounded"
        value={formData.diagnosis}
        onChange={handleChange}
        required
      />
      <textarea
        name="treatmentDetails"
        placeholder="Treatment Details"
        className="w-full border p-2 rounded"
        value={formData.treatmentDetails}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full border p-2 rounded"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amountNeeded"
        placeholder="Amount Needed"
        className="w-full border p-2 rounded"
        value={formData.amountNeeded}
        onChange={handleChange}
        required
      />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90">
        Submit Case
      </button>
    </form>
  );
}
