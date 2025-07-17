import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowLeft, MapPin, Shield, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PatientCase } from "@shared/api";

interface DonationForm {
  amount: string;
  donorName: string;
  email: string;
  phone: string;
  message: string;
  anonymous: boolean;
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [patientCase, setPatientCase] = useState<PatientCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationForm, setDonationForm] = useState<DonationForm>({
    amount: "",
    donorName: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false,
  });
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    if (id) fetchCase(id);
  }, [id]);

  const fetchCase = async (caseId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patient-cases/${caseId}`);
      if (!response.ok) throw new Error("Patient case not found");
      const data: PatientCase = await response.json();
      setPatientCase(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: PatientCase["urgency"]) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressPercentage = (collected: number, required: number) =>
    Math.min((collected / required) * 100, 100);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const handleInputChange = (
    field: keyof DonationForm,
    value: string | boolean
  ) => {
    setDonationForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationForm.amount || !donationForm.donorName || !donationForm.email) {
      alert("Please fill all required fields");
      return;
    }

    const amount = parseFloat(donationForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter valid donation amount");
      return;
    }

    setDonating(true);

    try {
      await new Promise((resolve, reject) => {
        const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
        if (existingScript) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject("Failed to load Razorpay script");
        document.body.appendChild(script);
      });

      const orderRes = await fetch("/api/donation/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName: donationForm.donorName,
          donorEmail: donationForm.email,
          message: donationForm.message,
        ngo: typeof patientCase.ngo === "string" ? patientCase.ngo : patientCase.ngo?._id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.orderId) throw new Error("Failed to create Razorpay order");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HopeFund",
        description: `Donation for ${patientCase?.patientName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
//           console.log("🔍 Verifying donation with:", {
//   razorpay_payment_id: response.razorpay_payment_id,
//   razorpay_order_id: response.razorpay_order_id,
//   razorpay_signature: response.razorpay_signature,
//   donorName: donationForm.donorName,
//   donorEmail: donationForm.email,
//   amount,
//   message: donationForm.message,
//   ngoId: typeof patientCase.ngo === "string" ? patientCase.ngo : patientCase.ngo?._id,
//   patientId: patientCase!._id,
// });
// console.log("🧪 patientCase.ngo value:", patientCase.ngo);
// console.log("🔍 Sending verification body with ngoId:", 
//   typeof patientCase.ngo === "string" 
//     ? patientCase.ngo 
//     : patientCase.ngo?._id
// );

          const verifyRes = await fetch("/api/donation/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donorName: donationForm.donorName,
              donorEmail: donationForm.email,
              amount,
              message: donationForm.message,
             ngo: typeof patientCase.ngo === "string" ? patientCase.ngo : patientCase.ngo?._id,

              patientId: patientCase!._id,
            }),
          });

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          alert("🎉 Donation successful! Thank you.");
          fetchCase(patientCase!._id);
          setDonationForm({
            amount: "",
            donorName: "",
            email: "",
            phone: "",
            message: "",
            anonymous: false,
          });
        },

        prefill: {
          name: donationForm.donorName,
          email: donationForm.email,
          contact: donationForm.phone,
        },
        theme: { color: "#0f172a" },
         image: "https://dummyimage.com/100x100/0f172a/ffffff.png&text=HopeFund"
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during donation");
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading case...</p>
      </div>
    );
  }

  if (error || !patientCase) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-red-500">❌ {error || "Case not found"}</p>
      </div>
    );
  }

  const ngoName =
    typeof patientCase.ngo === "object"
      ? patientCase.ngo?.name
      : patientCase.ngoName || "Unknown NGO";

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Button asChild variant="outline" className="mb-6">
        <Link to="/cases">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cases
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patientCase.patientName}</h2>
                <p className="text-gray-700">{patientCase.condition}</p>
              </div>
              <Badge className={getUrgencyColor(patientCase.urgency)}>
                {patientCase.urgency.toUpperCase()} PRIORITY
              </Badge>
            </div>

            <div className="text-gray-600 mb-4">{patientCase.description}</div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {patientCase.location}
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Verified by {ngoName}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(patientCase.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Funding Progress</span>
                <span>
                  {Math.round(
                    getProgressPercentage(patientCase.collectedAmount, patientCase.requiredAmount)
                  )}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{
                    width: `${getProgressPercentage(patientCase.collectedAmount, patientCase.requiredAmount)}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Raised: {formatCurrency(patientCase.collectedAmount)}</span>
                <span>Goal: {formatCurrency(patientCase.requiredAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border sticky top-24">
          <h3 className="text-xl font-bold mb-4 text-center">Make a Donation</h3>
          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <Label>Donation Amount *</Label>
              <Input
                type="number"
                value={donationForm.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input
                type="text"
                value={donationForm.donorName}
                onChange={(e) => handleInputChange("donorName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={donationForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={donationForm.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                rows={2}
                value={donationForm.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
              />
            </div>
            <Button type="submit" disabled={donating} className="w-full">
              {donating ? "Processing..." : "Donate Now"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
