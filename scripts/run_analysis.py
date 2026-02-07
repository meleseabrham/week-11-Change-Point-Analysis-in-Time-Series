import os
import sys
import pandas as pd

# Add src to path if running from root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.data.loader import DataLoader
from src.models.change_point_model import ChangePointModel
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

def main():
    # Path to the data file
    data_path = os.path.join("data", "raw", "brent_oil_prices.csv")
    
    if not os.path.exists(data_path):
        logger.error(f"Data file not found at {data_path}. Please place the dataset there.")
        return

    # 1. Load Data
    loader = DataLoader(data_path)
    df = loader.load_data()
    
    # 2. Prepare Data (Example: using a subset for quick testing)
    # Price is our target
    prices = df['Price']
    
    # 3. Model & Inference
    # Note: Running full MCMC on large datasets can be slow.
    # We might want to downsample or use a specific window.
    model = ChangePointModel(prices.iloc[:1000]) # Subset for example
    model.build_model()
    # trace = model.run_inference(draws=1000, tune=500)
    
    logger.info("Analysis setup complete. Use notebooks for interactive exploration.")

if __name__ == "__main__":
    main()
