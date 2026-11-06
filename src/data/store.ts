import type {
  User, TechnicianProfile, Customer, Vehicle, Job, Part, JobPart,
  Service, ChatMessage, Notification, Offer, Settings
} from '../types';

const PREFIX = 'vsm_';

const read = <T,>(k: string, fb: T): T => {
  try {
    const r = localStorage.getItem(PREFIX + k);
    return r ? (JSON.parse(r) as T) : fb;
  } catch {
    return fb;
  }
};

const write = <T,>(k: string, v: T) => {
  const key = PREFIX + k;
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch (err) {
    console.warn(`[store] write failed for "${key}" — attempting cleanup`, err);
    // Free space: remove this key first, then retry
    try { localStorage.removeItem(key); } catch {}
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (err2) {
      console.error(`[store] retry failed for "${key}". Data NOT persisted.`, err2);
      // Last resort: clear the largest non-critical keys
      try {
        const sizes = Object.keys(localStorage)
          .filter(k2 => k2.startsWith(PREFIX) && k2 !== key)
          .map(k2 => ({ k2, size: (localStorage.getItem(k2) || '').length }))
          .sort((a, b) => b.size - a.size);
        // delete biggest 2 as a fallback
        sizes.slice(0, 2).forEach(s => localStorage.removeItem(s.k2));
        localStorage.setItem(key, JSON.stringify(v));
      } catch {}
    }
  }
};

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Log how big each vsm_* key is (run once on boot in dev) */
export const logStorageSizes = () => {
  const rows = Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .map(k => ({ key: k, bytes: (localStorage.getItem(k) || '').length }))
    .sort((a, b) => b.bytes - a.bytes);
  console.table(rows.map(r => ({ ...r, kb: (r.bytes / 1024).toFixed(1) })));
  const total = rows.reduce((s, r) => s + r.bytes, 0);
  console.log(`[store] total localStorage usage: ${(total / 1024).toFixed(1)} KB`);
};

const seed = () => {
  if (localStorage.getItem(PREFIX + 'seeded')) return;
  const now = new Date().toISOString();

  const users: User[] = [
    { id: 'u_admin', name: 'Admin User', email: 'admin@vsm.com', phone: '1111111111', password: 'admin123', role: 'admin', createdAt: now },
    { id: 'u_super', name: 'Super Admin', email: 'super@vsm.com', phone: '2222222222', password: 'super123', role: 'superadmin', createdAt: now },
    { id: 'u_tech1', name: 'John Mechanic', email: 'john@vsm.com', phone: '3333333333', password: 'tech123', role: 'technician', createdAt: now },
    { id: 'u_tech2', name: 'Sarah Wrench', email: 'sarah@vsm.com', phone: '4444444444', password: 'tech123', role: 'technician', createdAt: now },
  ];
  write('users', users);

  write('technicians', [
    { id: 't1', userId: 'u_tech1', skills: ['Engine Repair', 'AC Service', 'Brakes'], certifications: ['ASE Certified'], availability: 'available', serviceArea: 'Downtown', rating: 4.7, totalJobs: 24, experience: 5, bio: 'Expert mechanic.' },
    { id: 't2', userId: 'u_tech2', skills: ['Electrical', 'Body Work'], certifications: ['EV Specialist'], availability: 'available', serviceArea: 'Uptown', rating: 4.5, totalJobs: 18, experience: 3, bio: 'EV systems expert.' },
  ] as TechnicianProfile[]);

  write('customers', [
    { id: 'c1', name: 'Alice Cooper', email: 'alice@mail.com', phone: '5551001001', address: '12 Main St', createdAt: now },
    { id: 'c2', name: 'Bob Smith', email: 'bob@mail.com', phone: '5551001002', address: '45 Oak Ave', createdAt: now },
  ] as Customer[]);

  write('vehicles', [
    { id: 'v1', customerId: 'c1', make: 'Toyota', model: 'Camry', year: 2020, registration: 'ABC-1234', vin: 'VIN001' },
    { id: 'v2', customerId: 'c2', make: 'Honda', model: 'Civic', year: 2018, registration: 'XYZ-5678', vin: 'VIN002' },
  ] as Vehicle[]);

  write('services', [
    { id: 's1', name: 'General Service', category: 'Maintenance', description: 'Oil change, filters', basePrice: 80, estimatedHours: 2, active: true },
    { id: 's2', name: 'Brake Repair', category: 'Repair', description: 'Brake pads & discs', basePrice: 150, estimatedHours: 3, active: true },
    { id: 's3', name: 'AC Service', category: 'Repair', description: 'Gas refill & clean', basePrice: 100, estimatedHours: 2, active: true },
    { id: 's4', name: 'Full Inspection', category: 'Inspection', description: 'Comprehensive check', basePrice: 50, estimatedHours: 1, active: true },
  ] as Service[]);

  write('jobs', [
    { id: 'j1', customerId: 'c1', vehicleId: 'v1', technicianId: 'u_tech1', serviceType: 'General Service', priority: 'medium', status: 'requested', description: '10k service', scheduledDate: now, createdAt: now, laborCharges: 80, partsCost: 40, totalAmount: 120, commission: 12, paymentStatus: 'pending', beforePhotos: [], afterPhotos: [] },
    { id: 'j2', customerId: 'c2', vehicleId: 'v2', technicianId: 'u_tech1', serviceType: 'Brake Repair', priority: 'high', status: 'in_progress', description: 'Front brakes squeak', scheduledDate: now, createdAt: now, laborCharges: 150, partsCost: 80, totalAmount: 230, commission: 23, paymentStatus: 'pending', beforePhotos: [], afterPhotos: [] },
  ] as Job[]);

  write('parts', [
    { id: 'p1', name: 'Oil Filter', partNumber: 'OF-100', category: 'Filters', stock: 50, unitPrice: 15, reorderLevel: 10 },
    { id: 'p2', name: 'Brake Pad Set', partNumber: 'BP-200', category: 'Brakes', stock: 20, unitPrice: 40, reorderLevel: 5 },
    { id: 'p3', name: 'AC Gas', partNumber: 'AC-300', category: 'AC', stock: 8, unitPrice: 25, reorderLevel: 10 },
  ] as Part[]);

  write('settings', { commissionRate: 10, taxRate: 5, serviceRadius: 25, companyName: 'AutoServe Pro', currency: '$' } as Settings);
  write('jobParts', [] as JobPart[]);
  write('chats', [] as ChatMessage[]);
  write('notifications', [] as Notification[]);
  write('offers', [] as Offer[]);

  // set flag LAST so a partial seed doesn't lock us into a broken state
  write('seeded', true);
};

seed();

export const db = {
  users: () => read<User[]>('users', []), saveUsers: (v: User[]) => write('users', v),
  technicians: () => read<TechnicianProfile[]>('technicians', []), saveTechnicians: (v: TechnicianProfile[]) => write('technicians', v),
  customers: () => read<Customer[]>('customers', []), saveCustomers: (v: Customer[]) => write('customers', v),
  vehicles: () => read<Vehicle[]>('vehicles', []), saveVehicles: (v: Vehicle[]) => write('vehicles', v),
  jobs: () => read<Job[]>('jobs', []), saveJobs: (v: Job[]) => write('jobs', v),
  parts: () => read<Part[]>('parts', []), saveParts: (v: Part[]) => write('parts', v),
  jobParts: () => read<JobPart[]>('jobParts', []), saveJobParts: (v: JobPart[]) => write('jobParts', v),
  services: () => read<Service[]>('services', []), saveServices: (v: Service[]) => write('services', v),
  chats: () => read<ChatMessage[]>('chats', []), saveChats: (v: ChatMessage[]) => write('chats', v),
  notifications: () => read<Notification[]>('notifications', []), saveNotifications: (v: Notification[]) => write('notifications', v),
  offers: () => read<Offer[]>('offers', []), saveOffers: (v: Offer[]) => write('offers', v),
  settings: () => read<Settings>('settings', { commissionRate: 10, taxRate: 5, serviceRadius: 25, companyName: 'AutoServe Pro', currency: '$' }),
  saveSettings: (v: Settings) => write('settings', v),
};

export const resetDb = () => {
  Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem('vsm_current_user');
  location.reload();
};