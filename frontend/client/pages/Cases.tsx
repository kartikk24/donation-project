import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PatientCase } from "@shared/api";

export default function Cases() {
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  // 🔄 Refresh when tab is focused again
  useEffect(() => {
    const handleFocus = () => {
      fetchCases();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Razorpay script load
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

 const fetchCases = async () => {
  try {
    setLoading(true);
    const response = await fetch("/api/patient-cases");

    const text = await response.text();
    // console.log("🔁 Raw response text:", text);

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}: ${text}`);
    }

    const data = JSON.parse(text);
    // console.log("✅ Parsed response:", data);

    if (Array.isArray(data)) {
      setCases(data);
    } else if (data && Array.isArray(data.cases)) {
      setCases(data.cases);
    } else {
      console.error("Unexpected API response structure:", data);
      setCases([]);
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
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

  const getProgressPercentage = (collected: number = 0, required: number = 1) => {
    const safeRequired = required > 0 ? required : 1;
    return Math.min((collected / safeRequired) * 100, 100);
  };

  const formatCurrency = (amount: number = 0) => {
    if (typeof amount !== "number" || isNaN(amount)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-semibold text-gray-900">HopeFund</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/cases" className="text-primary font-medium">Browse Cases</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Admin Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Active Patient Cases</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help save lives by supporting verified patient cases. Every donation brings hope and healing to families in urgent need of medical care.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600">Loading patient cases...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium">Failed to load cases</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button onClick={fetchCases} variant="outline" className="mt-4" size="sm">Try Again</Button>
          </div>
        )}

        {!loading && !error && cases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((patientCase) => {
              const collected = Number(patientCase.collectedAmount) || 0;
              const required = Number(patientCase.requiredAmount) > 0 ? Number(patientCase.requiredAmount) : 1;
              const progress = getProgressPercentage(collected, required);
              const key = patientCase._id || `${patientCase.patientName}-${required}`;

              return (
                <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {patientCase.patientName}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {patientCase.condition}
                        </p>
                      </div>
                      <Badge
                        className={`${getUrgencyColor(patientCase.urgency)} font-medium`}
                        variant="outline"
                      >
                        {(patientCase.urgency ?? "unknown").toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{patientCase.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{patientCase.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      by {patientCase.ngoName || "Unknown NGO"}
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Raised: <span className="font-semibold text-gray-900">{formatCurrency(collected)}</span>
                        </span>
                        <span className="text-gray-600">
                          Goal: <span className="font-semibold text-gray-900">{formatCurrency(required)}</span>
                        </span>
                      </div>
                    </div>

                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link to={`/case/${patientCase._id}`}>
                        <Heart className="w-4 h-4 mr-2" />
                        Donate Now
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && cases.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Cases</h3>
            <p className="text-gray-600">There are currently no patient cases that need funding.</p>
          </div>
        )}
      </main>
    </div>
  );
}
