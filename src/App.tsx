import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';

import TechDashboard from './pages/tech/Dashboard';
import TechJobs from './pages/tech/Jobs';
import JobDetail from './pages/tech/JobDetail';
import Inspection from './pages/tech/Inspection';
import TechParts from './pages/tech/Parts';
import Messages from './pages/tech/Messages';
import Earnings from './pages/tech/Earnings';
import LocationPage from './pages/tech/Location';
import TechProfile from './pages/tech/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import Technicians from './pages/admin/Technicians';
import Customers from './pages/admin/Customers';
import Vehicles from './pages/admin/Vehicles';
import AdminJobs from './pages/admin/Jobs';
import Services from './pages/admin/Services';
import AdminParts from './pages/admin/Parts';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';
import Reviews from './pages/admin/Reviews';
import Offers from './pages/admin/Offers';
import SettingsPage from './pages/admin/Settings';

function Shell({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Technician — always open */}
        <Route path="/tech" element={<Shell><TechDashboard /></Shell>} />
        <Route path="/tech/jobs" element={<Shell><TechJobs /></Shell>} />
        <Route path="/tech/jobs/:id" element={<Shell><JobDetail /></Shell>} />
        <Route path="/tech/inspection" element={<Shell><Inspection /></Shell>} />
        <Route path="/tech/parts" element={<Shell><TechParts /></Shell>} />
        <Route path="/tech/messages" element={<Shell><Messages /></Shell>} />
        <Route path="/tech/earnings" element={<Shell><Earnings /></Shell>} />
        <Route path="/tech/location" element={<Shell><LocationPage /></Shell>} />
        <Route path="/tech/profile" element={<Shell><TechProfile /></Shell>} />

        {/* Admin — always open */}
        <Route path="/admin" element={<Shell><AdminDashboard /></Shell>} />
        <Route path="/admin/technicians" element={<Shell><Technicians /></Shell>} />
        <Route path="/admin/customers" element={<Shell><Customers /></Shell>} />
        <Route path="/admin/vehicles" element={<Shell><Vehicles /></Shell>} />
        <Route path="/admin/jobs" element={<Shell><AdminJobs /></Shell>} />
        <Route path="/admin/services" element={<Shell><Services /></Shell>} />
        <Route path="/admin/parts" element={<Shell><AdminParts /></Shell>} />
        <Route path="/admin/payments" element={<Shell><Payments /></Shell>} />
        <Route path="/admin/reports" element={<Shell><Reports /></Shell>} />
        <Route path="/admin/reviews" element={<Shell><Reviews /></Shell>} />
        <Route path="/admin/offers" element={<Shell><Offers /></Shell>} />
        <Route path="/admin/settings" element={<Shell><SettingsPage /></Shell>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}