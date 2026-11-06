import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../data/store';
import { PageHeader, StatusBadge, EmptyState } from '../../components/UI';

export default function TechJobs() {
  const [filter, setFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');

  const technicians = db.users().filter(u => u.role === 'technician');

  const all = db.jobs();
  const byTech = techFilter === 'all' ? all : all.filter(j => j.technicianId === techFilter);
  const jobs = filter === 'all' ? byTech : byTech.filter(j => j.status === filter);

  return (
    <div>
      <PageHeader title="My Jobs" subtitle="Manage assigned jobs" />

      {/* Technician filter */}
      <div className="mb-3">
        <label className="label">Technician</label>
        <select className="input max-w-xs" value={techFilter} onChange={e => setTechFilter(e.target.value)}>
          <option value="all">All technicians</option>
          {technicians.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'requested', 'accepted', 'in_progress', 'completed', 'closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? <EmptyState message="No jobs found" /> : (
        <div className="space-y-3">
          {jobs.map(job => {
            const c = db.customers().find(x => x.id === job.customerId);
            const v = db.vehicles().find(x => x.id === job.vehicleId);
            const tech = db.users().find(u => u.id === job.technicianId);
            return (
              <Link key={job.id} to={`/tech/jobs/${job.id}`} className="card block hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{job.serviceType}</p>
                      <StatusBadge status={job.priority} />
                    </div>
                    <p className="text-sm text-gray-600">{c?.name} · {c?.phone}</p>
                    <p className="text-sm text-gray-500">{v?.make} {v?.model} ({v?.registration})</p>
                    <p className="text-xs text-gray-400 mt-1">Assigned: {tech?.name || 'Unassigned'}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}