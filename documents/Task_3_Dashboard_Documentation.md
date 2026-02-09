# 🖼️ Birhan Energies: Dashboard Documentation & Setup

This document provides a detailed overview of the Birhan Intelligence Portal (Task 3), demonstrating how it meets the requirements for a professional, responsive, and data-driven analytical tool.

## 🛠️ Interface Design
The dashboard utilizes a **Glassmorphic UI** system built with high-performance Vanilla CSS. This ensures maximum compatibility and responsiveness without the overhead of heavy frameworks.

### Key Layout Sections:
1.  **Analytical Engine (KPIs)**: Top-level cards displaying historical peaks, current range averages, and detected market shocks.
2.  **Structural Dynamic Chart**: A high-resolution `Recharts` area graph that supports dynamic downsampling and reference line overlays.
3.  **Market Catalyst Sidebar**: An interactive list of researched geopolitical events. Clicking an event triggers a "Structural Break" highlight on the main chart.

## 📱 Responsiveness & UX
-   **Desktop View**: Two-column layout with fixed sidebar for seamless event tracking.
-   **Tablet/Mobile View**: Single-column stack with auto-adjusting font sizes and chart padding.
-   **Interactive Filtering**: Users can select custom **Start** and **End** dates using a calendar-integrated filter system.

## 🔌 API Reference
The Flask backend provides clean JSON interfaces for all analytical data.

### Queryable Endpoints:
- `GET /api/prices?start_date=YYYY-MM-DD&end_date=YYYY-MM_DD`
- `GET /api/events`
- `GET /api/stats`
- `GET /api/analysis` (Returns Bayesian impact coefficients)

## 📸 Dashboard Screenshots
*Visual evidence of the functional dashboard is stored in `data/screenshots/`.*

### 1. Baseline Market View
*Displays the full 35-year price evolution and global KPIs.*

### 2. Event Correlation View
*Demonstrates the "Invasion of Ukraine" marking and its immediate price reaction.*

### 3. Custom Zoom View
*Shows the 2008 Financial Crisis zoomed into a specific 1-year window using the dynamic date filter.*

---
**Birhan Energies — Data at the speed of decision.**
