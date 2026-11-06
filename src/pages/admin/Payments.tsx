import { db } from '../../data/store';
import { PageHeader, StatusBadge, StatCard } from '../../components/UI';
import { DollarSign, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function Payments() {
  const jobs = db.jobs().filter(j => ['completed', 'closed'].includes(j.status));
  const total = jobs.reduce((s, j) => s + j.totalAmount, 0);
  const commission = jobs.reduce((s, j) => s + j.commission, 0);
  const pending = jobs.filter(j => j.paymentStatus !== 'paid').reduce((s, j) => s + j.totalAmount, 0);
  const paid = jobs.filter(j => j.paymentStatus === 'paid').reduce((s, j) => s + j.totalAmount, 0);

  return (
    <div>
      <PageHeader title="Payments & Commission" subtitle="Track revenue & payouts" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Billed" value={`$${total}`} icon={DollarSign} />
        <StatCard label="Commission" value={`$${commission.toFixed(2)}`} icon={TrendingUp} color="purple" />
        <StatCard label="Pending" value={`$${pending}`} icon={Clock} color="yellow" />
        <StatCard label="Paid" value={`$${paid}`} icon={CheckCircle} color="green" />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Job</th><th>Technician</th><th>Amount</th><th>Commission</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => {
              const t = db.users().find(u => u.id === j.technicianId);
              return (
                <tr key={j.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">#{j.id}</td>
                  <td className="py-2">{t?.name || '—'}</td>
                  <td className="py-2">${j.totalAmount}</td>
                  <td className="py-2">${j.commission}</td>
                  <td className="py-2"><StatusBadge status={j.paymentStatus} /></td>
                </tr>
              );
            })}
            {jobs.length === 0 && <tr><td colSpan={5} className="text-center py-6 text-gray-500">No completed jobs</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}