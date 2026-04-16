import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="bg-background font-body text-on-background min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <main className="flex-grow flex items-center justify-center p-6 bg-login-gradient relative overflow-hidden">
        {/* Decorative Ambient Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl"></div>
        
        <Outlet />
      </main>

      {/* Footer Utility */}
      <footer className="py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low border-t border-outline-variant/10">
        <p className="font-label text-xs text-on-surface-variant">© 2024 Task Manager Enterprise Support. All rights reserved.</p>
        <nav className="flex gap-6">
          <a className="font-label text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
        </nav>
      </footer>
    </div>
  );
};

export default AuthLayout;
