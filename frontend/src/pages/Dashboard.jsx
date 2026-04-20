import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Activity, AlertTriangle, Shield, TrendingUp, RefreshCw, Zap } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const COLORS = { Low: '#22c55e', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
const PIE_COLORS = ['#22c55e','#f59e0b','#f97316','#ef4444'];

function StatCard({ icon: Icon, label, value, sub, color = 'cyan' }) {
  const colors = {
    cyan:   'text-cyan-400   bg-cyan-500/10   border-cyan-500/20',
    red:    'text-red-400    bg-red-500/10    border-red-500/20',
    green:  'text-green-400  bg-green-500/10  border-green-500/20',
    amber:  'text-amber-400  bg-amber-500/10  border-amber-500/20',
  };
  const [c, bg, border] = colors[color].split('   ');
  return (
    <div className={`glass rounded-2xl p-6 card-hover border ${border}`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3 border ${border}`}>
        <Icon size={18} className={c} />
      </div>
      <div style={{fontFamily:'Syne,sans-serif'}} className={`text-3xl font-bold ${c} mb-1`}>{value}</div>
      <div className="text-white text-sm font-medium">{label}</div>
      {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats,    setStats]    = useState(null);
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [retraining, setRetraining] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [s, h] = await Promise.all([
        fetch(`${API}/stats`).then(r => r.json()),
        fetch(`${API}/history?limit=20`).then(r => r.json()),
      ]);
      setStats(s);
      setHistory(h.transactions || []);
    } catch {
      setError('Cannot reach backend. Start uvicorn on port 8000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Live feed: refresh every 10s
  useEffect(() => {
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, [fetchData]);

  const retrain = async () => {
    setRetraining(true);
    try {
      await fetch(`${API}/retrain`, { method: 'POST' });
      setTimeout(() => setRetraining(false), 10000);
    } catch { setRetraining(false); }
  };

  if (loading) return (
    <div className="min-h-screen grid-bg pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-cyan-400 font-mono text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen grid-bg pt-24 flex items-center justify-center">
      <div className="glass-red rounded-2xl p-8 text-center max-w-md">
        <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
        <p className="text-red-400 font-semibold mb-2">Backend Offline</p>
        <p className="text-slate-400 text-sm">{error}</p>
        <button onClick={fetchData} className="btn-primary mt-4 text-sm">Retry</button>
      </div>
    </div>
  );

  const riskPie = stats?.risk_distribution
    ? Object.entries(stats.risk_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const locationData = stats?.location_fraud
    ? Object.entries(stats.location_fraud).slice(0,8).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="min-h-screen grid-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-3xl font-bold text-white">
              Fraud <span className="grad-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <span className="live-dot" /> Live monitoring · Auto-refresh every 10s
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="btn-outline text-sm py-2 px-4">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={retrain} disabled={retraining} className="btn-primary text-sm py-2 px-4"
              style={{opacity: retraining ? 0.7 : 1}}>
              <Zap size={14} /> {retraining ? 'Retraining...' : 'Retrain Model'}
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Activity}      color="cyan"  label="Total Transactions" value={stats?.total_transactions?.toLocaleString() || 0} sub="All time" />
          <StatCard icon={AlertTriangle} color="red"   label="Fraud Today"        value={stats?.today_fraud || 0}   sub={`of ${stats?.today_total || 0} today`} />
          <StatCard icon={TrendingUp}    color="amber" label="Fraud Rate"          value={`${stats?.fraud_rate || 0}%`} sub="Overall" />
          <StatCard icon={Shield}        color="green" label="Avg Risk Score"      value={stats?.avg_risk_score || 0} sub="Out of 100" />
        </div>

        {/* Charts row 1 */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          {/* Daily trend - takes 2 cols */}
          <div className="md:col-span-2 glass rounded-2xl p-6">
            <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white mb-4">Daily Fraud Trend (14 days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats?.daily_trend || []}>
                <defs>
                  <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{fill:'#64748b', fontSize:11}} />
                <YAxis tick={{fill:'#64748b', fontSize:11}} />
                <Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155', borderRadius:8}} />
                <Legend />
                <Area type="monotone" dataKey="legitimate" stroke="#0ea5e9" fill="url(#legitGrad)" strokeWidth={2} name="Legitimate" />
                <Area type="monotone" dataKey="fraud"      stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={2} name="Fraud" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk distribution pie */}
          <div className="glass rounded-2xl p-6">
            <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={riskPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {riskPie.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.name] || PIE_COLORS[i % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155', borderRadius:8}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Amount distribution */}
          <div className="glass rounded-2xl p-6">
            <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white mb-4">Transaction Amounts</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.amount_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" tick={{fill:'#64748b', fontSize:11}} />
                <YAxis tick={{fill:'#64748b', fontSize:11}} />
                <Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155', borderRadius:8}} />
                <Bar dataKey="total" fill="#0ea5e9" radius={[4,4,0,0]} name="Total" opacity={0.7} />
                <Bar dataKey="fraud" fill="#ef4444" radius={[4,4,0,0]} name="Fraud" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Location fraud heatmap (bar) */}
          <div className="glass rounded-2xl p-6">
            <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white mb-4">Fraud by Country</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{fill:'#64748b', fontSize:11}} />
                <YAxis dataKey="name" type="category" tick={{fill:'#94a3b8', fontSize:12}} width={30} />
                <Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155', borderRadius:8}} />
                <Bar dataKey="value" radius={[0,4,4,0]} name="Fraud Cases">
                  {locationData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${0 + i * 15}, 80%, 60%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live transaction feed */}
        <div className="glass rounded-2xl p-6">
          <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="live-dot" /> Live Transaction Feed
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-white/5">
                  <th className="text-left pb-3 pr-4">TX ID</th>
                  <th className="text-left pb-3 pr-4">Amount</th>
                  <th className="text-left pb-3 pr-4">Category</th>
                  <th className="text-left pb-3 pr-4">Location</th>
                  <th className="text-left pb-3 pr-4">Device</th>
                  <th className="text-left pb-3 pr-4">Risk</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">{tx.transaction_id}</td>
                    <td className="py-3 pr-4 text-white font-medium">${tx.amount?.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-slate-400 capitalize">{tx.merchant_category}</td>
                    <td className="py-3 pr-4 text-slate-400">{tx.location}</td>
                    <td className="py-3 pr-4 text-slate-400 capitalize">{tx.device_type}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.risk_level === 'Low'      ? 'bg-green-500/10 text-green-400' :
                        tx.risk_level === 'Medium'   ? 'bg-yellow-500/10 text-yellow-400' :
                        tx.risk_level === 'High'     ? 'bg-orange-500/10 text-orange-400' :
                                                       'bg-red-500/10 text-red-400'
                      }`}>{tx.risk_level}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tx.is_fraud ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {tx.is_fraud ? '🚨 Fraud' : '✅ Safe'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
