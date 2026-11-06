import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, resetDb } from '../data/store';
import {
  LayoutDashboard, Briefcase, User, Package, DollarSign, Users, Car,
  Wrench, Settings, MessageSquare, MapPin, CheckCircle, BarChart3,
  Tag, FileText, RotateCcw, Menu, X, Bell, ChevronRight, Home,
} from 'lucide-react';

type NavItem = { to: string; label: string; icon: any; badge?: 'notifications' };

const TECH_NAV: NavItem[] = [
  { to: '/tech',              label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/tech/jobs',         label: 'Jobs',       icon: Briefcase },
  { to: '/tech/inspection',   label: 'Inspection', icon: CheckCircle },
  { to: '/tech/parts',        label: 'Parts',      icon: Package },
  { to: '/tech/messages',     label: 'Messages',   icon: MessageSquare, badge: 'notifications' },
  { to: '/tech/earnings',     label: 'Earnings',   icon: DollarSign },
  { to: '/tech/location',     label: 'Location',   icon: MapPin },
  { to: '/tech/profile',      label: 'Profile',    icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/admin',              label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/admin/technicians',  label: 'Technicians',       icon: Wrench },
  { to: '/admin/customers',    label: 'Customers',         icon: Users },
  { to: '/admin/vehicles',     label: 'Vehicles',          icon: Car },
  { to: '/admin/jobs',         label: 'Jobs',              icon: Briefcase },
  { to: '/admin/services',     label: 'Services & Pricing',icon: Tag },
  { to: '/admin/parts',        label: 'Spare Parts',       icon: Package },
  { to: '/admin/payments',     label: 'Payments',          icon: DollarSign },
  { to: '/admin/reports',      label: 'Reports',           icon: BarChart3 },
  { to: '/admin/reviews',      label: 'Ratings',           icon: FileText },
  { to: '/admin/offers',       label: 'Offers',            icon: Tag },
  { to: '/admin/settings',     label: 'CMS & Settings',    icon: Settings },
];

function isActive(pathname: string, itemTo: string, isIndex: boolean) {
  return isIndex ? pathname === itemTo : pathname === itemTo || pathname.startsWith(itemTo + '/');
}

function SideLink({ item, active, count, onClick }: {
  item: NavItem; active: boolean; count: number; onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link to={item.to} onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
      }`}>
      <Icon size={18} className="shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge === 'notifications' && count > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
      {active && <ChevronRight size={14} className="text-primary-600" />}
    </Link>
  );
}

function Sidebar({ nav, pathname, notificationCount, onNavigate }: {
  nav: NavItem[]; pathname: string; notificationCount: number; onNavigate?: () => void;
}) {
  const isTech = pathname.startsWith('/tech');
  const label = isTech ? 'Technician Panel' : 'Admin Panel';

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-5 border-b border-gray-200">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
            <Wrench size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">AutoServe Pro</h1>
            <p className="text-[11px] text-gray-500 leading-tight">{label}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {nav.map(item => {
          const isIndex = item.to === '/tech' || item.to === '/admin';
          return (
            <SideLink key={item.to} item={item}
              active={isActive(pathname, item.to, isIndex)}
              count={notificationCount}
              onClick={onNavigate} />
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3 space-y-1">
        <button onClick={() => { if (confirm('Reset all local data?')) resetDb(); }}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <RotateCcw size={16} /> Reset Data
        </button>
        <Link to="/"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <Home size={16} /> Home page
        </Link>
      </div>
    </div>
  );
}

function TopBar({ title, notificationCount, onOpenMobile }: {
  title: string; notificationCount: number; onOpenMobile: () => void;
}) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobile}
          className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h2 className="font-semibold text-gray-900 truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-1">
        <Link to="/" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Home">
          <Home size={18} />
        </Link>
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Notifications">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isTech = location.pathname.startsWith('/tech');
  const nav = isTech ? TECH_NAV : ADMIN_NAV;

  // Badge count from *all* notifications (no per-user concept anymore)
  const notificationCount = useMemo(() => {
    return db.notifications().filter(n => !n.read).length;
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    const match = [...TECH_NAV, ...ADMIN_NAV]
      .sort((a, b) => b.to.length - a.to.length)
      .find(item => {
        const isIndex = item.to === '/tech' || item.to === '/admin';
        return isActive(location.pathname, item.to, isIndex);
      });
    return match?.label || 'AutoServe Pro';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 border-r border-gray-200 z-40">
        <Sidebar nav={nav} pathname={location.pathname} notificationCount={notificationCount} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-xl">
            <div className="relative h-full">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 z-10">
                <X size={18} />
              </button>
              <Sidebar nav={nav} pathname={location.pathname}
                notificationCount={notificationCount}
                onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopBar title={pageTitle} notificationCount={notificationCount}
          onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <footer className="border-t border-gray-200 bg-white px-4 lg:px-6 py-3 text-xs text-gray-500 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} AutoServe Pro</span>
          <span>Preview build · v1.0</span>
        </footer>
      </div>
    </div>
  );
}