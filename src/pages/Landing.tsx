import { Link } from 'react-router-dom';
import {
  Wrench, Shield, Clock, MapPin, Star, CheckCircle, ArrowRight,
  Smartphone, BarChart3, Zap, Phone, Mail, MapPinned
} from 'lucide-react';
import { useState } from 'react';

const features = [
  { icon: Clock, title: 'Real-Time Job Management', desc: 'Technicians receive, accept, and track jobs instantly with full status visibility from request to completion.' },
  { icon: Shield, title: 'Verified Technicians', desc: 'Every technician is certified, rated, and reviewed. Only qualified professionals handle your vehicle.' },
  { icon: MapPin, title: 'On-Site Service', desc: 'We come to you. GPS-powered dispatch sends the nearest available technician to your location.' },
  { icon: CheckCircle, title: 'Detailed Inspections', desc: 'Digital checklists, photo evidence, and transparent reports on every vehicle condition.' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Admin dashboards with live revenue, technician performance, and service insights.' },
  { icon: Zap, title: 'Instant Communication', desc: 'Built-in chat, updates, and notifications keep customers and technicians in sync.' },
];

const services = [
  { name: 'General Service', price: 80, desc: 'Oil change, filters, full checkup', icon: Wrench },
  { name: 'Brake Repair', price: 150, desc: 'Pads, discs, fluid & safety test', icon: Shield },
  { name: 'AC Service', price: 100, desc: 'Gas refill, cleaning & inspection', icon: Zap },
  { name: 'Full Inspection', price: 50, desc: '50-point comprehensive vehicle review', icon: CheckCircle },
];

const stats = [
  { value: '500+', label: 'Jobs Completed' },
  { value: '50+', label: 'Certified Technicians' },
  { value: '4.8', label: 'Average Rating' },
  { value: '24/7', label: 'Support Available' },
];

const steps = [
  { n: '01', title: 'Book a Service', desc: 'Choose your service, add your vehicle, and pick a time slot.' },
  { n: '02', title: 'Get Matched', desc: 'We assign the nearest certified technician to your request.' },
  { n: '03', title: 'Track Live', desc: 'Follow progress, chat, and receive updates in real time.' },
  { n: '04', title: 'Pay & Rate', desc: 'Approve the work, sign digitally, and rate your experience.' },
];

const testimonials = [
  { name: 'Mark Johnson', role: 'BMW Owner', text: 'Booked a brake repair and the technician arrived within an hour. Transparent pricing, photos of the work, and a clean digital report. Excellent.', rating: 5 },
  { name: 'Priya Sharma', role: 'Toyota Owner', text: 'The AC service was done at my office parking. I could watch the progress in the app and got a full report after. Really impressive.', rating: 5 },
  { name: 'David Chen', role: 'Tesla Owner', text: 'Booking full inspections for my fleet is now effortless. The dashboard makes tracking and payments simple.', rating: 5 },
];

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Wrench className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-gray-900">AutoServe Pro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#features" className="hover:text-primary-600">Features</a>
            <a href="#services" className="hover:text-primary-600">Services</a>
            <a href="#how" className="hover:text-primary-600">How It Works</a>
            <a href="#reviews" className="hover:text-primary-600">Reviews</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/tech" className="btn-secondary btn-sm">Tech Panel</Link>
            <Link to="/admin" className="btn-primary btn-sm flex items-center gap-1">
              Admin Panel <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-current" />
              <span className="block w-6 h-0.5 bg-current" />
              <span className="block w-6 h-0.5 bg-current" />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700">Features</a>
            <a href="#services" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700">Services</a>
            <a href="#how" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700">How It Works</a>
            <a href="#reviews" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700">Reviews</a>
            <div className="space-y-2 pt-2">
              <Link to="/tech" className="btn-secondary w-full block text-center">Tech Panel</Link>
              <Link to="/admin" className="btn-primary w-full block text-center">Admin Panel</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold mb-5">
              <Star size={14} className="fill-current" />
              Trusted by 1000+ vehicle owners
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Vehicle Service, <span className="text-primary-600">Simplified.</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              Book certified technicians to your door. Track repairs in real-time, view detailed inspections, and pay securely — all from one app.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tech" className="btn-primary flex items-center gap-2">
                Open Technician Panel <ArrowRight size={16} />
              </Link>
              <Link to="/admin" className="btn-secondary flex items-center gap-2">
                Open Admin Panel
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600" /> No hidden fees</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600" /> Verified pros</div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Today's Job</p>
                  <p className="font-bold text-gray-900">Brake Repair</p>
                </div>
                <span className="badge bg-green-100 text-green-800">In Progress</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">JD</div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">Honda Civic · ABC-1234</p>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span className="text-gray-500">Labor</span><span className="font-medium">$150.00</span>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span className="text-gray-500">Parts</span><span className="font-medium">$80.00</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold">
                  <span>Total</span><span className="text-primary-600">$230.00</span>
                </div>
                <div className="mt-3 bg-primary-50 rounded-lg p-3 flex items-center gap-2 text-primary-700 text-xs">
                  <MapPinned size={14} /> Technician is 2.3 km away · Arriving in 8 min
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Job Completed</p>
                <p className="text-xs text-gray-500">2 min ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl lg:text-4xl font-bold text-primary-400">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary-600 font-semibold text-sm mb-2">FEATURES</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything you need to service vehicles</h2>
            <p className="text-gray-600 mt-3">A complete platform for customers, technicians, and administrators — running on one system.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary-600 font-semibold text-sm mb-2">SERVICES</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Popular services</h2>
            <p className="text-gray-600 mt-3">Transparent pricing. Certified work. Every time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="card text-center">
                  <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} />
                  </div>
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">{s.desc}</p>
                  <p className="text-2xl font-bold text-primary-600">${s.price}</p>
                  <p className="text-xs text-gray-500">starting from</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary-600 font-semibold text-sm mb-2">HOW IT WORKS</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">From booking to payment in 4 steps</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.n} className="relative card border-primary-100">
                <div className="text-5xl font-bold text-primary-100">{s.n}</div>
                <h3 className="font-semibold text-lg mt-2 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR TECHNICIANS CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Are you a certified technician?</h2>
            <p className="text-primary-100 mb-6 text-lg">
              Join our network of professionals. Get jobs routed to you, manage inspections, and track earnings — all from your phone.
            </p>
            <div className="space-y-2 text-sm">
              {['Access to jobs near you', 'Flexible availability', 'Transparent commission', 'Instant earnings tracking'].map(x => (
                <div key={x} className="flex items-center gap-2">
                  <CheckCircle size={18} /> {x}
                </div>
              ))}
            </div>
            <Link to="/tech" className="mt-8 inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50">
              Open Technician Panel <ArrowRight size={16} />
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="font-semibold">Technician App</p>
                <p className="text-xs text-primary-100">Available 24/7</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-white/10 p-3 rounded-lg">
                <span>Today's Earnings</span><span className="font-bold">$340.00</span>
              </div>
              <div className="flex justify-between bg-white/10 p-3 rounded-lg">
                <span>Jobs Completed</span><span className="font-bold">12</span>
              </div>
              <div className="flex justify-between bg-white/10 p-3 rounded-lg">
                <span>Rating</span><span className="font-bold">4.9 ⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-primary-600 font-semibold text-sm mb-2">TESTIMONIALS</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Loved by customers & pros</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div className="flex gap-1 text-yellow-500 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Explore the full platform</h2>
          <p className="text-gray-600 mt-3 text-lg">Every page is open — no login required. Pick a panel to start exploring.</p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/tech" className="btn-primary">Technician Panel</Link>
            <Link to="/admin" className="btn-secondary">Admin Panel</Link>
            <a href="#features" className="btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wrench className="text-white" size={20} />
              </div>
              <span className="font-bold text-white">AutoServe Pro</span>
            </div>
            <p className="text-sm text-gray-400">Certified vehicle service at your doorstep. Track, chat, and pay in one place.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#how" className="hover:text-white">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Panels</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tech" className="hover:text-white">Technician Panel</Link></li>
              <li><Link to="/admin" className="hover:text-white">Admin Panel</Link></li>
              <li><Link to="/admin/settings" className="hover:text-white">CMS &amp; Settings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> +1 (555) 010-2030</li>
              <li className="flex items-center gap-2"><Mail size={14} /> hello@autoservepro.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> 100 Main St, City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AutoServe Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}