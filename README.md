# 🛡️ FraudShield AI — Credit Card Fraud Detection

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0-FF6600?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Enterprise-grade AI fraud detection system with real-time predictions, SHAP explainability, and a premium fintech dashboard.**

[Live Demo](#) · [Report Bug](https://github.com/Ausaf7456/credit-card-fraud-detection/issues) · [Request Feature](https://github.com/Ausaf7456/credit-card-fraud-detection/issues)

</div>

---

## 📸 Screenshots

> Landing Page · Prediction Page · Dashboard · About

---

## ✨ Features

- 🤖 **Real ML Model** — XGBoost & LightGBM trained on 284,807 real transactions
- ⚡ **Real-Time Predictions** — Sub-100ms fraud detection via FastAPI
- 🔍 **Explainable AI** — SHAP values show exactly why a transaction is flagged
- 📊 **Live Dashboard** — Fraud trends, risk distribution, country heatmaps
- 🚨 **Smart Alerts** — Auto email alert when fraud probability exceeds 90%
- ⚖️ **Class Imbalance Handling** — SMOTE + class weights for 0.17% fraud rate
- 🎨 **Premium UI** — Glassmorphism design, dark theme, smooth animations

---

## 🧠 ML Pipeline

```
Raw Data (284,807 tx)
    ↓
Preprocessing (StandardScaler, missing value handling)
    ↓
SMOTE Oversampling (balance 0.17% fraud rate)
    ↓
Train 4 Models:
  ├── Logistic Regression  AUC: 0.9698
  ├── Random Forest        AUC: 0.9716
  ├── XGBoost              AUC: 0.9778  ✅ Best
  └── LightGBM             AUC: 0.9696
    ↓
SHAP TreeExplainer → Feature Importance
    ↓
FastAPI → Real-time predictions
```

---

## 📊 Model Performance

| Model | Precision | Recall | F1 Score | ROC-AUC |
|-------|-----------|--------|----------|---------|
| Logistic Regression | 0.0581 | 0.9184 | 0.1094 | 0.9698 |
| Random Forest | 0.8125 | 0.7959 | 0.8041 | 0.9716 |
| **XGBoost** ✅ | **0.2552** | **0.8776** | **0.3954** | **0.9778** |
| LightGBM | 0.6917 | 0.8469 | 0.7615 | 0.9696 |

---

## 🗂️ Project Structure

```
credit-card-fraud-detection/
├── 📁 frontend/                  # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Hero + features + stats
│   │   │   ├── Predict.jsx       # Transaction form + results
│   │   │   ├── Dashboard.jsx     # Charts + live feed
│   │   │   └── About.jsx         # Model info + tech stack
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   └── utils/api.js
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 backend/                   # FastAPI server
│   ├── main.py                   # All API routes
│   ├── requirements.txt
│   └── transaction_history.json  # Auto-generated
│
├── 📁 model/                     # ML training
│   ├── train.py                  # Training script
│   ├── fraud_model.joblib        # Saved best model
│   ├── shap_explainer.joblib     # SHAP explainer
│   ├── metrics.json              # Model metrics
│   └── feature_names.json
│
├── 📁 dataset/                   # Place creditcard.csv here
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Ausaf7456/credit-card-fraud-detection.git
cd credit-card-fraud-detection
```

### 2. Train the ML Model
```bash
# Download dataset from Kaggle:
# https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud

# Install ML dependencies
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt

# Train model (pass your dataset path)
cd ..
python model/train.py "path/to/creditcard.csv"
```

### 3. Run Backend
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm start
# App running at http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Analyze transaction for fraud |
| `GET` | `/stats` | Dashboard statistics |
| `GET` | `/history` | Transaction history |
| `POST` | `/retrain` | Trigger model retraining |
| `GET` | `/health` | API health check |

### Example Request
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "merchant_category": "travel",
    "location": "NG",
    "device_type": "atm",
    "prev_transactions": 1,
    "avg_spending": 50
  }'
```

### Example Response
```json
{
  "transaction_id": "F8A2C19D",
  "is_fraud": true,
  "fraud_probability": 0.9921,
  "risk_score": 99,
  "risk_level": "Critical",
  "recommendation": "🚨 Block card immediately and alert cardholder.",
  "shap_values": {
    "Amount vs Avg Spending": 0.6,
    "Location Risk": 0.42,
    "Device Type Risk": 0.28
  }
}
```

---

## 💻 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Tailwind CSS 3 | Styling |
| Recharts | Charts & graphs |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|------|---------|
| FastAPI | REST API |
| Pandas / NumPy | Data processing |
| Scikit-learn | ML pipeline |
| XGBoost | Best model |
| LightGBM | Ensemble model |
| SHAP | Explainability |
| Joblib | Model serialization |

---

## 📦 Dataset

- **Source**: [Kaggle — ULB Machine Learning Group](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)
- **Size**: 284,807 transactions
- **Fraud**: 492 cases (0.173%)
- **Features**: V1-V28 (PCA transformed) + Amount + Time
- **Period**: 2 days of European credit card transactions

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Ausaf Ranasariya**

[![GitHub](https://img.shields.io/badge/GitHub-Ausaf7456-181717?style=flat&logo=github)](https://github.com/Ausaf7456)

---

<div align="center">
⭐ Star this repo if you found it helpful!
</div>
