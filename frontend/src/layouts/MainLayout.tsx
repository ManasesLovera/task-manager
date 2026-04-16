import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === 'Admin';

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Tickets', icon: 'confirmation_number', path: '/tickets' },
    ...(isAdmin ? [
      { label: 'Departments', icon: 'domain', path: '/departments' },
      { label: 'Analytics', icon: 'analytics', path: '/analytics' },
      { label: 'Team', icon: 'group', path: '/team' },
    ] : []),
  ];

  return (
    <div className="bg-background text-on-background font-body antialiased">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 font-manrope text-sm border-r border-slate-200/50 dark:border-slate-800/50 z-50">
        <div className="flex flex-col h-full py-6">
          {/* Brand Header */}
          <div className="px-6 mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl primary-gradient-cta flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard_customize</span>
            </div>
            <div>
              <h1 className="font-black text-indigo-700 dark:text-indigo-400 text-lg leading-tight">Task Manager</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Enterprise Support</p>
            </div>
          </div>

          {/* Primary Nav */}
          <nav className="flex-grow space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 font-semibold scale-95'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Nav */}
          <div className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 pt-6">
            <a className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 mx-4 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200" href="#">
              <span className="material-symbols-outlined">help</span>
              <span>Help Center</span>
            </a>
            <button
              onClick={() => logout()}
              className="w-[calc(100%-32px)] flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 mx-4 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* TopAppBar */}
        <header className="w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-3 flex justify-end items-center shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500">{user?.role}</p>
              </div>
              <img
                alt="User profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDORCz_WSh7ot3RRxh4QbD6-DIay2L_FVIvSa8lihd_JKGNTSzORwBW-FkONu0TwmYJY5UVA6VKq76eTsau0xnpEIUPtGMHrSPGPrvmWKKRCNRmJmrtvasrn0fnkL72tBUYCXD0soZEpX2OUlTgqIrkDAMnrjhqDkci1MvVDrSMyhIJIYY2_e5ZXeoZr93S_JMm045AHbNRyiPRaGHORZIgGmYdyq0B16lszrNHJi69q3rkD53Ol9N2Ry6csE7SQ9ExFK5g1dIkGoeH"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
