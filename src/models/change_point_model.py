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
        self.data = data
        self.model = None
        self.trace = None

    def build_model(self):
        """
        Builds a basic change point model.
        Assumes a switch in mean or variance at some point 'tau'.
        """
        n = len(self.data)
        with pm.Model() as self.model:
            # Prior for the change point index
            tau = pm.DiscreteUniform("tau", lower=0, upper=n - 1)
            
            # Priors for the means before and after the change
            mu_1 = pm.Normal("mu_1", mu=self.data.mean(), sigma=self.data.std())
            mu_2 = pm.Normal("mu_2", mu=self.data.mean(), sigma=self.data.std())
            
            # Switch logic
            idx = np.arange(n)
            mu = pm.math.switch(tau >= idx, mu_1, mu_2)
            
            # Likelihood
            sigma = pm.HalfNormal("sigma", sigma=self.data.std())
            observation = pm.Normal("obs", mu=mu, sigma=sigma, observed=self.data.values)
            
        logger.info("Model built successfully.")

    def run_inference(self, draws=2000, tune=1000):
        """
        Runs MCMC sampling.
        """
        if self.model is None:
            self.build_model()
            
        logger.info(f"Running inference with {draws} draws and {tune} tuning steps...")
        with self.model:
            self.trace = pm.sample(draws=draws, tune=tune, return_inferencedata=True)
        logger.info("Inference completed.")
        return self.trace
