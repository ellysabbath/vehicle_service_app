import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, StatusBadge, Modal } from '../../components/UI';

export default function Technicians() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: 'tech123', skills: '', area: '' });
  const users = db.users().filter(u => u.role === 'technician');
  const techs = db.technicians();

  const create = () => {
    const u = db.users();
    const id = 'u_' + Date.now();
    u.push({ id, name: form.name, email: form.email, phone: form.phone, password: form.password, role: 'technician', createdAt: new Date().toISOString() });
    db.saveUsers(u);
    const t = db.technicians();
    t.push({
      id: 't' + Date.now(), userId: id,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: [], availability: 'available', serviceArea: form.area,
      rating: 0, totalJobs: 0, experience: 0
    });
    db.saveTechnicians(t);
    setOpen(false);
    setForm({ name: '', email: '', phone: '', password: 'tech123', skills: '', area: '' });
    setTick(t => t + 1);
  };

  const suspend = (userId: string) => {
    if (!confirm('Delete this technician?')) return;
    db.saveUsers(db.users().filter(u => u.id !== userId));
    db.saveTechnicians(db.technicians().filter(t => t.userId !== userId));
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Technician Management" subtitle="Manage technician accounts"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ Add Technician</button>} />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Name</th><th>Email</th><th>Phone</th>
              <th>Skills</th><th>Area</th><th>Rating</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {techs.map(t => {
              const u = users.find(x => x.id === t.userId);
              if (!u) return null;
              return (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.phone}</td>
                  <td className="py-2 text-xs">{t.skills.join(', ')}</td>
                  <td className="py-2">{t.serviceArea}</td>
                  <td className="py-2">⭐ {t.rating}</td>
                  <td className="py-2"><StatusBadge status={t.availability} /></td>
                  <td className="py-2 text-right">
                    <button className="text-red-600 text-xs hover:underline" onClick={() => suspend(u.id)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Technician">
        <div className="space-y-3">
          <input className="input" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <input className="input" placeholder="Skills (comma separated)" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
          <input className="input" placeholder="Service Area" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create</button>
        </div>
      </Modal>
    </div>
  );
}