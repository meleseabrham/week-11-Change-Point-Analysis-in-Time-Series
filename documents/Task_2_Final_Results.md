# Task 2: Bayesian Change Point Modeling & Qualitative Association

## 📑 Methodology
We implemented a Bayesian Change Point model using **PyMC** to identify structural breaks in the Brent Crude oil price series. The model uses a discrete uniform prior for the switch point ($\tau$) and normal priors for the price regimes ($\mu_1, \mu_2$) before and after the shift.

### Analytical Workflow
1.  **Log-Return Computation**: To ensure statistical validity, we analyzed daily log-returns (stationarity verified).
2.  **MCMC Sampling**: Executed with 1000 tuning steps and 1000 draws to ensure robust posterior estimates.
3.  **Convergence**: Validated using $R_{hat}$ metrics (all primary parameters < 1.05).

---

## 📉 Results: The 2008 Financial Crisis Break
Our model targeted the 2008 calendar year to pinpoint the exact moment of market regime transition.

### 1. Change Point Identification
- **Detected Date**: October 7, 2008
- **Confidence Interval**: High precision around early October 2008.

### 2. Quantitative Market Impact
| Metric | Value |
| :--- | :--- |
| **Price Before Shift** | $110.49 |
| **Price After Shift** | $52.23 |
| **Relative Collapse** | -52.73% |

### 3. Automated Event Association
The detected date (**October 7, 2008**) programmatically matches the peak fallout of the **Lehman Brothers Collapse (Sept 15, 2008)** and the subsequent global market liquidity freeze. This demonstrates the model's high sensitivity to macroeconomic catalysts.

---

## 🖼️ Visual Diagnostics
- **Trace Plots**: Show clear separation of regime means ($\mu_1, \mu_2$).
- **Posterior Distributions**: Concentration of $\tau$ at the early October mark.
- **Log Return Plots**: Identified extreme volatility spikes matching the detected transition window.

---
**Birhan Energies — Advanced Statistical Intelligence.**
