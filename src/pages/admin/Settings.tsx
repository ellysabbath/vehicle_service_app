import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader } from '../../components/UI';

export default function Settings() {
  const [tick, setTick] = useState(0);
  const s = db.settings();
  const [form, setForm] = useState(s);

  const save = () => {
    db.saveSettings(form);
    setTick(t => t + 1);
    alert('Settings saved');
  };

  return (
    <div>
      <PageHeader title="CMS & Settings" subtitle="Global system configuration" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">General</h3>
          <div className="space-y-3">
            <div>
              <label className="label">Company Name</label>
              <input className="input" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div>
              <label className="label">Currency Symbol</label>
              <input className="input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4">Business Rules</h3>
          <div className="space-y-3">
            <div>
              <label className="label">Commission Rate (%)</label>
              <input className="input" type="number" value={form.commissionRate} onChange={e => setForm({ ...form, commissionRate: +e.target.value })} />
            </div>
            <div>
              <label className="label">Tax Rate (%)</label>
              <input className="input" type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: +e.target.value })} />
            </div>
            <div>
              <label className="label">Service Radius (km)</label>
              <input className="input" type="number" value={form.serviceRadius} onChange={e => setForm({ ...form, serviceRadius: +e.target.value })} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button className="btn-primary" onClick={save}>Save Settings</button>
      </div>

      <div className="card mt-6">
        <h3 className="font-semibold mb-3">CMS Pages</h3>
        <div className="space-y-2 text-sm">
          {['About Us', 'Terms & Conditions', 'Privacy Policy', 'Contact', 'FAQs'].map(p => (
            <div key={p} className="flex justify-between items-center py-2 border-b last:border-0">
              <span>{p}</span>
              <button className="text-primary-600 text-xs hover:underline">Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}