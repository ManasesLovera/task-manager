import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuthStore } from '../../stores/authStore';
import type { AuthResponse } from '../../api/types';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post<AuthResponse>('/Auth/login', {
        email,
        password,
      });

      setAuth(response.user, response.token);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="w-full max-w-md z-10">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center atmospheric-shadow">
              <span className="material-symbols-outlined text-on-primary">task_alt</span>
            </div>
            <span className="font-headline text-2xl font-black tracking-tight text-primary">Indigo Slate</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Welcome back</h1>
          <p className="font-body text-on-surface-variant">Sign in to manage your productivity dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 atmospheric-shadow border border-outline-variant/15 glass-panel">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold text-on-surface-variant flex items-center gap-2" htmlFor="email">
                <span className="material-symbols-outlined text-base">mail</span>
                Email or Username
              </label>
              <input
                className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                id="email"
                name="email"
                placeholder="alex.smith@enterprise.com"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label text-sm font-semibold text-on-surface-variant flex items-center gap-2" htmlFor="password">
                  <span className="material-symbols-outlined text-base">lock</span>
                  Password
                </label>
                <a className="font-label text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" type="button">
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" id="remember" type="checkbox" />
              <label className="ml-2 font-label text-sm text-on-surface-variant cursor-pointer" htmlFor="remember">Remember this device</label>
            </div>

            {/* Sign In Button */}
            <button
              className="w-full btn-primary-gradient py-4 px-6 rounded-xl text-on-primary font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>

          {/* Footer Action */}
          <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              New to TaskManager? 
              <a className="font-semibold text-primary hover:text-primary-container transition-colors ml-1" href="#">Request access</a>
            </p>
          </div>
        </div>

        {/* Trusted by Section */}
        <div className="mt-12 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline font-bold mb-6">Trusted by world-class teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale contrast-125">
            <div className="h-6 w-24 bg-on-surface-variant/20 rounded-sm"></div>
            <div className="h-6 w-20 bg-on-surface-variant/20 rounded-sm"></div>
            <div className="h-6 w-28 bg-on-surface-variant/20 rounded-sm"></div>
          </div>
        </div>
      </section>

      {/* Illustration Column (Hidden on mobile) */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-1/3 aspect-square max-w-[500px]">
        <div className="relative w-full h-full">
          {/* Bento-style Preview Image */}
          <div className="absolute inset-0 bg-surface-container-high rounded-[2rem] overflow-hidden atmospheric-shadow border border-white/40">
            <img
              alt="modern office workspace"
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD94Zb9qswUq1QpeFClz39a4tO1oqKLQyiCfKCDr0bqXjTXKPKxa44o3pThlhvqul-YVKOJad9VVCZr6nrYXoo09ziB1JMUOowOpKY7woa93x43nx3LpniASmIBETPrtK8sR5NIhMPAV0tq4lcxwefF7viFJAwg1nml_9bKkBNXOIs2aUo8V2Png9A3YzsOebRR7mglxyjTndmpQMIB9LFQGO1x4xpka7EUM_9mBIZjPJNVHOWCdvQVmLyA9ihupsGQ9xEH3FAIkZKA"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          </div>
          {/* Floating Detail Card */}
          <div className="absolute -left-12 top-1/4 glass-panel p-6 rounded-2xl atmospheric-shadow border border-white/50 w-64">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></div>
              <span className="font-label text-xs font-bold text-on-surface-variant tracking-widest uppercase">Live Activity</span>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-surface-variant rounded-full"></div>
              <div className="h-2 w-2/3 bg-surface-variant rounded-full"></div>
            </div>
          </div>
          {/* Secondary Floating Detail */}
          <div className="absolute -bottom-6 -right-6 bg-primary-container p-6 rounded-2xl atmospheric-shadow w-48 text-on-primary-container">
            <span className="font-headline text-3xl font-black">99.9%</span>
            <p className="font-label text-xs opacity-80">Uptime Reliability</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginView;
