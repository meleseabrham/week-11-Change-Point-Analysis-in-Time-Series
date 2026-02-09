import os
import sys
import pandas as pd
import numpy as np
import pymc as pm
import arviz as az
import matplotlib.pyplot as plt

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), '.')))

from src.data.loader import DataLoader
from src.utils.logger import setup_logger

logger = setup_logger("Task_2_Final")

def run_modeling():
    os.makedirs("data/task_2_results", exist_ok=True)
    
    # 1. Load data
    loader = DataLoader("data/raw/BrentOilPrices.csv")
    df = loader.load_data()
    
    # 2. Focus on the 2008 Financial Crisis period
    mask = (df['Date'] >= '2008-01-01') & (df['Date'] <= '2008-12-31')
    data_subset = df[mask].copy().reset_index(drop=True)
    prices = data_subset['Price'].values
    dates = data_subset['Date'].values
    n = len(prices)
    
    logger.info(f"Starting Bayesian Change Point Modeling on {n} samples (2008)...")
    
    with pm.Model() as model_2008:
        tau = pm.DiscreteUniform("tau", lower=0, upper=n - 1)
        mu_1 = pm.Normal("mu_1", mu=prices.mean(), sigma=prices.std())
        mu_2 = pm.Normal("mu_2", mu=prices.mean(), sigma=prices.std())
        idx = np.arange(n)
        mu = pm.math.switch(tau >= idx, mu_1, mu_2)
        sigma = pm.HalfNormal("sigma", sigma=prices.std())
        pm.Normal("obs", mu=mu, sigma=sigma, observed=prices)
        
        # Metropolis for tau, NUTS for others
        trace = pm.sample(draws=1000, tune=1000, chains=1, return_inferencedata=True, progressbar=False)

    # 3. Save Results
    # Trace Plot
    az.plot_trace(trace)
    plt.savefig("data/task_2_results/trace_plot_2008.png")
    plt.close()
    
    # Tau Posterior
    tau_samples = trace.posterior['tau'].values.flatten()
    most_likely_tau = int(np.median(tau_samples))
    change_date = pd.to_datetime(dates[most_likely_tau])
    
    plt.figure(figsize=(10, 6))
    plt.hist(tau_samples, bins=30, alpha=0.7, color='purple')
    plt.title(f"Posterior Distribution of Change Point (Tau)\nMost Likely Date: {change_date.date()}")
    plt.savefig("data/task_2_results/tau_posterior_2008.png")
    plt.close()

    # Means Posterior
    az.plot_posterior(trace, var_names=["mu_1", "mu_2"])
    plt.savefig("data/task_2_results/means_posterior_2008.png")
    plt.close()

    # Quantify Impact
    summary = az.summary(trace, var_names=["mu_1", "mu_2"])
    mu1_mean = summary.loc['mu_1', 'mean']
    mu2_mean = summary.loc['mu_2', 'mean']
    pct = ((mu2_mean - mu1_mean) / mu1_mean) * 100
    
    report = f"""
    --- Task 2 Quantitative Impact Report ---
    Detected Change Point Date: {change_date.date()}
    Mean Price Before: ${mu1_mean:.2f}
    Mean Price After: ${mu2_mean:.2f}
    Percentage Change: {pct:+.2f}%
    """
    with open("data/task_2_results/impact_report_2008.txt", "w") as f:
        f.write(report)
    print(report)

if __name__ == "__main__":
    run_modeling()
