import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, FileText, MessageCircle, LogOut } from 'lucide-react';
import { jobAPI } from '../services/api';
import type { Job } from '../types';

function CandidatePortal() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Candidate Portal</h2>
          <p className="text-sm text-gray-500">Welcome!</p>
        </div>

        <nav className="mt-6">
          <NavLink to="/candidate" icon={<Home size={20} />} active={location.pathname === '/candidate'}>
            Home
          </NavLink>
          <NavLink to="/candidate/jobs" icon={<Briefcase size={20} />} active={location.pathname.includes('/jobs')}>
            Browse Jobs
          </NavLink>
          <NavLink to="/candidate/applications" icon={<FileText size={20} />} active={location.pathname.includes('/applications')}>
            My Applications
          </NavLink>
          <NavLink to="/candidate/chatbot" icon={<MessageCircle size={20} />} active={location.pathname.includes('/chatbot')}>
            AI Assistant
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <LogOut size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<CandidateHome />} />
          <Route path="/jobs" element={<JobBrowse />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/chatbot" element={<ChatbotView />} />
        </Routes>
      </div>
    </div>
  );
}

function NavLink({ to, icon, children, active }: any) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
        active
          ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function CandidateHome() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Career Portal</h1>
      <p className="text-gray-600 mb-8">Find your dream job with our AI-powered platform</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/candidate/jobs" className="card hover:shadow-lg transition-shadow">
          <Briefcase className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Browse Jobs</h2>
          <p className="text-gray-600">Explore available positions and find your perfect match</p>
        </Link>

        <Link to="/candidate/chatbot" className="card hover:shadow-lg transition-shadow">
          <MessageCircle className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">AI Assistant</h2>
          <p className="text-gray-600">Chat with our AI to get personalized job recommendations</p>
        </Link>

        <Link to="/candidate/applications" className="card hover:shadow-lg transition-shadow">
          <FileText className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">My Applications</h2>
          <p className="text-gray-600">Track the status of your job applications</p>
        </Link>

        <div className="card bg-purple-50">
          <h3 className="font-bold mb-2">Quick Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Upload your CV for better job matches</li>
            <li>• Complete your profile for priority consideration</li>
            <li>• Check application status regularly</li>
            <li>• Use the AI chatbot for quick assistance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function JobBrowse() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobAPI.getActive();
      setJobs(res.data.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8"><p>Loading jobs...</p></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Browse Open Positions</h1>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                <p className="text-gray-600">{job.department} • {job.location}</p>
                <div className="flex gap-2 mt-2">
                  <span className="badge-primary">{job.employmentType}</span>
                  <span className="badge-gray">{job.experienceLevel}</span>
                </div>
              </div>
              {job.salaryRange && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p className="font-semibold">
                    ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Required Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.required.map((skill) => (
                  <span key={skill} className="badge-primary">{skill}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-primary">Apply Now</button>
              <button className="btn-secondary">Save Job</button>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-600">No active jobs available at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MyApplications() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>
      <div className="card">
        <p className="text-gray-600">Your job applications and their current status would be displayed here.</p>
        <p className="text-sm text-gray-500 mt-2">Apply for jobs to see them tracked here!</p>
      </div>
    </div>
  );
}

function ChatbotView() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI recruitment assistant. I can help you find jobs, answer questions, and guide you through the application process. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm a demo chatbot. In the full version, I would provide intelligent responses and help you with your job search!",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">AI Career Assistant</h1>

      <div className="card flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="input flex-1"
          />
          <button onClick={sendMessage} className="btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidatePortal;
