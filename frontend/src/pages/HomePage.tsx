import { Link } from 'react-router-dom';
import { Users, Briefcase, Target, Bot } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Talent Acquisition Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your hiring process with intelligent CV matching, automated screening,
            and seamless SuccessFactors integration
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600 text-sm">
              Intelligent CV parsing and candidate-job matching with AI-driven scoring
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
            <p className="text-gray-600 text-sm">
              Real-time insights into hiring metrics, conversion rates, and AI accuracy
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unified Workflows</h3>
            <p className="text-gray-600 text-sm">
              Seamless collaboration between TA specialists and hiring managers
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">SF Integration</h3>
            <p className="text-gray-600 text-sm">
              Built-in SuccessFactors integration for automated data synchronization
            </p>
          </div>
        </div>

        {/* Portal Links */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* TA Specialist Portal */}
          <Link
            to="/ta"
            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow group"
          >
            <div className="bg-primary-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">TA Specialist</h2>
            <p className="text-gray-600 mb-4">
              Manage jobs, review candidates, and leverage AI insights for efficient recruitment
            </p>
            <span className="text-primary-600 font-semibold group-hover:underline">
              Access Dashboard →
            </span>
          </Link>

          {/* Hiring Manager Portal */}
          <Link
            to="/hm"
            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow group"
          >
            <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Hiring Manager</h2>
            <p className="text-gray-600 mb-4">
              View AI-prioritized candidates, schedule interviews, and collaborate with TA team
            </p>
            <span className="text-green-600 font-semibold group-hover:underline">
              Access Dashboard →
            </span>
          </Link>

          {/* Candidate Portal */}
          <Link
            to="/candidate"
            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow group"
          >
            <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Candidate</h2>
            <p className="text-gray-600 mb-4">
              Apply for jobs, chat with AI assistant, and track your application status
            </p>
            <span className="text-purple-600 font-semibold group-hover:underline">
              Browse Jobs →
            </span>
          </Link>
        </div>

        {/* System Info */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Demo Version 1.0.0 | API: http://localhost:5000</p>
          <p className="mt-2">
            This is a demonstration platform showcasing AI-powered recruitment capabilities
          </p>
        </div>
      </div>
    </div>
  );
}
