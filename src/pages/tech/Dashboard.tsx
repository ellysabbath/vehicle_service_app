import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../data/store';
import { PageHeader, StatCard, StatusBadge } from '../../components/UI';
import { CheckCircle, Clock, DollarSign, Calendar, Star } from 'lucide-react';

export default function TechDashboard() {
  const technicians = db.users().filter(u => u.role === 'technician');
  const [techFilter, setTechFilter] = useState<string>('all');

  const allJobs = db.jobs();
  const jobs = techFilter === 'all'
    ? allJobs
    : allJobs.filter(j => j.technicianId === techFilter);

  const today = new Date().toDateString();
  const todayJobs = jobs.filter(j => new Date(j.scheduledDate).toDateString() === today);
  const pending = jobs.filter(j => ['requested', 'accepted', 'in_progress'].includes(j.status));
  const completed = jobs.filter(j => ['completed', 'closed'].includes(j.status));
  const earnings = completed.reduce((s, j) => s + (j.totalAmount - j.commission), 0);

  const profile = techFilter === 'all'
    ? db.technicians()[0]
    : db.technicians().find(t => t.userId === techFilter);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of daily work" />

      {/* Technician picker */}
      <div className="mb-4">
        <label className="label">Viewing</label>
        <select
          className="input max-w-xs"
          value={techFilter}
          onChange={e => setTechFilter(e.target.value)}
        >
          <option value="all">All technicians</option>
          {technicians.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Jobs" value={todayJobs.length} icon={Calendar} />
        <StatCard label="Pending" value={pending.length} icon={Clock} color="yellow" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle} color="green" />
        <StatCard label="Earnings" value={`$${earnings.toFixed(2)}`} icon={DollarSign} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {jobs.slice(0, 5).map(job => {
              const c = db.customers().find(x => x.id === job.customerId);
              const v = db.vehicles().find(x => x.id === job.vehicleId);
              const tech = db.users().find(u => u.id === job.technicianId);
              return (
                <Link key={job.id} to={`/tech/jobs/${job.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{job.serviceType}</p>
                    <p className="text-sm text-gray-500">{c?.name} · {v?.make} {v?.model}</p>
                    <p className="text-xs text-gray-400">Tech: {tech?.name || 'Unassigned'}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </Link>
              );
            })}
            {jobs.length === 0 && <p className="text-gray-500 text-sm">No jobs yet.</p>}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-500" /> Performance
          </h3>
          <div className="text-center py-4">
            <p className="text-4xl font-bold">{profile?.rating || 0}</p>
            <p className="text-sm text-gray-500 mt-1">out of 5.0</p>
            <p className="text-xs text-gray-500 mt-3">{profile?.totalJobs || 0} jobs completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}