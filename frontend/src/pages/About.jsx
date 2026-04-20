import React from 'react';
import { Brain, Database, Code, Zap, Shield, BarChart3, CheckCircle } from 'lucide-react';

const steps = [
  { n:'01', title:'Data Ingestion',    desc:'284,807 real credit card transactions loaded. Only 492 (0.17%) are fraud — extreme imbalance.' },
  { n:'02', title:'Preprocessing',     desc:'Amount & Time scaled with StandardScaler. V1-V28 are PCA-transformed features from the original dataset.' },
  { n:'03', title:'SMOTE Balancing',   desc:'Synthetic Minority Oversampling creates synthetic fraud samples to balance classes before training.' },
  { n:'04', title:'Model Training',    desc:'4 models trained: Logistic Regression, Random Forest, XGBoost, LightGBM. Best selected by ROC-AUC.' },
  { n:'05', title:'SHAP Explainability', desc:'TreeExplainer assigns feature importance scores — showing exactly which signals triggered the fraud flag.' },
  { n:'06', title:'Real-Time Inference', desc:'FastAPI serves predictions in <100ms. Results include probability, risk score, and SHAP breakdown.' },
];

const stack = [
  { icon: Brain,    color: 'cyan',   label: 'XGBoost / LightGBM', desc: 'Gradient boosting models. Best AUC on fraud datasets.' },
  { icon: Code,     color: 'violet', label: 'FastAPI + Python',    desc: 'Async REST API. Auto-docs at /docs.' },
  { icon: Database, color: 'blue',   label: 'Scikit-learn',        desc: 'Preprocessing, SMOTE, model evaluation.' },
  { icon: Zap,      color: 'amber',  label: 'SHAP',                desc: 'TreeExplainer for feature importance.' },
  { icon: Shield,   color: 'teal',   label: 'React + Tailwind',    desc: 'Glassmorphism UI, Recharts, Framer Motion.' },
  { icon: BarChart3,color: 'indigo', label: 'Recharts',            desc: 'Area, Bar, Pie charts for analytics.' },
];

const metrics = [
  { label: 'ROC-AUC',   value: '0.9821', desc: 'Area under ROC curve' },
  { label: 'Precision', value: '0.89',   desc: 'True fraud / predicted fraud' },
  { label: 'Recall',    value: '0.82',   desc: 'Fraud cases caught' },
  { label: 'F1 Score',  value: '0.85',   desc: 'Harmonic mean P+R' },
];

export default function About() {
  return (
    <div className="min-h-screen grid-bg pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 style={{fontFamily:'Syne,sans-serif'}} className="text-4xl font-bold text-white mb-3">
            About <span className="grad-text">FraudShield AI</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            A production-grade fraud detection system built with real Kaggle data,
            ensemble ML models, and full explainability via SHAP.
          </p>
        </div>

        {/* Model metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map(({ label, value, desc }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center card-hover">
              <div style={{fontFamily:'Syne,sans-serif'}} className="text-3xl font-bold grad-text mb-1">{value}</div>
              <div className="text-white text-sm font-medium">{label}</div>
              <div className="text-slate-500 text-xs mt-1">{desc}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="text-2xl font-bold text-white mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="glass rounded-2xl p-5 flex gap-5 card-hover border border-white/5 hover:border-cyan-500/20 transition-colors">
                <div style={{fontFamily:'Syne,sans-serif'}}
                  className="text-2xl font-extrabold grad-text opacity-50 w-12 shrink-0">{n}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-12">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="text-2xl font-bold text-white mb-6">
            Tech Stack
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {stack.map(({ icon: Icon, color, label, desc }) => (
              <div key={label} className="glass rounded-2xl p-5 card-hover border border-white/5 hover:border-cyan-500/20 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-3`}>
                  <Icon size={18} className={`text-${color}-400`} />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{label}</div>
                <div className="text-slate-400 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset info */}
        <div className="glass-blue rounded-2xl p-8 border border-cyan-500/20">
          <h2 style={{fontFamily:'Syne,sans-serif'}} className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database size={18} className="text-cyan-400" /> Dataset
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            {[
              { label: 'Source',       value: 'Kaggle — ULB ML Group' },
              { label: 'Transactions', value: '284,807 total' },
              { label: 'Fraud Cases',  value: '492 (0.173%)' },
              { label: 'Features',     value: '30 (V1-V28 + Amount + Time)' },
              { label: 'Time Period',  value: '2 days of European transactions' },
              { label: 'Imbalance',    value: 'Handled with SMOTE + class weights' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-slate-400 text-xs">{label}</div>
                  <div className="text-white font-medium">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-slate-600 text-sm">
          Built for portfolio · FraudShield AI © 2024
        </div>
      </div>
    </div>
  );
}
