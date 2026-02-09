import pandas as pd
from typing import Optional
from src.utils.logger import setup_logger

logger = setup_logger(__name__)

class DataLoader:
    """
    Class to handle the ingestion and basic cleaning of Brent oil price data.
    """
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.data: Optional[pd.DataFrame] = None

    def load_data(self) -> pd.DataFrame:
        """
        Loads the data from the CSV file and validates the schema.
        
        Args:
            None
        
        Returns:
            pd.DataFrame: Validated and cleaned oil price data.
            
        Raises:
            FileNotFoundError: If the file is not found.
            ValueError: If required columns ('Date', 'Price') are missing.
        """
        import os
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"The data file {self.file_path} does not exist.")

        try:
            logger.info(f"Loading data from {self.file_path}")
            self.data = pd.read_csv(self.file_path)
            
            # Schema Validation
            required_cols = {'Date', 'Price'}
            if not required_cols.issubset(self.data.columns):
                missing = required_cols - set(self.data.columns)
                raise ValueError(f"CSV is missing required columns: {missing}")

            # Basic validation/cleaning
            self.data['Date'] = pd.to_datetime(self.data['Date'], errors='coerce')
            self.data['Price'] = pd.to_numeric(self.data['Price'], errors='coerce')
            
            # Remove invalid rows
            initial_count = len(self.data)
            self.data = self.data.dropna(subset=['Date', 'Price'])
            
            if len(self.data) < initial_count:
                logger.warning(f"Dropped {initial_count - len(self.data)} invalid rows.")

            self.data = self.data.sort_values('Date').reset_index(drop=True)
            
            logger.info(f"Successfully loaded {len(self.data)} clean rows.")
            return self.data
        except Exception as e:
            logger.error(f"Error loading or validating data: {e}")
            raise

    def get_processed_data(self) -> pd.DataFrame:
        """
        Returns the data, performing any final transformations if needed.
        """
        if self.data is None:
            self.load_data()
        return self.data
