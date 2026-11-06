import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Shield, HardHat, ArrowRight } from 'lucide-react';

interface Portal {
  role: 'technician' | 'admin' | 'superadmin';
  target: string;
  label: string;
  description: string;
  color: string;
  Icon: any;
}

const PORTALS: Portal[] = [
  {
    role: 'technician',
    target: '/tech',
    label: 'Technician Panel',
    description: 'Jobs, inspections, parts, earnings',
    color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    Icon: Wrench,
  },
  {
    role: 'admin',
    target: '/admin',
    label: 'Admin Panel',
    description: 'Manage technicians, jobs, payments, reports',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    Icon: Shield,
  },
  {
    role: 'superadmin',
    target: '/admin/settings',
    label: 'Super Admin',
    description: 'System settings, CMS, global configuration',
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    Icon: HardHat,
  },
];

export default function Login() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <div className="card">
          {/* Brand */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-3">
              <Wrench className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold">AutoServe Pro</h1>
            <p className="text-sm text-gray-500">Vehicle Service Management</p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-6 text-sm text-primary-800 text-center">
            👋 <strong>Open preview build</strong> — pick a role to explore. No login required.
          </div>

          {/* Portal buttons */}
          <div className="space-y-3">
            {PORTALS.map(p => {
              const Icon = p.Icon;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => nav(p.target)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${p.color}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{p.label}</p>
                    <p className="text-xs opacity-75 leading-tight mt-0.5">{p.description}</p>
                  </div>
                  <ArrowRight size={16} className="opacity-50 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Quick links */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Jump straight to a page</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/tech/jobs" className="btn-secondary btn-sm text-center">Tech Jobs</Link>
              <Link to="/tech/parts" className="btn-secondary btn-sm text-center">Parts</Link>
              <Link to="/admin/jobs" className="btn-secondary btn-sm text-center">Admin Jobs</Link>
              <Link to="/admin/reports" className="btn-secondary btn-sm text-center">Reports</Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link to="/" className="hover:text-primary-600">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}