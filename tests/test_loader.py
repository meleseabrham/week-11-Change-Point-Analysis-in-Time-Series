import pytest
import pandas as pd
import os
from src.data.loader import DataLoader

def test_loader_file_not_found():
    loader = DataLoader("non_existent_file.csv")
    with pytest.raises(FileNotFoundError):
        loader.load_data()

def test_loader_missing_columns(tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    p = d / "wrong_schema.csv"
    df = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
    df.to_csv(p, index=False)
    
    loader = DataLoader(str(p))
    with pytest.raises(ValueError, match="missing required columns"):
        loader.load_data()

def test_loader_valid_data(tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    p = d / "valid.csv"
    df = pd.DataFrame({
        "Date": ["20-May-87", "21-May-87"],
        "Price": [18.63, 18.45]
    })
    df.to_csv(p, index=False)
    
    loader = DataLoader(str(p))
    data = loader.load_data()
    assert len(data) == 2
    assert pd.api.types.is_datetime64_any_dtype(data['Date'])
    assert pd.api.types.is_numeric_dtype(data['Price'])
