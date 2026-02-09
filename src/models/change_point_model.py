import pymc as pm
import numpy as np
import pandas as pd
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

class ChangePointModel:
    """
    Bayesian Change Point Analysis model using PyMC.
    """
    def __init__(self, data: pd.Series):
        """
        Initializes the model with a time series.

        Args:
            data (pd.Series): A numeric pandas Series (e.g., prices or returns).
        
        Raises:
            ValueError: If data is empty, contains non-numeric values, or has NaNs.
        """
        self._validate_input(data)
        self.data = data
        self.model = None
        self.trace = None

    def _validate_input(self, data: pd.Series):
        if not isinstance(data, pd.Series):
            raise ValueError("Input data must be a pandas Series.")
        if data.empty:
            raise ValueError("Input data series is empty.")
        if not pd.api.types.is_numeric_dtype(data):
            raise ValueError("Input data must be numeric.")
        if data.isnull().any():
            raise ValueError("Input data contains NaN values. Please clean the data before modeling.")

    def build_model(self):
        """
        Builds a basic change point model.
        Assumes a switch in mean or variance at some point 'tau'.

        Failure Modes:
            - Numerical instability if data variance is zero.
            - Memory errors if data series is extremely large.
        """
        try:
            n = len(self.data)
            mean_val = self.data.mean()
            std_val = self.data.std()
            
            if std_val == 0 or np.isnan(std_val):
                std_val = 1.0 # Fallback to avoid division by zero in priors

            with pm.Model() as self.model:
                # Prior for the change point index
                tau = pm.DiscreteUniform("tau", lower=0, upper=n - 1)
                
                # Priors for the means before and after the change
                mu_1 = pm.Normal("mu_1", mu=mean_val, sigma=std_val)
                mu_2 = pm.Normal("mu_2", mu=mean_val, sigma=std_val)
                
                # Switch logic
                idx = np.arange(n)
                mu = pm.math.switch(tau >= idx, mu_1, mu_2)
                
                # Likelihood
                sigma = pm.HalfNormal("sigma", sigma=std_val)
                pm.Normal("obs", mu=mu, sigma=sigma, observed=self.data.values)
                
            logger.info("Model built successfully.")
        except Exception as e:
            logger.error(f"Failed to build PyMC model: {e}")
            raise RuntimeError(f"Model construction failed: {e}")

    def run_inference(self, draws=2000, tune=1000):
        """
        Runs MCMC sampling with error handling.

        Returns:
            arviz.InferenceData: The sampling results.
        """
        if self.model is None:
            self.build_model()
            
        try:
            logger.info(f"Running inference with {draws} draws and {tune} tuning steps...")
            with self.model:
                self.trace = pm.sample(draws=draws, tune=tune, return_inferencedata=True, progressbar=False)
            logger.info("Inference completed.")
            return self.trace
        except Exception as e:
            logger.error(f"Inference failed during sampling: {e}")
            raise RuntimeError(f"MCMC sampling failed: {e}")
