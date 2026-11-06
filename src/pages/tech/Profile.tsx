import { useState, useEffect } from 'react';
import { db } from '../../data/store';
import { PageHeader, StatusBadge } from '../../components/UI';

export default function Profile() {
  const technicians = db.users().filter(u => u.role === 'technician');
  const [techUserId, setTechUserId] = useState<string>(technicians[0]?.id || '');

  // Derive the profile + user from the current selection
  const tech = db.technicians().find(t => t.userId === techUserId);
  const user = db.users().find(u => u.id === techUserId);

  // Local editable fields (re-sync whenever the selected technician changes)
  const [skills, setSkills] = useState(tech?.skills.join(', ') || '');
  const [certs, setCerts] = useState(tech?.certifications.join(', ') || '');
  const [area, setArea] = useState(tech?.serviceArea || '');
  const [avail, setAvail] = useState(tech?.availability || 'available');

  useEffect(() => {
    setSkills(tech?.skills.join(', ') || '');
    setCerts(tech?.certifications.join(', ') || '');
    setArea(tech?.serviceArea || '');
    setAvail(tech?.availability || 'available');
  }, [techUserId]);

  const save = () => {
    if (!tech) return;
    const list = db.technicians().map(t =>
      t.id === tech.id
        ? {
            ...t,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            certifications: certs.split(',').map(s => s.trim()).filter(Boolean),
            serviceArea: area,
            availability: avail as any,
          }
        : t
    );
    db.saveTechnicians(list);
    alert('Profile updated');
  };

  return (
    <div>
      <PageHeader title="Technician Profile" subtitle="View and edit technician details" />

      {/* Technician picker */}
      <div className="mb-4">
        <label className="label">Technician</label>
        <select
          className="input max-w-xs"
          value={techUserId}
          onChange={e => setTechUserId(e.target.value)}
        >
          {technicians.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {!tech || !user ? (
        <div className="card text-center py-12 text-gray-500">
          No technician profiles found. Reset data from the sidebar to reseed.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
                {user.name.charAt(0)}
              </div>
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
              <div className="mt-3 flex justify-center gap-2">
                <StatusBadge status={avail} />
              </div>
              <div className="mt-4 text-left border-t pt-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-medium">{tech.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jobs</span>
                  <span className="font-medium">{tech.totalJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium">{tech.experience}y</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 card">
            <h3 className="font-semibold mb-3">Edit Details</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Availability</label>
                <select
                  className="input"
                  value={avail}
                  onChange={e => setAvail(e.target.value as any)}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="label">Skills (comma separated)</label>
                <input className="input" value={skills} onChange={e => setSkills(e.target.value)} />
              </div>
              <div>
                <label className="label">Certifications (comma separated)</label>
                <input className="input" value={certs} onChange={e => setCerts(e.target.value)} />
              </div>
              <div>
                <label className="label">Service Area</label>
                <input className="input" value={area} onChange={e => setArea(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={save}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}