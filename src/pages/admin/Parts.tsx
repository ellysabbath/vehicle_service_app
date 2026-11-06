import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, Modal } from '../../components/UI';

export default function AdminParts() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', partNumber: '', category: 'General', stock: 0, unitPrice: 0, reorderLevel: 5 });
  const parts = db.parts();

  const create = () => {
    const list = db.parts();
    list.push({ id: 'p' + Date.now(), ...form });
    db.saveParts(list);
    setOpen(false);
    setTick(t => t + 1);
  };

  const updateStock = (id: string, delta: number) => {
    db.saveParts(db.parts().map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Spare Parts Inventory" subtitle="Manage stock & pricing"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ Add Part</button>} />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Part</th><th>Number</th><th>Category</th>
              <th>Stock</th><th>Reorder</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{p.name}</td>
                <td className="py-2 font-mono text-xs">{p.partNumber}</td>
                <td className="py-2">{p.category}</td>
                <td className="py-2">
                  <span className={p.stock > p.reorderLevel ? 'text-green-600' : 'text-red-600 font-bold'}>
                    {p.stock}
                  </span>
                </td>
                <td className="py-2">{p.reorderLevel}</td>
                <td className="py-2">${p.unitPrice}</td>
                <td className="py-2 space-x-1">
                  <button className="btn-secondary btn-sm" onClick={() => updateStock(p.id, 1)}>+</button>
                  <button className="btn-secondary btn-sm" onClick={() => updateStock(p.id, -1)}>-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Part">
        <div className="space-y-3">
          <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Part Number" value={form.partNumber} onChange={e => setForm({ ...form, partNumber: e.target.value })} />
          <input className="input" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} />
          <input className="input" type="number" placeholder="Unit Price" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: +e.target.value })} />
          <input className="input" type="number" placeholder="Reorder Level" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: +e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create</button>
        </div>
      </Modal>
    </div>
  );
}