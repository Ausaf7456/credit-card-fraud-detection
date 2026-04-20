import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, BarChart3, Brain, AlertTriangle, Globe, ArrowRight, CheckCircle, Activity, Lock } from 'lucide-react';

function Counter({ end, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / 2000, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Brain,         color: 'cyan',   title: 'AI-Powered Detection',  desc: 'XGBoost + LightGBM ensemble trained on 284K real transactions with 99%+ AUC.' },
  { icon: Zap,           color: 'violet', title: 'Real-Time Analysis',    desc: 'Sub-100ms predictions. Analyze any transaction instantly.' },
  { icon: Shield,        color: 'blue',   title: 'Explainable AI (SHAP)', desc: 'See exactly WHY a transaction is flagged with SHAP feature importance.' },
  { icon: BarChart3,     color: 'teal',   title: 'Live Dashboard',        desc: 'Real-time fraud trends, heatmaps, and risk distribution charts.' },
  { icon: AlertTriangle, color: 'amber',  title: 'Smart Alerts',          desc: 'Auto alerts when fraud probability exceeds 90%. Never miss critical cases.' },
  { icon: Globe,         color: 'indigo', title: 'Global Coverage',       desc: 'Location-based risk scoring across 190+ countries.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen grid-bg">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="scan-line" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-cyan-400 mb-8 border border-cyan-500/20">
            <span className="live-dot" />
            AI Model Active · Real-time Monitoring
          </div>

          <h1 style={{fontFamily:'Syne,sans-serif'}} className="font-extrabold text-5xl md:text-7xl leading-tight mb-6">
            <span className="text-white">AI Credit Card</span><br />
            <span className="grad-text">Fraud Detection</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Enterprise-grade machine learning detects fraud in milliseconds.
            SHAP explainability. Real-time monitoring. Built for modern fintech.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/predict" className="btn-primary text-base">
              Analyze Transaction <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn-outline text-base">
              View Dashboard <BarChart3 size={18} />
            </Link>
          </div>

          {/* Floating demo cards */}
          <div className="hidden md:flex justify-center gap-6 mt-16">
            <div className="glass rounded-2xl p-4 w-48 animate-float" style={{animationDelay:'0s'}}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-xs text-green-400 font-mono">SAFE</span>
              </div>
              <div className="text-xs text-slate-400">Amazon · US</div>
              <div className="text-white font-semibold">$147.32</div>
              <div className="text-xs text-slate-500 mt-1">Risk: 3%</div>
            </div>

            <div className="glass-red rounded-2xl p-4 w-52 animate-float" style={{animationDelay:'1s'}}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-xs text-red-400 font-mono">FRAUD DETECTED</span>
              </div>
              <div className="text-xs text-slate-400">Unknown · Nigeria</div>
              <div className="text-white font-semibold">$2,849.00</div>
              <div className="text-xs text-red-400 mt-1">Risk: 97% · Alert sent</div>
            </div>

            <div className="glass rounded-2xl p-4 w-48 animate-float" style={{animationDelay:'0.5s'}}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-cyan-400" />
                <span className="text-xs text-cyan-400 font-mono">MONITORING</span>
              </div>
              <div className="text-xs text-slate-400">Today</div>
              <div className="text-white font-semibold">2,847 tx</div>
              <div className="text-xs text-slate-500 mt-1">17 flagged</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Model AUC',           end: 9821,  suffix: '%', prefix: '0.',  raw: '0.9821' },
            { label: 'Transactions Tested', end: 284807, suffix: '' },
            { label: 'Fraud Cases Found',   end: 492,   suffix: '' },
            { label: 'Detection Speed',     end: 87,    suffix: 'ms', prefix: '<' },
          ].map(({ label, end, suffix, prefix, raw }, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center card-hover">
              <div style={{fontFamily:'Syne,sans-serif'}} className="font-extrabold text-3xl grad-text mb-2">
                {raw ? raw : <Counter end={end} suffix={suffix} prefix={prefix || ''} />}
              </div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-4xl text-white mb-4">
              Why <span className="grad-text">FraudShield AI</span>?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Production-ready fraud detection with cutting-edge ML and full explainability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover border border-white/5 hover:border-cyan-500/20 transition-colors">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-${color}-500/10 border border-${color}-500/20`}>
                  <Icon size={20} className={`text-${color}-400`} />
                </div>
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="glass-blue rounded-3xl p-10 neon-blue">
            <Lock size={40} className="text-cyan-400 mx-auto mb-4" />
            <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-3xl text-white mb-3">
              Ready to detect fraud?
            </h2>
            <p className="text-slate-400 mb-6">Submit any transaction — AI result in under 100ms.</p>
            <Link to="/predict" className="btn-primary text-base">
              Start Analyzing <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center text-slate-600 text-sm">
        FraudShield AI · Built with XGBoost · SHAP · FastAPI · React
      </footer>
    </div>
  );
}
