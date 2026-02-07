import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller
from src.data.loader import DataLoader
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

def analyze_properties():
    loader = DataLoader("data/raw/BrentOilPrices.csv")
    df = loader.load_data()
    
    # 1. Trend Analysis
    df['Rolling_Mean'] = df['Price'].rolling(window=252).mean() # 1 year rolling mean
    
    # 2. Stationarity Testing (ADF)
    result = adfuller(df['Price'].dropna())
    logger.info(f"ADF Statistic: {result[0]}")
    logger.info(f"p-value: {result[1]}")
    
    # Since p-value > 0.05, it's non-stationary. Let's check returns.
    df['Returns'] = df['Price'].pct_change().dropna()
    res_returns = adfuller(df['Returns'].dropna())
    logger.info(f"Returns ADF p-value: {res_returns[1]}")
    
    # 3. Volatility Patterns
    df['Volatility'] = df['Returns'].rolling(window=21).std() * np.sqrt(252) # Annualized 1-month volatility
    
    print("--- Time Series Properties ---")
    print(f"ADF Statistic (Price): {result[0]:.4f}")
    print(f"p-value (Price): {result[1]:.4f}")
    print(f"ADF Statistic (Returns): {res_returns[0]:.4f}")
    print(f"p-value (Returns): {res_returns[1]:.4f}")
    print(f"Mean Volatility: {df['Volatility'].mean():.4f}")
    print(f"Max Volatility: {df['Volatility'].max():.4f}")

if __name__ == "__main__":
    analyze_properties()
