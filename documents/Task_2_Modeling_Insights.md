# Task 2: Bayesian Change Point Modeling & Insight Generation

## 1. Objective of Analysis
The goal of this task was to apply Bayesian inference to detect structural breaks in the Brent oil price series and quantify the impact of significant geopolitical or economic events. By using a Change Point Model, we move beyond simple observation to a probabilistic determination of when and how much the market regime shifted.

## 2. Methodology: Bayesian Change Point Model
We implemented a model using **PyMC** with the following components:
- **Switch Point ($\tau$):** Defined as a discrete uniform prior across the time range, allowing the model to "discover" the most likely break date.
- **Before and After Parameters:** We modeled the mean price ($\mu_1, \mu_2$) before and after the switch point.
- **Likelihood:** A Normal distribution tied the observed daily prices to the switch-based mean, with a Half-Normal prior for the standard deviation ($\sigma$).
- **Inference:** Used MCMC (Markov Chain Monte Carlo) sampling to derive the posterior distributions.

## 3. Results & Quantitative Impact (2008 Crisis Case Study)

Analyzing the high-volatility period of 2008, the model identified a significant structural break:

- **Detected Change Point:** **October 8, 2008**
- **Regime 1 Mean (Before):** **$110.46**
- **Regime 2 Mean (After):** **$52.23**
- **Quantified Impact:** A drastic price collapse of **-52.72%**.

### Visualizations
The posterior distribution for $\tau$ showed a sharp peak around early October 2008, indicating high certainty in the timing of the regime shift. The distributions for $\mu_1$ and $\mu_2$ were entirely non-overlapping, confirming a highly significant statistical change.

*(Note: Visualizations available in `data/task_2_results/`)*

## 4. Association with Causes
The detected change point of **October 8, 2008**, aligns perfectly with the intensification of the **Global Financial Crisis**. Specifically:
- **Sept 15, 2008:** Lehman Brothers bankruptcy.
- **Early Oct 2008:** Global equity markets plummeted, and recession fears led to a massive collapse in projected oil demand.
- **Oct 24, 2008:** OPEC announced an emergency production cut of 1.5 million barrels per day in response to the crashing prices, but the market regime had already structuraly shifted to a lower price environment.

## 5. Conclusions and Future Work
The Bayesian model successfully quantified the "Lehman Shock" on the oil market. 

### Future Advanced Extensions:
- **Markov-Switching Models:** To better define 'calm' vs. 'volatile' regimes across longer periods (35+ years).
- **VAR Modeling:** To analyze the dynamic relationship between oil prices and other macroeconomic variables like the USD exchange rate or global industrial production.
- **Multiple Change Points:** Extending the model to discover multiple $\tau$ points across the entire 1987-2022 dataset to map the full history of market shocks.
