import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, BarChart3, LogOut } from 'lucide-react';
import { jobAPI, candidateAPI, applicationAPI, analyticsAPI } from '../services/api';
import type { Job, Candidate, Application, DashboardSummary } from '../types';

function TADashboard() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">TA Specialist</h2>
          <p className="text-sm text-gray-500">Sarah Johnson</p>
        </div>

        <nav className="mt-6">
          <NavLink to="/ta" icon={<LayoutDashboard size={20} />} active={location.pathname === '/ta'}>
            Dashboard
          </NavLink>
          <NavLink to="/ta/jobs" icon={<Briefcase size={20} />} active={location.pathname.includes('/jobs')}>
            Jobs
          </NavLink>
          <NavLink to="/ta/candidates" icon={<Users size={20} />} active={location.pathname.includes('/candidates')}>
            Candidates
          </NavLink>
          <NavLink to="/ta/analytics" icon={<BarChart3 size={20} />} active={location.pathname.includes('/analytics')}>
            Analytics
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
          <Route path="/" element={<TADashboardHome />} />
          <Route path="/jobs" element={<TAJobsView />} />
          <Route path="/candidates" element={<TACandidatesView />} />
          <Route path="/analytics" element={<TAAnalyticsView />} />
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
          ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function TADashboardHome() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryRes, jobsRes, appsRes] = await Promise.all([
        analyticsAPI.getDashboardSummary(),
        jobAPI.getActive(),
        applicationAPI.getAll({ status: 'New' }),
      ]);
      setSummary(summaryRes.data.data);
      setJobs(jobsRes.data.data.slice(0, 5));
      setApplications(appsRes.data.data.slice(0, 10));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">TA Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Jobs" value={summary?.activeJobs || 0} color="blue" />
        <StatCard title="Total Candidates" value={summary?.totalCandidates || 0} color="green" />
        <StatCard title="New Applications" value={summary?.newApplications || 0} color="purple" />
        <StatCard title="Avg Match Score" value={`${summary?.averageMatchScore || 0}%`} color="orange" />
      </div>

      {/* Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Active Jobs</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                <span className="badge-primary mt-2">{job.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Applications */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">New Applications</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Application #{app.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">Match Score: {app.aiMatchScore}%</p>
                  </div>
                  <span className="badge-success">{app.aiMatchDetails.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TAJobsView() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobAPI.getAll();
      setJobs(res.data.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs Management</h1>
        <button className="btn-primary">Create New Job</button>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Department</th>
              <th className="text-left py-3 px-4">Location</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Applications</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">{job.title}</td>
                <td className="py-3 px-4">{job.department}</td>
                <td className="py-3 px-4">{job.location}</td>
                <td className="py-3 px-4">
                  <span className={`badge-${getStatusColor(job.status)}`}>{job.status}</span>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">
                  <button className="text-primary-600 hover:underline text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TACandidatesView() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await candidateAPI.getAll();
      setCandidates(res.data.data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Candidates</h1>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Experience</th>
              <th className="text-left py-3 px-4">Skills</th>
              <th className="text-left py-3 px-4">Source</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">
                  {candidate.firstName} {candidate.lastName}
                </td>
                <td className="py-3 px-4">{candidate.email}</td>
                <td className="py-3 px-4">{candidate.totalExperience} years</td>
                <td className="py-3 px-4">
                  {candidate.skills.slice(0, 3).join(', ')}
                  {candidate.skills.length > 3 && '...'}
                </td>
                <td className="py-3 px-4">{candidate.source}</td>
                <td className="py-3 px-4">
                  <button className="text-primary-600 hover:underline text-sm">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TAAnalyticsView() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics & Insights</h1>
      <div className="card">
        <p className="text-gray-600">Analytics dashboard with charts and metrics would be displayed here.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="card">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Active: 'success',
    Draft: 'gray',
    'On Hold': 'warning',
    Closed: 'danger',
  };
  return map[status] || 'gray';
}

export default TADashboard;
