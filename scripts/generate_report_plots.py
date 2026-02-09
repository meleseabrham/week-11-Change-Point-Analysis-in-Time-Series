import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

# Access project modules
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), '.')))
from src.data.loader import DataLoader

def generate_report_plots():
    os.makedirs("data/visualizations", exist_ok=True)
    loader = DataLoader("data/raw/BrentOilPrices.csv")
    df = loader.load_data()
    
    # 1. Trend Analysis Plot
    plt.figure()
    plt.plot(df['Date'], df['Price'], color='#2c3e50', alpha=0.5, label='Daily Price')
    plt.plot(df['Date'], df['Price'].rolling(window=252).mean(), color='#e74c3c', linewidth=2, label='1-Year Rolling Mean (Trend)')
    plt.title("Brent Oil Price Trend Analysis (1987-2022)", fontsize=14, fontweight='bold')
    plt.xlabel("Year")
    plt.ylabel("Price (USD/Barrel)")
    plt.legend()
    plt.savefig("data/visualizations/trend_analysis.png", dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. Daily Returns Plot (Stationarity check)
    df['Returns'] = df['Price'].pct_change()
    plt.figure()
    plt.plot(df['Date'], df['Returns'], color='#27ae60', linewidth=0.5, alpha=0.7)
    plt.title("Brent Oil Daily Percentage Returns", fontsize=14, fontweight='bold')
    plt.xlabel("Year")
    plt.ylabel("Return")
    plt.savefig("data/visualizations/daily_returns.png", dpi=300, bbox_inches='tight')
    plt.close()
    
    # 3. Volatility Patterns Plot
    volatility = df['Returns'].rolling(window=21).std() * np.sqrt(252)
    plt.figure()
    plt.fill_between(df['Date'], 0, volatility, color='#f39c12', alpha=0.6)
    plt.plot(df['Date'], volatility, color='#d35400', linewidth=1)
    plt.title("Brent Oil Annualized Volatility (21-Day Rolling)", fontsize=14, fontweight='bold')
    plt.xlabel("Year")
    plt.ylabel("Annualized Volatility")
    plt.savefig("data/visualizations/volatility_patterns.png", dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Plots generated and saved to data/visualizations/")

if __name__ == "__main__":
    generate_report_plots()
