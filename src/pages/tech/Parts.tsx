import { useState } from 'react';
import { db, uid } from '../../data/store';
import { PageHeader } from '../../components/UI';

export default function TechParts() {
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const parts = db.parts().filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.partNumber.toLowerCase().includes(search.toLowerCase())
  );

  const request = (partId: string) => {
    const n = db.notifications();
    n.push({ id: uid(), userId: 'u_admin', title: 'Part Requested', message: `Part ${partId} requested by technician`, read: false, createdAt: new Date().toISOString() });
    db.saveNotifications(n);
    alert('Request sent to admin');
    setTick(t => t + 1);
  };

  return (
    <div>
      <PageHeader title="Parts Management" subtitle="Check availability & request parts" />
      <input className="input mb-4" placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {parts.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">{p.partNumber}</p>
              </div>
              <span className={`badge ${p.stock > p.reorderLevel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {p.stock} in stock
              </span>
            </div>
            <p className="text-sm text-gray-500">{p.category}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="font-bold">${p.unitPrice}</p>
              <button className="btn-secondary btn-sm" onClick={() => request(p.id)}>Request</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}