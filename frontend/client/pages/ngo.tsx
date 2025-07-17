import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Trash2, User } from "lucide-react";
import { PatientCase, NGO as NgoData, CreateCaseRequest } from "@shared/api";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ngoData, setNgoData] = useState<NgoData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCaseRequest>({
    patientName: "",
    age: 0,
    condition: "",
    description: "",
    status: "pending",
    requiredAmount: 0,
    location: "",
    urgency: "low",
  });

  useEffect(() => {
    const token = localStorage.getItem("ngo_token");
    const storedNgoData = localStorage.getItem("ngo_data");
    if (!token || !storedNgoData) {
      navigate("/ngo-auth");
      return;
    }
    try {
      const parsedNgoData = JSON.parse(storedNgoData);
      setNgoData(parsedNgoData);
    } catch {
      navigate("/ngo-auth");
    }
  }, [navigate]);

  useEffect(() => {
    if (ngoData) fetchCases();
  }, [ngoData]);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("ngo_token")}`,
  });

  const fetchCases = async () => {
  try {
    setLoading(true);
    const response = await fetch("/api/patient-cases/my-cases", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch cases");
    const data = await response.json();
    console.log("Fetched case data:", JSON.stringify(data, null, 2));

    // 🔥 THIS LINE IS THE FIX:
    setCases(data);
    
  } catch (err) {
    setError(err instanceof Error ? err.message : "Fetch error");
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("ngo_token");
    localStorage.removeItem("ngo_data");
    navigate("/ngo-auth");
  };

  const handleCreateCase = async () => {
    if (!ngoData) return;
    try {
      const response = await fetch("/api/patient-cases/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, ngo: ngoData.id, ngoName: ngoData.name }),
      });
      if (!response.ok) throw new Error("Failed to create case");
      await fetchCases();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create error");
    }
  };

  const handleDeleteCase = async (caseId: string | undefined) => {
    if (!caseId) {
      setError("Invalid case ID");
      return;
    }
    try {
      const response = await fetch(`/api/patient-cases/${caseId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Delete failed");
      await fetchCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete error");
    }
  };

  const resetForm = () =>
    setFormData({
      patientName: "",
      age: 0,
      condition: "",
      description: "",
      status: "pending",
      requiredAmount: 0,
      location: "",
      urgency: "low",
    });

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
          <div>
            <h1 className="text-2xl font-bold">NGO Dashboard</h1>
            {ngoData && <p className="text-sm text-gray-600">Welcome, {ngoData.name}</p>}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="mt-2">
              Dismiss
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Patient Cases</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Case
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Patient Case</DialogTitle>
                <DialogDescription>Fill in the case details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {[
                  ["patientName", "Name", "text"],
                  ["age", "Age", "number"],
                  ["condition", "Condition", "text"],
                  ["description", "Description", "textarea"],
                  ["requiredAmount", "Required Amount", "number"],
                  ["location", "Location", "text"],
                ].map(([id, label, type]) => (
                  <div key={id} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={id as string} className="text-right">
                      {label}
                    </Label>
                    {type === "textarea" ? (
                      <Textarea
                        id={id as string}
                        value={(formData as any)[id]}
                        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                        className="col-span-3"
                      />
                    ) : (
                      <Input
                        id={id as string}
                        type={type}
                        value={(formData as any)[id]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [id]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "pending" | "active" })}
                    className="col-span-3 flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="urgency" className="text-right">
                    Urgency
                  </Label>
                  <select
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="col-span-3 flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {["low", "medium", "high", "critical"].map((u) => (
                      <option key={u} value={u}>
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCase}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No cases found</h3>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Case
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((patientCase) => {
              const progress = Math.min(
                Math.round(((patientCase.collectedAmount || 0) / patientCase.requiredAmount) * 100),
                100
              );
              return (
                <Card key={patientCase._id} className="hover:shadow-lg p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{patientCase.patientName}</CardTitle>
                      <Badge
                        variant={
                          patientCase.status === "active" ? "destructive" : "secondary"
                        }
                      >
                        {typeof patientCase.status === "string"
                          ? patientCase.status.toUpperCase()
                          : "UNKNOWN"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{patientCase.description}</p>
                    <p className="text-xs text-gray-500 mb-2">Urgency: {patientCase.urgency}</p>
                    <p className="text-xs text-gray-500">Location: {patientCase.location}</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <div>Raised: ₹{patientCase.collectedAmount}</div>
                      <div>Goal: ₹{patientCase.requiredAmount}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Case</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {patientCase.patientName}'s case?
                              This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCase(patientCase._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
