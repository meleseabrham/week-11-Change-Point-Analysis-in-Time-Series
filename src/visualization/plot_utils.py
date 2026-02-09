import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import arviz as az

def plot_price_series(df: pd.DataFrame, title: str = "Brent Oil Prices"):
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=df, x='Date', y='Price')
    plt.title(title)
    plt.xlabel("Date")
    plt.ylabel("Price (USD/Barrel)")
    plt.grid(True)
    plt.show()

def plot_trend(df: pd.DataFrame, window: int = 252):
    plt.figure(figsize=(12, 6))
    plt.plot(df['Date'], df['Price'], label='Raw Price', alpha=0.5)
    plt.plot(df['Date'], df['Price'].rolling(window=window).mean(), label=f'{window}-day Moving Average', color='red')
    plt.title("Brent Oil Price Trend Analysis")
    plt.xlabel("Date")
    plt.ylabel("Price (USD/Barrel)")
    plt.legend()
    plt.grid(True)
    plt.show()

def plot_returns(df: pd.DataFrame):
    plt.figure(figsize=(12, 6))
    plt.plot(df['Date'], df['Price'].pct_change(), label='Daily Returns', color='green')
    plt.title("Brent Oil Daily Returns (Check for Stationarity)")
    plt.xlabel("Date")
    plt.ylabel("Percentage Change")
    plt.grid(True)
    plt.show()

def plot_volatility(df: pd.DataFrame, window: int = 21):
    returns = df['Price'].pct_change()
    volatility = returns.rolling(window=window).std() * (252**0.5)
    plt.figure(figsize=(12, 6))
    plt.plot(df['Date'], volatility, label='Annualized Volatility', color='orange')
    plt.title(f"Brent Oil price Volatility ({window}-day rolling)")
    plt.xlabel("Date")
    plt.ylabel("Annualized Volatility")
    plt.grid(True)
    plt.show()

def plot_changepoint_results(trace, data: pd.Series):
    """
    Plots the posterior distribution of the change point 'tau'
    and the means mu_1, mu_2.
    """
    # Plotting tau
    az.plot_posterior(trace, var_names=["tau"])
    plt.title("Posterior Distribution of Change Point (Index)")
    plt.show()

    # Plotting means
    az.plot_posterior(trace, var_names=["mu_1", "mu_2"])
    plt.show()
