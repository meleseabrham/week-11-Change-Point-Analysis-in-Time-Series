# Task 1: Laying the Foundation for Analysis

## 1. Data Analysis Workflow

The analysis of Brent oil prices will follow a structured, multi-phase approach to ensure robust insights and reproducible results.

**Step 1: Data Ingestion and Cleaning**
- Load historical daily Brent oil prices (1987-2022).
- Preprocess dates and handle missing values through interpolation or omission.
- Create secondary metrics: Daily returns, rolling averages, and annualized volatility.

**Step 2: Exploratory Data Analysis (EDA)**
- Visualize long-term trends and identify visible "shocks" in the price series.
- Conduct statistical tests (ADF for stationarity, Hurst exponent for long-term memory).
- Analyze distribution of returns to identify "fat tails" (kurtosis) indicative of extreme events.

**Step 3: Geopolitical Event Integration**
- Overlay compiled event data (Gulf War, 9/11, COVID-19, etc.) on the price chart.
- Identify obvious visual correlations between events and price movements.

**Step 4: Change Point Detection (Modeling)**
- Implement Bayesian Change Point Analysis using **PyMC**.
- Model shifts in the mean and variance of oil prices (or returns).
- Use MCMC sampling to derive posterior distributions for change point dates ($\tau$).

**Step 5: Impact Quantification**
- Compare the "before" and "after" parameters for each detected change point.
- Calculate the magnitude of price shifts and changes in volatility associated with specific events.

**Step 6: Insight Generation & Reporting**
- Synthesize findings into actionable advice for policymakers and investors.
- Finalize visualizations and documentation.

---

## 2. Research: Relevant Geopolitical & Economic Events

| Date | Event | Description |
| :--- | :--- | :--- |
| 1990-08-02 | Iraq Invades Kuwait | Sudden supply disruption leading to price spike. |
| 1991-01-17 | Operation Desert Storm | Military intervention causing market volatility. |
| 1997-07-02 | Asian Financial Crisis | Global demand contraction. |
| 2003-03-20 | Invasion of Iraq | Supply security concerns in the Middle East. |
| 2008-07-11 | GFC Price Peak | All-time high followed by crash. |
| 2011-02-15 | Libyan Civil War | Loss of sweet crude supply. |
| 2014-11-27 | OPEC Non-Cut Decision | Market share war against US Shale. |
| 2020-03-08 | Russia-Saudi Price War | Flood of supply during demand shock. |
| 2020-03-11 | COVID-19 Pandemic | Unprecedented demand collapse. |
| 2022-02-24 | Invasion of Ukraine | Sanctions and energy security crisis. |

*(Full structured dataset available in `data/raw/geopolitical_events.csv`)*

---

## 3. Assumptions and Limitations

### Assumptions
- **Market Efficiency**: Prices reflect all publicly available information, including geopolitical news, although with varying speed.
- **Stationarity of Returns**: While price is non-stationary, the log-returns are assumed to be stationary for modeling purposes.
- **Event Exogeneity**: It is assumed that major geopolitical events are external "shocks" to the oil market rather than being caused by oil price fluctuations.

### Limitations
- **Data Frequency**: Daily data may miss intra-day volatility caused by immediate news breaks.
- **Omitted Variable Bias**: Many factors (interest rates, shipping costs, inventory levels) affect prices simultaneously. Attributing a change solely to one event is an oversimplification.
- **Lagged Effects**: Some events have immediate impacts (shocks), while others (sanctions) have slow, cumulative effects.

### Correlation vs. Causality
Identifying a statistical change point that coincides with a political event provides **correlation in time**. Proving **causality** requires more rigorous evidence, such as:
1.  **Temporal Precedence**: The event must clearly precede the price shift.
2.  **Mechanism**: Explaining *how* the event affected supply or demand.
3.  **Counterfactuals**: Assessing what would have happened without the event.
Our analysis focuses on "associating causes," which strongly suggests causal links but remains statistically descriptive.

---

## 4. Understanding the Model and Data

### Time Series Properties (Analysis Results)
- **Trend**: The data shows clear multi-year cycles (e.g., the 2000s super-cycle) and significant structural breaks.
- **Stationarity**: Augmented Dickey-Fuller (ADF) test confirms price is **non-stationary** (p=0.29), meaning it has a unit root. Returns are **stationary** (p<0.01).
- **Volatility**: Volatility is not constant (Heteroscedasticity). Significant clusters of high volatility occur during crises (2008, 2020).

### Change Point Models Explained
Change point models are statistical methods used to detect when the underlying distribution of a time series changes. In the context of oil prices, they help identify **structural breaks** where the market "regime" shifts—for example, a shift from a low-price/low-volatility regime to a high-price/high-volatility one.

**Expected Outputs:**
- **Tau ($\tau$)**: The estimated date (or index) when the change occurred.
- **Parameter Shifts**: The difference in mean ($\mu$) or standard deviation ($\sigma$) before and after the break.
- **Uncertainty Estimates**: Probability distributions showing how confident we are about the exact date of a change.

---

## 5. Communication Channels
Results will be communicated through:
1.  **Policy Briefs**: Concise summaries for government bodies.
2.  **Interactive Dashboards**: Using tools like Streamlit or Plotly for investors to explore event impacts.
3.  **Technical Reports**: Comprehensive documentation of the Bayesian modeling approach.
4.  **Executive Presentations**: Visual storytelling highlighting key "Black Swan" events.
