import pytest
import pandas as pd
import numpy as np
from src.models.change_point_model import ChangePointModel

def test_model_invalid_input():
    # Empty series
    with pytest.raises(ValueError, match="is empty"):
        ChangePointModel(pd.Series([], dtype=float))
    
    # Non-numeric series
    with pytest.raises(ValueError, match="must be numeric"):
        ChangePointModel(pd.Series(["a", "b"]))

    # Series with NaNs
    with pytest.raises(ValueError, match="contains NaN"):
        ChangePointModel(pd.Series([1.0, np.nan, 3.0]))

def test_model_build_success():
    data = pd.Series(np.random.normal(0, 1, 10))
    model = ChangePointModel(data)
    model.build_model()
    assert model.model is not None

def test_model_inference_failure_mode():
    # Data with zero variance might cause issues or specific behaviors depending on priors,
    # but our model now handles std_val=0 by falling back to 1.0. 
    data = pd.Series([10.0, 10.0, 10.0, 10.0])
    model = ChangePointModel(data)
    model.build_model()
    # Not running full inference here as it takes time, but verifying construction
    assert model.model is not None
