import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, StatusBadge, Modal } from '../../components/UI';

export default function AdminJobs() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerId: '', vehicleId: '', serviceType: '', priority: 'medium', description: '' });
  const jobs = db.jobs();
  const customers = db.customers();
  const vehicles = db.vehicles();
  const technicians = db.users().filter(u => u.role === 'technician');

  const create = () => {
    const list = db.jobs();
    list.push({
      id: 'j' + Date.now(), customerId: form.customerId, vehicleId: form.vehicleId,
      serviceType: form.serviceType, priority: form.priority as any, status: 'requested',
      description: form.description, scheduledDate: new Date().toISOString(),
      createdAt: new Date().toISOString(), laborCharges: 0, partsCost: 0, totalAmount: 0,
      commission: 0, paymentStatus: 'pending', beforePhotos: [], afterPhotos: []
    });
    db.saveJobs(list);
    setOpen(false);
    setTick(t => t + 1);
  };

  const assign = (jobId: string, techId: string) => {
    const list = db.jobs().map(j => j.id === jobId ? { ...j, technicianId: techId } : j);
    db.saveJobs(list);
    setTick(t => t + 1);
  };

  const setStatus = (jobId: string, status: string) => {
    const list = db.jobs().map(j => j.id === jobId ? { ...j, status: status as any } : j);
    db.saveJobs(list);
    setTick(t => t + 1);
  };

  const markPaid = (jobId: string) => {
    const list = db.jobs().map(j => j.id === jobId ? { ...j, paymentStatus: 'paid' as const } : j);
    db.saveJobs(list);
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Job Management" subtitle="Create, assign & monitor jobs"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ New Job</button>} />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">ID</th><th>Service</th><th>Customer</th><th>Vehicle</th>
              <th>Priority</th><th>Assigned</th><th>Status</th><th>Payment</th><th>Amount</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => {
              const c = customers.find(x => x.id === j.customerId);
              const v = vehicles.find(x => x.id === j.vehicleId);
              return (
                <tr key={j.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">#{j.id}</td>
                  <td className="py-2">{j.serviceType}</td>
                  <td className="py-2">{c?.name}</td>
                  <td className="py-2 text-xs">{v?.make} {v?.model}</td>
                  <td className="py-2"><StatusBadge status={j.priority} /></td>
                  <td className="py-2">
                    <select className="text-xs border rounded px-1 py-1" value={j.technicianId || ''}
                      onChange={e => assign(j.id, e.target.value)}>
                      <option value="">Unassigned</option>
                      {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </td>
                  <td className="py-2"><StatusBadge status={j.status} /></td>
                  <td className="py-2">
                    <button onClick={() => markPaid(j.id)} title="Click to mark paid">
                      <StatusBadge status={j.paymentStatus} />
                    </button>
                  </td>
                  <td className="py-2">${j.totalAmount}</td>
                  <td className="py-2">
                    <select className="text-xs border rounded px-1 py-1" value={j.status}
                      onChange={e => setStatus(j.id, e.target.value)}>
                      {['requested', 'accepted', 'in_progress', 'completed', 'closed', 'rejected'].map(s =>
                        <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Job">
        <div className="space-y-3">
          <select className="input" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}>
            <option value="">Select Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input" value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })}>
            <option value="">Select Vehicle</option>
            {vehicles.filter(v => v.customerId === form.customerId).map(v =>
              <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registration})</option>)}
          </select>
          <select className="input" value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })}>
            <option value="">Select Service</option>
            {db.services().map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <textarea className="input" rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create Job</button>
        </div>
      </Modal>
    </div>
  );
}