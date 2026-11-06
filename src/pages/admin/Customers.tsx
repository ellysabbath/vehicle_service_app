import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, Modal } from '../../components/UI';

export default function Customers() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const customers = db.customers();

  const create = () => {
    const list = db.customers();
    list.push({ id: 'c' + Date.now(), ...form, createdAt: new Date().toISOString() });
    db.saveCustomers(list);
    setOpen(false);
    setForm({ name: '', email: '', phone: '', address: '' });
    setTick(t => t + 1);
  };

  const remove = (id: string) => {
    if (!confirm('Delete customer?')) return;
    db.saveCustomers(db.customers().filter(c => c.id !== id));
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Customer Management" subtitle="View & manage customers"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ Add Customer</button>} />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Vehicles</th><th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{c.name}</td>
                <td className="py-2">{c.email}</td>
                <td className="py-2">{c.phone}</td>
                <td className="py-2 text-xs">{c.address}</td>
                <td className="py-2">{db.vehicles().filter(v => v.customerId === c.id).length}</td>
                <td className="py-2 text-right">
                  <button className="text-red-600 text-xs hover:underline" onClick={() => remove(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Customer">
        <div className="space-y-3">
          <input className="input" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create</button>
        </div>
      </Modal>
    </div>
  );
}