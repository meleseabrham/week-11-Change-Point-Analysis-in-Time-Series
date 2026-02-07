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
