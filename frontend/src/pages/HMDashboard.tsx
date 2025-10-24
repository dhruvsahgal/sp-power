import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, LogOut } from 'lucide-react';
import { jobAPI, applicationAPI } from '../services/api';
import type { Job, Application } from '../types';

function HMDashboard() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Hiring Manager</h2>
          <p className="text-sm text-gray-500">John Smith</p>
        </div>

        <nav className="mt-6">
          <NavLink to="/hm" icon={<LayoutDashboard size={20} />} active={location.pathname === '/hm'}>
            Dashboard
          </NavLink>
          <NavLink to="/hm/jobs" icon={<Briefcase size={20} />} active={location.pathname.includes('/jobs')}>
            My Jobs
          </NavLink>
          <NavLink to="/hm/shortlist" icon={<Users size={20} />} active={location.pathname.includes('/shortlist')}>
            Shortlisted
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
          <Route path="/" element={<HMDashboardHome />} />
          <Route path="/jobs" element={<HMJobsView />} />
          <Route path="/shortlist" element={<HMShortlistView />} />
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
          ? 'bg-green-50 text-green-700 border-r-4 border-green-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function HMDashboardHome() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobAPI.getAll({ hiringManagerId: 'user-hm-001' }),
        applicationAPI.getAll({ minMatchScore: 75 }),
      ]);
      setJobs(jobsRes.data.data);
      setApplications(appsRes.data.data.slice(0, 10));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Hiring Manager Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="My Active Jobs" value={jobs.filter(j => j.status === 'Active').length} />
        <StatCard title="Pending Reviews" value={applications.filter(a => a.status === 'Shortlisted').length} />
        <StatCard title="Interviews This Week" value={0} />
      </div>

      {/* AI-Prioritized Candidates */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">AI-Prioritized Candidates (Top Matches)</h2>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Candidate ID: {app.candidateId.slice(0, 12)}</h3>
                  <p className="text-sm text-gray-600">Job ID: {app.jobId.slice(0, 12)}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">{app.aiMatchScore}%</span>
                  <p className="text-xs text-gray-500">Match Score</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Strengths:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {app.aiMatchDetails.strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex gap-2">
                <button className="btn-primary text-sm">View Profile</button>
                <button className="btn-secondary text-sm">Schedule Interview</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HMJobsView() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobAPI.getAll({ hiringManagerId: 'user-hm-001' });
      setJobs(res.data.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Jobs</h1>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{job.title}</h2>
                <p className="text-gray-600">{job.department} • {job.location}</p>
              </div>
              <span className={`badge-${job.status === 'Active' ? 'success' : 'gray'}`}>
                {job.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interviewed</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offered</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>

            <button className="btn-primary">View Candidates</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HMShortlistView() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Shortlisted Candidates</h1>
      <div className="card">
        <p className="text-gray-600">Shortlisted candidates for review would be displayed here.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="card">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-green-600">{value}</p>
    </div>
  );
}

export default HMDashboard;
