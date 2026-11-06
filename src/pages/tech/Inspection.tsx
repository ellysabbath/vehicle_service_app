import { db } from '../../data/store';
import { PageHeader } from '../../components/UI';
import { Link } from 'react-router-dom';

const CHECKLIST = [
  'Exterior body condition', 'Tire condition & pressure', 'Lights & signals',
  'Brake system', 'Fluid levels', 'Battery & electrical', 'Engine bay',
  'Suspension', 'Interior condition', 'Safety equipment'
];

export default function Inspection() {
  const jobs = db.jobs().filter(j => ['accepted', 'in_progress'].includes(j.status));

  return (
    <div>
      <PageHeader title="Vehicle Inspection" subtitle="Jobs awaiting or under inspection" />

      {jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No jobs requiring inspection</div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => {
            const v = db.vehicles().find(x => x.id === job.vehicleId);
            const c = db.customers().find(x => x.id === job.customerId);
            return (
              <Link key={job.id} to={`/tech/jobs/${job.id}`} className="card block hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold">{job.serviceType}</p>
                  <span className="badge bg-blue-100 text-blue-800">
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {c?.name || 'Unknown customer'} · {c?.phone || ''}
                </p>
                <p className="text-sm text-gray-500">
                  {v?.make} {v?.model} · {v?.registration}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      <div className="card mt-6">
        <h3 className="font-semibold mb-3">Standard Checklist</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          {CHECKLIST.map(c => <li key={c} className="flex items-center gap-2">✓ {c}</li>)}
        </ul>
      </div>
    </div>
  );
}