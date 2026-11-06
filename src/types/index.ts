export type Role = 'technician' | 'admin' | 'superadmin' | 'customer';
export type JobStatus = 'requested' | 'accepted' | 'in_progress' | 'completed' | 'closed' | 'rejected';
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Availability = 'available' | 'busy' | 'offline';
export type PaymentStatus = 'pending' | 'processing' | 'paid';

export interface User {
  id: string; name: string; email: string; phone: string;
  password: string; role: Role; createdAt: string;
}
export interface TechnicianProfile {
  id: string; userId: string; skills: string[]; certifications: string[];
  availability: Availability; serviceArea: string; rating: number;
  totalJobs: number; experience: number; bio?: string;
}
export interface Customer {
  id: string; name: string; email: string; phone: string;
  address: string; createdAt: string;
}
export interface Vehicle {
  id: string; customerId: string; make: string; model: string;
  year: number; registration: string; vin?: string;
}
export interface Job {
  id: string; customerId: string; vehicleId: string; technicianId?: string;
  serviceType: string; priority: JobPriority; status: JobStatus;
  description: string; scheduledDate: string; createdAt: string; completedAt?: string;
  laborCharges: number; partsCost: number; totalAmount: number;
  commission: number; paymentStatus: PaymentStatus;
  technicianNotes?: string; customerSignature?: string;
  beforePhotos: string[]; afterPhotos: string[];
  inspectionNotes?: string; recommendations?: string;
  rating?: number; review?: string;
}
export interface Part {
  id: string; name: string; partNumber: string; category: string;
  stock: number; unitPrice: number; reorderLevel: number;
}
export interface JobPart {
  id: string; jobId: string; partId: string; quantity: number;
  unitPrice: number; createdAt: string;
}
export interface Service {
  id: string; name: string; category: string; description: string;
  basePrice: number; estimatedHours: number; active: boolean;
}
export interface ChatMessage {
  id: string; jobId: string; senderId: string; senderName: string;
  message: string; timestamp: string;
}
export interface Notification {
  id: string; userId: string; title: string; message: string;
  read: boolean; createdAt: string;
}
export interface Offer {
  id: string; code: string; description: string; discountPercent: number;
  validUntil: string; active: boolean;
}
export interface Settings {
  commissionRate: number; taxRate: number; serviceRadius: number;
  companyName: string; currency: string;
}