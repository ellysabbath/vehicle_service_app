import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../data/store';
import { PageHeader, StatusBadge, Modal } from '../../components/UI';
import type { Job, JobStatus } from '../../types';

export default function JobDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tick, setTick] = useState(0);
  const [showInspection, setShowInspection] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [notes, setNotes] = useState('');
  const [reco, setReco] = useState('');
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [signature, setSignature] = useState('');

  const job = db.jobs().find(j => j.id === id);
  if (!job) return <div>Job not found</div>;
  const customer = db.customers().find(c => c.id === job.customerId);
  const vehicle = db.vehicles().find(v => v.id === job.vehicleId);

  const update = (patch: Partial<Job>) => {
    const jobs = db.jobs().map(j => j.id === job.id ? { ...j, ...patch } : j);
    db.saveJobs(jobs);
    setTick(t => t + 1);
  };

  const changeStatus = (status: JobStatus) => {
    update({ status, ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}) });
  };

  const saveInspection = () => {
    update({
      inspectionNotes: notes, recommendations: reco,
      beforePhotos: beforeUrl ? [...job.beforePhotos, beforeUrl] : job.beforePhotos,
      status: 'in_progress'
    });
    setShowInspection(false); setNotes(''); setReco(''); setBeforeUrl('');
  };

  const saveCompletion = () => {
    update({
      afterPhotos: afterUrl ? [...job.afterPhotos, afterUrl] : job.afterPhotos,
      customerSignature: signature, status: 'completed',
      completedAt: new Date().toISOString()
    });
    setShowComplete(false); setAfterUrl(''); setSignature('');
  };

  return (
    <div>
      <PageHeader title={job.serviceType} subtitle={`Job #${job.id}`}
        action={<button onClick={() => nav(-1)} className="btn-secondary">← Back</button>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={job.status} />
              <StatusBadge status={job.priority} />
            </div>
            <p className="text-gray-700">{job.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{customer?.name}</p>
                <p className="text-gray-500">{customer?.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Vehicle</p>
                <p className="font-medium">{vehicle?.make} {vehicle?.model}</p>
                <p className="text-gray-500">{vehicle?.registration}</p>
              </div>
            </div>
          </div>

          {job.inspectionNotes && (
            <div className="card">
              <h3 className="font-semibold mb-2">Inspection Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.inspectionNotes}</p>
              {job.recommendations && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-500">Recommendations</p>
                  <p className="text-sm">{job.recommendations}</p>
                </div>
              )}
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {job.status === 'requested' && (
                <>
                  <button onClick={() => changeStatus('accepted')} className="btn-primary">Accept Job</button>
                  <button onClick={() => changeStatus('rejected')} className="btn-danger">Reject</button>
                </>
              )}
              {job.status === 'accepted' && (
                <button onClick={() => setShowInspection(true)} className="btn-primary">Start Inspection</button>
              )}
              {job.status === 'in_progress' && (
                <button onClick={() => setShowComplete(true)} className="btn-success">Complete Job</button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">Pricing</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Labor</span><span>${job.laborCharges}</span></div>
              <div className="flex justify-between"><span>Parts</span><span>${job.partsCost}</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>${job.totalAmount}</span></div>
              <div className="flex justify-between text-gray-500"><span>Commission</span><span>${job.commission}</span></div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Payment</h3>
            <StatusBadge status={job.paymentStatus} />
          </div>
        </div>
      </div>

      <Modal open={showInspection} onClose={() => setShowInspection(false)} title="Vehicle Inspection">
        <div className="space-y-3">
          <div>
            <label className="label">Inspection Notes</label>
            <textarea className="input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div>
            <label className="label">Recommendations</label>
            <textarea className="input" rows={3} value={reco} onChange={e => setReco(e.target.value)} />
          </div>
          <div>
            <label className="label">Before Photo URL</label>
            <input className="input" placeholder="https://..." value={beforeUrl} onChange={e => setBeforeUrl(e.target.value)} />
          </div>
          <button onClick={saveInspection} className="btn-primary w-full">Save & Start Work</button>
        </div>
      </Modal>

      <Modal open={showComplete} onClose={() => setShowComplete(false)} title="Complete Job">
        <div className="space-y-3">
          <div>
            <label className="label">After Photo URL</label>
            <input className="input" placeholder="https://..." value={afterUrl} onChange={e => setAfterUrl(e.target.value)} />
          </div>
          <div>
            <label className="label">Customer Signature (typed name)</label>
            <input className="input" value={signature} onChange={e => setSignature(e.target.value)} />
          </div>
          <button onClick={saveCompletion} className="btn-success w-full">Complete Job</button>
        </div>
      </Modal>
    </div>
  );
}