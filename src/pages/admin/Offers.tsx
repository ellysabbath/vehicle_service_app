import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, Modal } from '../../components/UI';

export default function Offers() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', discountPercent: 10, validUntil: '' });
  const offers = db.offers();

  const create = () => {
    const list = db.offers();
    list.push({ id: 'o' + Date.now(), ...form, active: true });
    db.saveOffers(list);
    setOpen(false);
    setTick(t => t + 1);
  };

  const toggle = (id: string) => {
    db.saveOffers(db.offers().map(o => o.id === id ? { ...o, active: !o.active } : o));
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Offers & Discounts" subtitle="Promotional codes"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ New Offer</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map(o => (
          <div key={o.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <p className="font-mono font-bold text-primary-700 text-lg">{o.code}</p>
              <span className={`badge ${o.active ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                {o.active ? 'active' : 'inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{o.description}</p>
            <p className="text-xs text-gray-500 mt-1">Valid until {o.validUntil}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="font-bold text-green-600">{o.discountPercent}% OFF</p>
              <button className="btn-secondary btn-sm" onClick={() => toggle(o.id)}>
                {o.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
        {offers.length === 0 && <div className="card text-center text-gray-500 col-span-full py-8">No offers yet</div>}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Offer">
        <div className="space-y-3">
          <input className="input" placeholder="Code (e.g. SAVE10)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <input className="input" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="input" type="number" placeholder="Discount %" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: +e.target.value })} />
          <input className="input" type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create</button>
        </div>
      </Modal>
    </div>
  );
}