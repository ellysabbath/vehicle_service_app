import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, StatCard, StatusBadge } from '../../components/UI';
import { DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

export default function Earnings() {
  const [techFilter, setTechFilter] = useState('all');

  const technicians = db.users().filter(u => u.role === 'technician');

  const completedAll = db.jobs().filter(j => ['completed', 'closed'].includes(j.status));
  const completed = techFilter === 'all'
    ? completedAll
    : completedAll.filter(j => j.technicianId === techFilter);

  const total = completed.reduce((s, j) => s + (j.totalAmount - j.commission), 0);
  const pending = completed
    .filter(j => j.paymentStatus !== 'paid')
    .reduce((s, j) => s + (j.totalAmount - j.commission), 0);
  const paid = completed
    .filter(j => j.paymentStatus === 'paid')
    .reduce((s, j) => s + (j.totalAmount - j.commission), 0);

  return (
    <div>
      <PageHeader title="Earnings" subtitle="Track income across all technicians" />

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Earnings" value={`$${total.toFixed(2)}`} icon={DollarSign} color="green" />
        <StatCard label="Pending" value={`$${pending.toFixed(2)}`} icon={TrendingUp} color="yellow" />
        <StatCard label="Paid" value={`$${paid.toFixed(2)}`} icon={CheckCircle} color="purple" />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Earnings History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2">Job</th>
                <th className="pb-2">Technician</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Commission</th>
                <th className="pb-2">Net</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {completed.map(j => {
                const tech = db.users().find(u => u.id === j.technicianId);
                return (
                  <tr key={j.id} className="border-b last:border-0">
                    <td className="py-2">#{j.id}</td>
                    <td className="py-2">{tech?.name || '—'}</td>
                    <td className="py-2">{j.serviceType}</td>
                    <td className="py-2">${j.totalAmount}</td>
                    <td className="py-2">-${j.commission}</td>
                    <td className="py-2 font-medium">${j.totalAmount - j.commission}</td>
                    <td className="py-2"><StatusBadge status={j.paymentStatus} /></td>
                  </tr>
                );
              })}
              {completed.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No earnings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}