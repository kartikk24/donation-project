import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-white">
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
              <Link to="/login" className="text-primary font-medium">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            NGO Login & Signup
          </h1>

          <div className="bg-gray-50 rounded-xl p-12 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Partner Portal
            </h2>
            <p className="text-gray-600 mb-6">
              Are you an NGO or medical institution looking to partner with
              HopeFund? Access your dashboard to submit verified patient cases
              and track donation progress.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/ngo-auth">Access NGO Portal</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
