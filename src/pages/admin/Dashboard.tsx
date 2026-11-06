import { Link } from 'react-router-dom';
import { db } from '../../data/store';
import { PageHeader, StatCard, StatusBadge } from '../../components/UI';
import { Briefcase, Users, Wrench, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const jobs = db.jobs();
  const revenue = jobs.filter(j => ['completed', 'closed'].includes(j.status)).reduce((s, j) => s + j.totalAmount, 0);
  const commission = jobs.filter(j => ['completed', 'closed'].includes(j.status)).reduce((s, j) => s + j.commission, 0);

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="System overview" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Jobs" value={jobs.length} icon={Briefcase} />
        <StatCard label="Technicians" value={db.technicians().length} icon={Wrench} color="purple" />
        <StatCard label="Customers" value={db.customers().length} icon={Users} color="green" />
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} icon={DollarSign} color="yellow" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold mb-3">Recent Jobs</h3>
          <div className="space-y-2">
            {jobs.slice(0, 5).map(j => {
              const c = db.customers().find(x => x.id === j.customerId);
              const t = db.users().find(u => u.id === j.technicianId);
              return (
                <Link key={j.id} to={`/admin/jobs`} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{j.serviceType}</p>
                    <p className="text-xs text-gray-500">{c?.name} → {t?.name || 'Unassigned'}</p>
                  </div>
                  <StatusBadge status={j.status} />
                </Link>
              );
            })}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">Commission</h3>
          <p className="text-3xl font-bold text-green-600">${commission.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Platform earnings</p>
          <div className="mt-4 border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Completed</span><span>{jobs.filter(j => j.status === 'completed').length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">In Progress</span><span>{jobs.filter(j => j.status === 'in_progress').length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Pending</span><span>{jobs.filter(j => j.status === 'requested').length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}