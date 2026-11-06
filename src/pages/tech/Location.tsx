import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader } from '../../components/UI';
import { MapPin, Navigation } from 'lucide-react';

export default function Location() {
  const technicians = db.users().filter(u => u.role === 'technician');
  const [techFilter, setTechFilter] = useState<string>('all');

  const profile = techFilter === 'all'
    ? db.technicians()[0]
    : db.technicians().find(t => t.userId === techFilter);

  const inProgress = db.jobs().filter(j => j.status === 'in_progress');
  const activeJobs = techFilter === 'all'
    ? inProgress
    : inProgress.filter(j => j.technicianId === techFilter);

  return (
    <div>
      <PageHeader title="Location & Navigation" subtitle="Navigate to customer locations" />

      {/* Technician filter */}
      <div className="mb-4">
        <label className="label">Technician</label>
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

      <div className="card mb-4">
        <h3 className="font-semibold mb-2">Service Area</h3>
        <p className="text-sm text-gray-700">{profile?.serviceArea || 'Not set'}</p>
        <p className="text-xs text-gray-500 mt-1">
          Radius: {db.settings().serviceRadius} km
        </p>
      </div>

      <div className="card mb-4 bg-primary-50 border-primary-200">
        <div className="flex items-center gap-3">
          <MapPin className="text-primary-700" />
          <div>
            <p className="font-medium">Your current location</p>
            <p className="text-sm text-gray-600">GPS: Enabled</p>
          </div>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Active Jobs</h3>

      {activeJobs.length === 0 ? (
        <div className="card text-center text-gray-500 py-8">No active jobs to navigate</div>
      ) : (
        activeJobs.map(j => {
          const c = db.customers().find(x => x.id === j.customerId);
          const tech = db.users().find(u => u.id === j.technicianId);
          return (
            <div key={j.id} className="card mb-2 flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-medium">{c?.name || 'Unknown customer'}</p>
                <p className="text-sm text-gray-500 truncate">{c?.address || 'No address'}</p>
                <p className="text-xs text-gray-400 mt-0.5">Assigned to: {tech?.name || 'Unassigned'}</p>
              </div>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c?.address || '')}`}
                className="btn-primary btn-sm flex items-center gap-1 shrink-0"
              >
                <Navigation size={14} /> Navigate
              </a>
            </div>
          );
        })
      )}
    </div>
  );
}