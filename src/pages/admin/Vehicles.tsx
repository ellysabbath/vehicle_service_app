import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, Modal } from '../../components/UI';

export default function Vehicles() {
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customerId: '', make: '', model: '', year: 2020, registration: '', vin: '' });
  const vehicles = db.vehicles();
  const customers = db.customers();

  const create = () => {
    const list = db.vehicles();
    list.push({ id: 'v' + Date.now(), ...form, year: Number(form.year) });
    db.saveVehicles(list);
    setOpen(false);
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Vehicle Management" subtitle="Registered vehicles"
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ Add Vehicle</button>} />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Make / Model</th><th>Year</th><th>Reg. No</th><th>VIN</th><th>Owner</th><th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => {
              const owner = customers.find(c => c.id === v.customerId);
              return (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{v.make} {v.model}</td>
                  <td className="py-2">{v.year}</td>
                  <td className="py-2">{v.registration}</td>
                  <td className="py-2 text-xs">{v.vin}</td>
                  <td className="py-2">{owner?.name}</td>
                  <td className="py-2 text-right">
                    <button className="text-red-600 text-xs hover:underline"
                      onClick={() => { if (confirm('Delete?')) { db.saveVehicles(vehicles.filter(x => x.id !== v.id)); setTick(t => t + 1); } }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Vehicle">
        <div className="space-y-3">
          <select className="input" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}>
            <option value="">Select Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="input" placeholder="Make" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} />
          <input className="input" placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
          <input className="input" type="number" placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: +e.target.value })} />
          <input className="input" placeholder="Registration" value={form.registration} onChange={e => setForm({ ...form, registration: e.target.value })} />
          <input className="input" placeholder="VIN (optional)" value={form.vin} onChange={e => setForm({ ...form, vin: e.target.value })} />
          <button className="btn-primary w-full" onClick={create}>Create</button>
        </div>
      </Modal>
    </div>
  );
}