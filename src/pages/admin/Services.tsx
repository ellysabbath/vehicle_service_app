import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, Modal } from '../../components/UI';

export default function Services() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Repair', description: '', basePrice: 50, estimatedHours: 1 });
  const services = db.services();

  const create = () => {
    const list = db.services();
    list.push({ id: 's' + Date.now(), ...form, active: true });
    db.saveServices(list);
    setOpen(false);
    setTick(t => t + 1);
  };

  const toggle = (id: string) => {
    db.saveServices(db.services().map(s => s.id === id ? { ...s, active: !s.active } : s));
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Services & Pricing" subtitle="Define service catalog"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ Add Service</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-gray-500">{s.category}</p>
              </div>
              <span className={`badge ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {s.active ? 'active' : 'inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{s.description}</p>
            <div className="flex items-center justify-between">
              <p className="font-bold">${s.basePrice}</p>
              <button className="btn-secondary btn-sm" onClick={() => toggle(s.id)}>
                {s.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Service">
        <div className="space-y-3">
          <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className="input" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="input" type="number" placeholder="Base Price" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: +e.target.value })} />
          <input className="input" type="number" placeholder="Est. Hours" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: +e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create</button>
        </div>
      </Modal>
    </div>
  );
}