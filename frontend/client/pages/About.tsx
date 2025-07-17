import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
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
              <Link to="/about" className="text-primary font-medium">
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Us
          </h1>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Our Mission: Connecting Hope with Healing
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              At HopeFund, we believe that no one should suffer or die from a
              treatable medical condition simply because they cannot afford
              care. Our mission is to bridge the gap between patients facing
              life-threatening medical emergencies and compassionate donors who
              want to make a real difference. We connect critical patient cases
              with people who have the power to save lives, creating a global
              community of hope and healing.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Every day, countless individuals and families face impossible
              choices between medical treatment and financial survival. Our
              platform transforms these moments of despair into opportunities
              for human connection and healing. When you donate through
              HopeFund, you're not just contributing money—you're giving someone
              a second chance at life, hope to a family in crisis, and
              demonstrating the profound impact that human compassion can have
              on the world.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Our Rigorous Verification Process
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Trust is the foundation of everything we do. Every patient case on
              our platform undergoes a comprehensive verification process
              through our network of established medical NGOs and healthcare
              institutions. Our partner organizations have years of experience
              in medical aid and maintain strict standards for case
              documentation. Before any case appears on HopeFund, it must be
              submitted by a verified NGO, include complete medical
              documentation, provide proof of treatment costs, and undergo
              review by our medical advisory team.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              We work exclusively with NGOs that have proven track records in
              medical assistance, transparent financial practices, and
              established relationships with healthcare providers. Each partner
              organization is vetted for legitimacy, financial transparency, and
              medical expertise. This multi-layered approach ensures that every
              case you see represents a real person with a genuine medical need,
              and that your donation will reach its intended purpose.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Why You Can Trust HopeFund
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Your trust is sacred to us, and we've built multiple safeguards to
              protect it. One hundred percent of your donation goes directly to
              the patient's medical expenses—we never take a percentage or fee
              from donations. All funds are transferred directly to the medical
              institution treating the patient, ensuring that your money reaches
              its intended destination. We provide complete transparency with
              regular updates on case progress, treatment outcomes, and fund
              utilization, so you can see the direct impact of your generosity.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Our platform operates with full financial transparency, secure
              payment processing, and detailed reporting on every donation and
              case outcome. We maintain open communication channels with donors,
              provide receipts and documentation for all contributions, and
              offer direct contact with our support team for any questions or
              concerns. When you choose HopeFund, you're choosing a platform
              that puts patient welfare and donor trust above all else, creating
              a safe space where compassion can flourish and lives can be saved.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Save a Life?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of donors who have already made a difference. Browse
            our verified patient cases and discover how your generosity can
            transform despair into hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/cases">Browse Patient Cases</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
