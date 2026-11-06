import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, ArrowLeft, CheckCircle } from 'lucide-react';
import { db, uid } from '../data/store';
import type { Role } from '../types';

type AccountType = 'customer' | 'technician' | 'admin';

export default function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('customer');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Customer fields
  const [address, setAddress] = useState('');

  // Technician fields
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [experience, setExperience] = useState(0);

  const validateStep1 = () => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) return 'Valid phone is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirm) return 'Passwords do not match';
    const exists = db.users().some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return 'An account with this email already exists';
    return null;
  };

  const next = () => {
    const err = validateStep1();
    if (err) return setError(err);
    setError('');
    setStep(2);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) { setError(err); setStep(1); return; }

    if (accountType === 'technician' && !serviceArea.trim()) {
      return setError('Service area is required for technicians');
    }
    if (accountType === 'customer' && !address.trim()) {
      return setError('Address is required for customers');
    }

    setLoading(true);
    setError('');

    const now = new Date().toISOString();
    const userId = 'u_' + uid();

    try {
      // 1. Create user account
      const users = db.users();
      users.push({
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: accountType as Role,
        createdAt: now
      });
      db.saveUsers(users);

      // 2. Create role-specific profile
      if (accountType === 'technician') {
        const techs = db.technicians();
        techs.push({
          id: 't_' + uid(),
          userId,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          certifications: certifications.split(',').map(s => s.trim()).filter(Boolean),
          availability: 'available',
          serviceArea: serviceArea.trim(),
          rating: 0,
          totalJobs: 0,
          experience: Number(experience) || 0
        });
        db.saveTechnicians(techs);
      } else if (accountType === 'customer') {
        const customers = db.customers();
        customers.push({
          id: 'c_' + uid(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          address: address.trim(),
          createdAt: now
        });
        db.saveCustomers(customers);
      }

      // 3. Auto-login
      const newUser = {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: accountType as Role,
        createdAt: now
      };
      localStorage.setItem('vsm_current_user', JSON.stringify(newUser));

      // 4. Redirect
      if (accountType === 'technician') navigate('/tech');
      else navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
            <ArrowLeft size={18} /> Back to home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Wrench className="text-white" size={20} />
            </div>
            <span className="font-bold">AutoServe Pro</span>
          </div>
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 2 · {accountType === 'customer' ? 'Customer' : accountType === 'technician' ? 'Technician' : 'Admin'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mb-6">
            <div className={`bg-primary-600 h-1.5 rounded-full transition-all ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>

          {/* Account type selector (step 1 only) */}
          {step === 1 && (
            <div className="mb-6">
              <label className="label">I am registering as</label>
              <div className="grid grid-cols-3 gap-2">
                {(['customer', 'technician', 'admin'] as AccountType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAccountType(t)}
                    className={`p-3 rounded-lg border-2 transition-colors text-center ${
                      accountType === t
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="capitalize font-medium text-sm">{t}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 010 2030" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Password</label>
                    <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
                  </div>
                  <div>
                    <label className="label">Confirm Password</label>
                    <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" />
                  </div>
                </div>
                <button type="button" className="btn-primary w-full" onClick={next}>
                  Continue →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {accountType === 'customer' && (
                  <div>
                    <label className="label">Home Address</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Street, city, zip"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send technicians to this address by default.
                    </p>
                  </div>
                )}

                {accountType === 'technician' && (
                  <>
                    <div>
                      <label className="label">Skills (comma separated)</label>
                      <input
                        className="input"
                        value={skills}
                        onChange={e => setSkills(e.target.value)}
                        placeholder="Engine Repair, AC Service, Brakes"
                      />
                    </div>
                    <div>
                      <label className="label">Certifications (comma separated)</label>
                      <input
                        className="input"
                        value={certifications}
                        onChange={e => setCertifications(e.target.value)}
                        placeholder="ASE Certified, EV Specialist"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="label">Service Area</label>
                        <input
                          className="input"
                          value={serviceArea}
                          onChange={e => setServiceArea(e.target.value)}
                          placeholder="Downtown"
                        />
                      </div>
                      <div>
                        <label className="label">Years of Experience</label>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          value={experience}
                          onChange={e => setExperience(+e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {accountType === 'admin' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-1 flex items-center gap-2">
                      <CheckCircle size={16} /> Admin Account
                    </p>
                    <p>
                      Admin accounts have full access to technician, customer, vehicle, job, service,
                      parts, payments, reports, and settings management. Use responsibly.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Creating…' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}