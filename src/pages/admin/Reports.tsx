import { db } from '../../data/store';
import { PageHeader, StatCard } from '../../components/UI';
import { Briefcase, CheckCircle, DollarSign, Users } from 'lucide-react';

export default function Reports() {
  const jobs = db.jobs();
  const completed = jobs.filter(j => ['completed', 'closed'].includes(j.status));
  const revenue = completed.reduce((s, j) => s + j.totalAmount, 0);
  const techs = db.technicians();
  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Business metrics" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Jobs" value={jobs.length} icon={Briefcase} />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle} color="green" />
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} icon={DollarSign} color="purple" />
        <StatCard label="Active Techs" value={techs.filter(t => t.availability === 'available').length} icon={Users} color="yellow" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-3">Technician Performance</h3>
          <div className="space-y-2">
            {techs.map(t => {
              const u = db.users().find(x => x.id === t.userId);
              const tJobs = jobs.filter(j => j.technicianId === t.userId);
              const done = tJobs.filter(j => ['completed', 'closed'].includes(j.status));
              return (
                <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{u?.name}</p>
                    <p className="text-xs text-gray-500">{tJobs.length} total · {done.length} completed</p>
                  </div>
                  <p className="text-sm font-medium">⭐ {t.rating}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">Job Status Breakdown</h3>
          <div className="space-y-2">
            {['requested', 'accepted', 'in_progress', 'completed', 'closed', 'rejected'].map(s => {
              const count = jobs.filter(j => j.status === s).length;
              const pct = jobs.length ? (count / jobs.length * 100).toFixed(0) : '0';
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{s.replace('_', ' ')}</span>
                    <span className="font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div className="bg-primary-600 h-2 rounded" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}