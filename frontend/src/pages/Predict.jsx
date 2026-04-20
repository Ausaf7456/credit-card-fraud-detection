import React, { useState } from 'react';
import { Shield, AlertTriangle, Zap, CheckCircle, Info } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const LOCATIONS = ['US','GB','CA','AU','IN','DE','FR','JP','BR','RU','NG','CN','PK','UA'];
const CATEGORIES = ['retail','travel','dining','entertainment','healthcare','utilities','other'];
const DEVICES = ['mobile','desktop','pos','atm'];

// Risk gauge SVG
function RiskGauge({ score }) {
  const pct    = Math.min(score, 100) / 100;
  const angle  = -180 + pct * 180;
  const rad    = (angle * Math.PI) / 180;
  const cx = 100, cy = 100, r = 80;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);
  const color = score < 30 ? '#22c55e' : score < 60 ? '#f59e0b' : score < 90 ? '#f97316' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-48 h-28">
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={color}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${pct * 251.2} 251.2`} opacity="0.8" />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill={color} />
        {/* Labels */}
        <text x="18" y="118" fill="#64748b" fontSize="10">0</text>
        <text x="92" y="28"  fill="#64748b" fontSize="10">50</text>
        <text x="174" y="118" fill="#64748b" fontSize="10">100</text>
      </svg>
      <div className="text-4xl font-bold mt-1" style={{color, fontFamily:'Syne,sans-serif'}}>{score}</div>
      <div className="text-slate-400 text-sm">Risk Score / 100</div>
    </div>
  );
}

export default function Predict() {
  const [form, setForm] = useState({
    amount: '', time: '0', merchant_category: 'retail',
    location: 'US', device_type: 'mobile',
    prev_transactions: '10', avg_spending: '50', email: ''
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.amount || isNaN(form.amount)) {
      setError('Enter a valid transaction amount.'); return;
    }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:            parseFloat(form.amount),
          time:              parseFloat(form.time) || 0,
          merchant_category: form.merchant_category,
          location:          form.location,
          device_type:       form.device_type,
          prev_transactions: parseInt(form.prev_transactions) || 0,
          avg_spending:      parseFloat(form.avg_spending) || 50,
          email:             form.email || null,
        })
      });
      if (!res.ok) throw new Error('API error');
      setResult(await res.json());
    } catch (e) {
      setError('Cannot reach backend. Make sure uvicorn is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const isFraud = result?.is_fraud;

  return (
    <div className="min-h-screen grid-bg pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-4xl font-bold text-white mb-2">
            Transaction <span className="grad-text">Fraud Analyzer</span>
          </h1>
          <p className="text-slate-400">Enter transaction details for instant AI-powered fraud detection.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Form */}
          <div className="glass rounded-3xl p-8">
            <h2 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white text-xl mb-6 flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> Transaction Details
            </h2>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Transaction Amount (USD) *</label>
                <input type="number" placeholder="e.g. 250.00" value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  className="cyber-input" />
              </div>

              {/* Amount + Avg row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Avg Spending ($)</label>
                  <input type="number" placeholder="50" value={form.avg_spending}
                    onChange={e => set('avg_spending', e.target.value)}
                    className="cyber-input" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Prev Transactions</label>
                  <input type="number" placeholder="10" value={form.prev_transactions}
                    onChange={e => set('prev_transactions', e.target.value)}
                    className="cyber-input" />
                </div>
              </div>

              {/* Merchant */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Merchant Category</label>
                <select value={form.merchant_category} onChange={e => set('merchant_category', e.target.value)}
                  className="cyber-input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </div>

              {/* Location + Device */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Location</label>
                  <select value={form.location} onChange={e => set('location', e.target.value)}
                    className="cyber-input">
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Device Type</label>
                  <select value={form.device_type} onChange={e => set('device_type', e.target.value)}
                    className="cyber-input">
                    {DEVICES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Email for Alerts (optional)</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="cyber-input" />
              </div>

              {error && (
                <div className="glass-red rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <button onClick={submit} disabled={loading}
                className="btn-primary w-full justify-center text-base mt-2"
                style={{opacity: loading ? 0.7 : 1}}>
                {loading
                  ? <><span className="spinner w-5 h-5" /> Analyzing...</>
                  : <><Shield size={18} /> Analyze Transaction</>
                }
              </button>
            </div>
          </div>

          {/* Result */}
          <div>
            {!result && !loading && (
              <div className="glass rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center">
                <Shield size={48} className="text-slate-600 mb-4" />
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="text-white text-xl font-semibold mb-2">
                  Awaiting Analysis
                </h3>
                <p className="text-slate-500 text-sm">Fill the form and click Analyze to get instant fraud detection results.</p>
              </div>
            )}

            {loading && (
              <div className="glass rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                <div className="spinner w-12 h-12 mb-4" />
                <p className="text-cyan-400 font-mono text-sm">Running AI inference...</p>
              </div>
            )}

            {result && (
              <div className={`rounded-3xl p-8 ${isFraud ? 'glass-red' : 'glass-green'}`}>

                {/* Verdict */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isFraud ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                    {isFraud
                      ? <AlertTriangle size={28} className="text-red-400" />
                      : <CheckCircle  size={28} className="text-green-400" />}
                  </div>
                  <div>
                    <div style={{fontFamily:'Syne,sans-serif'}}
                      className={`text-2xl font-bold ${isFraud ? 'text-red-400' : 'text-green-400'}`}>
                      {isFraud ? '🚨 FRAUD DETECTED' : '✅ TRANSACTION SAFE'}
                    </div>
                    <div className="text-slate-400 text-sm">TX ID: {result.transaction_id}</div>
                  </div>
                </div>

                {/* Gauge */}
                <div className="glass rounded-2xl p-6 mb-4 flex justify-center">
                  <RiskGauge score={result.risk_score} />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass rounded-xl p-3 text-center">
                    <div className={`text-2xl font-bold ${isFraud ? 'text-red-400':'text-green-400'}`}
                      style={{fontFamily:'Syne,sans-serif'}}>
                      {(result.fraud_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400">Fraud Probability</div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <div className={`text-2xl font-bold ${
                      result.risk_level === 'Low' ? 'text-green-400' :
                      result.risk_level === 'Medium' ? 'text-yellow-400' :
                      result.risk_level === 'High' ? 'text-orange-400' : 'text-red-400'}`}
                      style={{fontFamily:'Syne,sans-serif'}}>
                      {result.risk_level}
                    </div>
                    <div className="text-xs text-slate-400">Risk Level</div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Info size={12} /> Recommendation
                  </div>
                  <p className="text-white text-sm">{result.recommendation}</p>
                </div>

                {/* SHAP */}
                {result.shap_values && (
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-slate-400 mb-3">SHAP Feature Importance</div>
                    <div className="space-y-2">
                      {Object.entries(result.shap_values).map(([k, v]) => {
                        const w = Math.min(Math.abs(v) * 200, 100);
                        return (
                          <div key={k}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300">{k}</span>
                              <span className={v > 0 ? 'text-red-400' : 'text-green-400'}>
                                {v > 0 ? '+' : ''}{v.toFixed(3)}
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${v > 0 ? 'bg-red-400' : 'bg-green-400'}`}
                                style={{width: `${w}%`}} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* High fraud warning popup */}
                {result.fraud_probability > 0.9 && (
                  <div className="mt-4 glass-red rounded-xl p-4 border border-red-500/40 neon-red text-center">
                    <AlertTriangle size={20} className="text-red-400 mx-auto mb-1" />
                    <p className="text-red-400 font-semibold text-sm">🚨 CRITICAL ALERT</p>
                    <p className="text-slate-400 text-xs mt-1">Block card immediately. Fraud probability exceeds 90%.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
