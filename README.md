# 🛢️ Birhan Energies: Brent Oil Change Point Intelligence

[![Task 1](https://img.shields.io/badge/Task_1-Foundation-emerald)](./documents/Task_1_Final_Report.md)
[![Task 2](https://img.shields.io/badge/Task_2-Bayesian_Modeling-amber)](./documents/Task_2_Modeling_Insights.md)
[![Task 3](https://img.shields.io/badge/Task_3-Dashboard-blue)](./frontend)
[![Tests](https://img.shields.io/badge/Tests-Passing-success)](./tests)

> **Strategic Intelligence for a Volatile Market.**  
> Birhan Energies provides data-driven insights into how global geopolitical and economic shocks reshape oil pricing regimes. This project utilizes Bayesian Change Point Detection to quantify structural breaks in Brent Crude prices from 1987 to 2022.

---

## 📊 Project Overview

This repository contains a full-stack analytical platform designed to detect structural breaks in Brent oil prices. We associate detected price shifts with real-world catalysts like OPEC decisions, regional conflicts, and global economic crises.

### Key Analytical Findings
- **2008 Global Financial Crisis**: Our Bayesian model identified a structural break on **October 8, 2008**, following the Lehman Brothers collapse.
- **Quantified Impact**: The market regime shifted from an average of **$110.47** down to **$52.32**, a probabilistic collapse of **-52.63%**.
- **Stationarity**: While prices exhibit long-term trends, daily percentage returns are highly stationary, making them ideal for regime shift analysis.

---

## 🛠️ Technology Stack

| Domain | Tools |
| :--- | :--- |
| **Statistical Engine** | Python 3.10+, PyMC (Bayesian Inference), Pandas, NumPy |
| **Visualization** | Matplotlib, Seaborn, Recharts |
| **Backend API** | Flask, Flask-CORS |
| **Frontend UI** | React, Vanilla CSS (Premium Glassmorphism), Lucide React |
| **Testing** | Pytest |

---

## 🔌 API Documentation

The Birhan Intelligence Backend exposes a set of RESTful endpoints.

### 1. `GET /api/prices`
Fetches historical Brent Oil prices.
- **Query Parameters**:
  - `start_date` (string, `YYYY-MM-DD`): Filter data starting from this date.
  - `end_date` (string, `YYYY-MM-DD`): Filter data ending at this date.
- **Output**: Array of `{ "Date": "...", "Price": 0.0 }`.

### 2. `GET /api/events`
Returns the researched list of 16 key market catalysts.
- **Output**: Array of `{ "Date": "...", "Event": "...", "Description": "..." }`.

### 3. `GET /api/stats`
Provides high-level summary statistics across the active dataset.
- **Output**: `{ "avg_price": 0.0, "max_price": 0.0, "min_price": 0.0, "total_days": 123 }`.

### 4. `GET /api/analysis`
Provides the latest Bayesian impact report (Automated Task 2 outputs).
- **Output**: `{ "report": "..." }`.

---

## 🚀 Getting Started

### 1. Project Initialization
```bash
# Clone the repository
git clone https://github.com/meleseabrham/week-11-Change-Point-Analysis-in-Time-Series.git
cd week-11-Change-Point-Analysis-in-Time-Series

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Running the Analytical Gateway (Flask)
```bash
cd backend
python app.py
```
*The API will be available at `http://localhost:5000`.*

### 3. Launching the Interactive Portal (React)
```bash
cd frontend
npm install
npm run dev
```
*Open your browser at [http://localhost:5173](http://localhost:5173).*

---

## 📋 Repository Structure

```text
├── .agent/              # AI configuration and workflows
├── backend/             # Flask REST API
├── data/
│   ├── raw/             # Historical Brent prices & Event datasets
│   └── task_2_results/  # Posteriors, summaries, and impact reports
├── documents/           # Final reports and methodology papers
├── frontend/            # React dashboard source
├── notebooks/           # EDA and Bayesian modeling experiments
├── scripts/             # Automated modeling and plot generation
├── src/                 # Core modular code (data loaders, models, utils)
└── tests/               # Pytest suite for robust validation
```

---

## ✨ Features

- **Interactive Timeline**: Scrub through 35 years of price data with high-resolution zooming.
- **Event Highlights**: Click on any "Market Catalyst" to visualize its impact point on the price evolution.
- **Bayesian Insights**: View real-time MCMC quantification of price regime shifts.
- **Robust Validation**: Built-in input sanitization and unit tests for data integrity.

## 👥 Stakeholders
- **Investors**: Risk management and hedging optimization.
- **Policymakers**: Energy security and economic stability planning.
- **Energy Companies**: Operational and supply chain forecasting.

---
**Birhan Energies — Empowering Decisive Energy Leadership.**
