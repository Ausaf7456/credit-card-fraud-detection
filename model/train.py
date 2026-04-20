"""
Credit Card Fraud Detection - Model Training
=============================================
Usage:
  python train.py                              # uses dataset/creditcard.csv
  python train.py "C:/path/to/creditcard.csv"  # custom path
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    roc_auc_score, precision_score, recall_score,
    f1_score
)
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import lightgbm as lgb
import shap

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR  = BASE_DIR  # saves into model/

# Accept custom path from CLI arg OR use default
if len(sys.argv) > 1:
    DATA_PATH = sys.argv[1]
else:
    DATA_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'creditcard.csv')


# ── 1. Load ────────────────────────────────────────────────────────────────────
def load_data():
    print(f"\n{'█'*55}")
    print("  FRAUDSHIELD AI — MODEL TRAINING")
    print(f"{'█'*55}")
    print(f"\n[STEP 1] Loading Dataset")
    print(f"  Path : {DATA_PATH}")

    if not os.path.exists(DATA_PATH):
        print(f"\n  ERROR: File not found at:\n  {DATA_PATH}")
        print("\n  Fix: python train.py \"C:/correct/path/creditcard.csv\"")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    print(f"  Rows        : {len(df):,}")
    print(f"  Columns     : {df.shape[1]}")
    print(f"  Fraud cases : {df['Class'].sum():,}  ({df['Class'].mean()*100:.3f}%)")
    print(f"  Missing vals: {df.isnull().sum().sum()}")
    return df


# ── 2. Preprocess ──────────────────────────────────────────────────────────────
def preprocess(df):
    print(f"\n[STEP 2] Preprocessing")
    df = df.copy()
    df.fillna(df.median(numeric_only=True), inplace=True)

    scaler = StandardScaler()
    df['scaled_amount'] = scaler.fit_transform(df[['Amount']])
    df['scaled_time']   = scaler.fit_transform(df[['Time']])
    df.drop(['Time', 'Amount'], axis=1, inplace=True)

    X = df.drop('Class', axis=1)
    y = df['Class']

    print(f"  Features : {X.shape[1]}")
    print(f"  Legit    : {(y==0).sum():,}")
    print(f"  Fraud    : {y.sum():,}")
    return X, y


# ── 3. Train ───────────────────────────────────────────────────────────────────
def train_all(X_train, X_test, y_train, y_test):
    print(f"\n[STEP 3] Applying SMOTE + Training 4 Models")

    sm = SMOTE(random_state=42)
    X_res, y_res = sm.fit_resample(X_train, y_train)
    print(f"  SMOTE done → Fraud: {y_res.sum():,}  Legit: {(y_res==0).sum():,}")

    neg = len(y_train[y_train == 0])
    pos = max(len(y_train[y_train == 1]), 1)

    models = {
        'Logistic Regression': LogisticRegression(
            class_weight='balanced', max_iter=1000, random_state=42),

        'Random Forest': RandomForestClassifier(
            n_estimators=200, class_weight='balanced',
            n_jobs=-1, random_state=42),

        'XGBoost': xgb.XGBClassifier(
            scale_pos_weight=neg / pos,
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            eval_metric='logloss',
            random_state=42,
            n_jobs=-1,
            verbosity=0),

        'LightGBM': lgb.LGBMClassifier(
            class_weight='balanced',
            n_estimators=200,
            learning_rate=0.05,
            num_leaves=63,
            random_state=42,
            n_jobs=-1,
            verbose=-1),
    }

    results = {}
    trained = {}

    for name, clf in models.items():
        print(f"\n  Training {name}...")
        clf.fit(X_res, y_res)

        y_pred  = clf.predict(X_test)
        y_proba = clf.predict_proba(X_test)[:, 1]

        results[name] = {
            'model'    : name,
            'precision': round(precision_score(y_test, y_pred, zero_division=0), 4),
            'recall'   : round(recall_score(y_test, y_pred, zero_division=0), 4),
            'f1'       : round(f1_score(y_test, y_pred, zero_division=0), 4),
            'roc_auc'  : round(roc_auc_score(y_test, y_proba), 4),
        }
        trained[name] = clf

        r = results[name]
        print(f"  Precision={r['precision']}  Recall={r['recall']}  F1={r['f1']}  AUC={r['roc_auc']}")

    return results, trained


# ── 4. Compare ─────────────────────────────────────────────────────────────────
def compare(results):
    print(f"\n[STEP 4] Model Comparison")
    print(f"\n  {'Model':<25} {'Precision':>10} {'Recall':>8} {'F1':>8} {'AUC':>8}")
    print(f"  {'─'*62}")
    best_auc = max(r['roc_auc'] for r in results.values())
    for r in sorted(results.values(), key=lambda x: x['roc_auc'], reverse=True):
        tag = " <-- BEST" if r['roc_auc'] == best_auc else ""
        print(f"  {r['model']:<25} {r['precision']:>10} {r['recall']:>8} {r['f1']:>8} {r['roc_auc']:>8}{tag}")


# ── 5. Save ────────────────────────────────────────────────────────────────────
def save_best(results, trained, X_train, feature_names):
    print(f"\n[STEP 5] Saving Best Model")

    best_name  = max(results, key=lambda k: results[k]['roc_auc'])
    best_model = trained[best_name]
    best_meta  = results[best_name]

    print(f"  Best: {best_name}  (AUC={best_meta['roc_auc']})")

    # Model
    joblib.dump(best_model, os.path.join(OUT_DIR, 'fraud_model.joblib'))
    print(f"  Saved: fraud_model.joblib")

    # Metrics
    with open(os.path.join(OUT_DIR, 'metrics.json'), 'w') as f:
        json.dump({'best': best_meta, 'all': list(results.values())}, f, indent=2)
    print(f"  Saved: metrics.json")

    # Feature names
    with open(os.path.join(OUT_DIR, 'feature_names.json'), 'w') as f:
        json.dump(list(feature_names), f)
    print(f"  Saved: feature_names.json")

    # SHAP explainer
    print(f"  Building SHAP explainer (may take 1-2 min)...")
    try:
        if best_name in ('Random Forest', 'XGBoost', 'LightGBM'):
            explainer = shap.TreeExplainer(best_model)
        else:
            sample    = X_train.iloc[:200]
            explainer = shap.LinearExplainer(best_model, sample)
        joblib.dump(explainer, os.path.join(OUT_DIR, 'shap_explainer.joblib'))
        print(f"  Saved: shap_explainer.joblib")
    except Exception as e:
        print(f"  SHAP skipped: {e}")

    return best_model, best_name


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    df               = load_data()
    X, y             = preprocess(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42)

    print(f"\n  Train size: {X_train.shape}  |  Test size: {X_test.shape}")

    results, trained = train_all(X_train, X_test, y_train, y_test)
    compare(results)
    best_model, best_name = save_best(results, trained, X_train, X.columns)

    print(f"\n{'█'*55}")
    print(f"  TRAINING COMPLETE  —  Best model: {best_name}")
    print(f"{'█'*55}")
    print("\n  Now restart backend to load new model:")
    print("  cd backend && uvicorn main:app --reload\n")


if __name__ == '__main__':
    main()