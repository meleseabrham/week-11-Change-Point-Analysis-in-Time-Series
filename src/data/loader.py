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
        Loads the data from the CSV file.
        Expects columns: 'Date' and 'Price'.
        """
        try:
            logger.info(f"Loading data from {self.file_path}")
            self.data = pd.read_csv(self.file_path)
            
            # Basic validation/cleaning
            if 'Date' in self.data.columns:
                self.data['Date'] = pd.to_datetime(self.data['Date'], format='%d-%b-%y')
                self.data = self.data.sort_values('Date').reset_index(drop=True)
            
            logger.info(f"Successfully loaded {len(self.data)} rows.")
            return self.data
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise

    def get_processed_data(self) -> pd.DataFrame:
        """
        Returns the data, performing any final transformations if needed.
        """
        if self.data is None:
            self.load_data()
        return self.data
