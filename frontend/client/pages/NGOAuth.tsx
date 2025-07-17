import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  ArrowLeft,
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export default function NGOAuth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleLoginInputChange = (field: keyof LoginForm, value: string) => {
    setLoginForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSignupInputChange = (field: keyof SignupForm, value: string) => {
    setSignupForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        setSuccess("Login successful! Redirecting to your dashboard...");
        localStorage.setItem("ngo_token", data.token);
        localStorage.setItem("ngo_data", JSON.stringify(data.user));

        setTimeout(() => {
          navigate("/ngo/dashboard");
        }, 1500);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.phone
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
          phone: signupForm.phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.ngo) {
        setSuccess(
          "Registration successful! Please wait for verification before accessing the dashboard."
        );
        localStorage.setItem("ngo_token", data.token);
        localStorage.setItem("ngo_data", JSON.stringify(data.ngo));

        setTimeout(() => {
          navigate("/ngo-auth");
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                HopeFund
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/cases"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse Cases
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
              <Link to="/ngo-auth" className="text-primary font-medium">
                NGO Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button asChild variant="outline" className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NGO Partner Portal
          </h1>
          <p className="text-gray-600">
            Join our network of verified medical NGOs and help save lives
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    NGO Email Address
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="ngo@example.org"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) =>
                        handleLoginInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={(e) =>
                        handleLoginInputChange("password", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign up here
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="text-sm font-medium">
                    NGO Name
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Medical Foundation Inc."
                      className="pl-10"
                      value={signupForm.name}
                      onChange={(e) =>
                        handleSignupInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="contact@ngo.org"
                      className="pl-10"
                      value={signupForm.email}
                      onChange={(e) =>
                        handleSignupInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      value={signupForm.phone}
                      onChange={(e) =>
                        handleSignupInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="signup-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      className="pl-10"
                      value={signupForm.password}
                      onChange={(e) =>
                        handleSignupInputChange("password", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        handleSignupInputChange(
                          "confirmPassword",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create NGO Account"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            </TabsContent>
                    </Tabs>

          {/* Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              For NGO Partners
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• All NGOs undergo a verification process</li>
              <li>• Submit verified patient cases to our platform</li>
              <li>• Track donations and case progress</li>
              <li>• Access NGO dashboard and analytics</li>
            </ul>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">
            Demo Credentials (For Testing)
          </h3>
          <p className="text-xs text-yellow-800">
            Email: admin@childrenmedical.org
            <br />
            Password: password123
          </p>
        </div>
      </main>
    </div>
  );
}

