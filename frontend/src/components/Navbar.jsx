import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Zap, BarChart3, Info, Menu, X } from 'lucide-react';

const links = [
  { to: '/',          label: 'Home',      icon: Shield  },
  { to: '/predict',   label: 'Predict',   icon: Zap     },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/about',     label: 'About',     icon: Info    },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center neon-blue">
            <Shield size={16} className="text-white" />
          </div>
          <span style={{fontFamily:'Syne,sans-serif', fontWeight:700}} className="text-lg">
            <span className="grad-text">FraudShield</span>
            <span className="text-white/50 text-sm font-normal ml-1">AI</span>
          </span>
        </NavLink>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`
              }>
              <Icon size={15} />{label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="live-dot" /> Live
          </span>
          <NavLink to="/predict" className="btn-primary text-sm py-2 px-5">
            Analyze Now
          </NavLink>
        </div>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg glass text-slate-300">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/5 px-6 py-4 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white'}`
              }>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
