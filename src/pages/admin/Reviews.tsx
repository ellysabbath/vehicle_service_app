import { db } from '../../data/store';
import { PageHeader } from '../../components/UI';

export default function Reviews() {
  const jobs = db.jobs().filter(j => j.rating);
  return (
    <div>
      <PageHeader title="Ratings & Reviews" subtitle="Customer feedback" />
      {jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No reviews yet</div>
      ) : (
        <div className="space-y-3">
          {jobs.map(j => {
            const c = db.customers().find(x => x.id === j.customerId);
            const t = db.users().find(u => u.id === j.technicianId);
            return (
              <div key={j.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{c?.name}</p>
                    <p className="text-xs text-gray-500">on {t?.name} · {j.serviceType}</p>
                  </div>
                  <p className="text-yellow-500">⭐ {j.rating}</p>
                </div>
                <p className="text-sm text-gray-700">{j.review}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}