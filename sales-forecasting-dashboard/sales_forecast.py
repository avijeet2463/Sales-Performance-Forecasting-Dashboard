# ============================================================
# Sales Forecasting Dashboard — Phase 3: Prophet Forecasting
# Dataset: Superstore Sales (Kaggle)
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import warnings
import os
import joblib

warnings.filterwarnings("ignore")

from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from prophet.plot import plot_cross_validation_metric

from sklearn.metrics import mean_absolute_error, mean_squared_error

PLOTS_DIR = "notebooks/plots"
MODELS_DIR = "models"
os.makedirs(PLOTS_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)


# ── 1. Load & Prepare Data ───────────────────────────────────
df = pd.read_csv("data/Sample - Superstore.csv", encoding="windows-1252")
df.columns = df.columns.str.strip().str.replace(" ", "_")
df["Order_Date"] = pd.to_datetime(df["Order_Date"])

print("Shape:", df.shape)
print("Date range:", df["Order_Date"].min(), "→", df["Order_Date"].max())


# ── 2. Aggregate to Monthly Sales ───────────────────────────
# IMPORTANT: Prophet requires exactly 2 columns: ds (date) and y (value)
monthly = (
    df.groupby(pd.Grouper(key="Order_Date", freq="MS"))["Sales"]
    .sum()
    .reset_index()
    .rename(columns={"Order_Date": "ds", "Sales": "y"})
)

print(f"\nMonthly data points: {len(monthly)}")
print(f"Monthly revenue range: ${monthly['y'].min():,.0f} — ${monthly['y'].max():,.0f}")
print(f"Average monthly revenue: ${monthly['y'].mean():,.0f}")
print(f"\nFirst 5 rows (Prophet format):\n{monthly.head()}")


# ── 3. Train / Test Split (time-based — NOT random) ─────────
# CRITICAL: Always split time series by date, never by random shuffle
# Use last 3 months as test set
split_date = monthly["ds"].max() - pd.DateOffset(months=3)
train = monthly[monthly["ds"] <= split_date].copy()
test  = monthly[monthly["ds"] >  split_date].copy()

print(f"\nTrain: {len(train)} months ({train['ds'].min().date()} → {train['ds'].max().date()})")
print(f"Test:  {len(test)} months  ({test['ds'].min().date()} → {test['ds'].max().date()})")


# ── 4. Train Prophet Model ───────────────────────────────────
print("\nTraining Prophet model...")

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=False,   # Monthly data — weekly seasonality not applicable
    daily_seasonality=False,
    seasonality_mode="multiplicative",  # Better for retail (sales scale with trend)
    changepoint_prior_scale=0.05,       # Controls trend flexibility — lower = smoother
    seasonality_prior_scale=10.0,       # Controls seasonality strength
    interval_width=0.95                 # 95% confidence interval
)

# Add US holidays — improves Q4 holiday spike detection
model.add_country_holidays(country_name="US")

model.fit(train)
print("Model trained successfully.")


# ── 5. Evaluate on Test Set ──────────────────────────────────
# Predict on test period dates
future_test = model.make_future_dataframe(periods=len(test), freq="MS")
forecast_test = model.predict(future_test)

# Extract test predictions
test_preds = forecast_test[forecast_test["ds"].isin(test["ds"])][["ds", "yhat", "yhat_lower", "yhat_upper"]]
test_merged = test.merge(test_preds, on="ds")

mae  = mean_absolute_error(test_merged["y"], test_merged["yhat"])
rmse = np.sqrt(mean_squared_error(test_merged["y"], test_merged["yhat"]))
mape = (abs(test_merged["y"] - test_merged["yhat"]) / test_merged["y"]).mean() * 100

print("\n" + "="*50)
print("MODEL EVALUATION ON TEST SET (last 3 months)")
print("="*50)
print(f"  MAE:  ${mae:,.0f}  (avg absolute error per month)")
print(f"  RMSE: ${rmse:,.0f} (penalises large errors)")
print(f"  MAPE: {mape:.1f}%  (mean absolute percentage error)")
print("\n>> Resume bullet metric: use MAPE — e.g. '{:.0f}% MAPE'".format(mape))


# ── 6. Generate 3-Month Future Forecast ──────────────────────
# Retrain on FULL data for final forecast
model_full = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=False,
    daily_seasonality=False,
    seasonality_mode="multiplicative",
    changepoint_prior_scale=0.05,
    seasonality_prior_scale=10.0,
    interval_width=0.95
)
model_full.add_country_holidays(country_name="US")
model_full.fit(monthly)

future = model_full.make_future_dataframe(periods=3, freq="MS")
forecast = model_full.predict(future)

# Extract future 3 months only
future_only = forecast[forecast["ds"] > monthly["ds"].max()][
    ["ds", "yhat", "yhat_lower", "yhat_upper"]
].copy()
future_only.columns = ["Date", "Forecast", "Lower_CI", "Upper_CI"]
future_only["Forecast"] = future_only["Forecast"].round(2)
future_only["Lower_CI"] = future_only["Lower_CI"].round(2)
future_only["Upper_CI"] = future_only["Upper_CI"].round(2)

print("\n3-Month Revenue Forecast:")
print(future_only.to_string(index=False))


# ── 7. Export Forecast CSV for Power BI ─────────────────────
# Combine historical + forecast for Power BI
historical_export = monthly.rename(columns={"ds": "Date", "y": "Actual_Sales"})
historical_export["Forecast"] = forecast[forecast["ds"].isin(monthly["ds"])]["yhat"].values.round(2)
historical_export["Lower_CI"] = forecast[forecast["ds"].isin(monthly["ds"])]["yhat_lower"].values.round(2)
historical_export["Upper_CI"] = forecast[forecast["ds"].isin(monthly["ds"])]["yhat_upper"].values.round(2)
historical_export["Type"] = "Historical"

future_export = future_only.copy()
future_export["Actual_Sales"] = np.nan
future_export["Type"] = "Forecast"

export_df = pd.concat([historical_export, future_export], ignore_index=True)
export_df.to_csv("data/sales_forecast.csv", index=False)
print(f"\nForecast exported: data/sales_forecast.csv ({len(export_df)} rows)")
print("Load this file into Power BI for the forecast page.")


# ── 8. Save Model ─────────────────────────────────────────────
joblib.dump(model_full, f"{MODELS_DIR}/prophet_sales_model.pkl")
print(f"Model saved: {MODELS_DIR}/prophet_sales_model.pkl")


# ── 9. Plot: Actual vs Forecast (full view) ──────────────────
fig, ax = plt.subplots(figsize=(13, 5))

# Historical actual
ax.plot(monthly["ds"], monthly["y"], color="#378ADD",
        linewidth=2, label="Actual sales", zorder=3)

# Fitted values (historical)
hist_forecast = forecast[forecast["ds"].isin(monthly["ds"])]
ax.plot(hist_forecast["ds"], hist_forecast["yhat"],
        color="#10B981", linewidth=1.5, linestyle="--",
        label="Prophet fit", alpha=0.8)

# Future forecast
ax.plot(future_only["Date"], future_only["Forecast"],
        color="#F59E0B", linewidth=2.5, marker="o", markersize=6,
        label="3-month forecast", zorder=4)

# Confidence interval
all_dates = pd.concat([hist_forecast["ds"], future_only["Date"]])
all_lower = pd.concat([hist_forecast["yhat_lower"], future_only["Lower_CI"]])
all_upper = pd.concat([hist_forecast["yhat_upper"], future_only["Upper_CI"]])
ax.fill_between(all_dates, all_lower, all_upper,
                alpha=0.15, color="#F59E0B", label="95% confidence interval")

# Vertical line at forecast start
ax.axvline(monthly["ds"].max(), color="gray", linewidth=1,
           linestyle=":", alpha=0.7, label="Forecast start")

ax.yaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.set_title("Sales forecast — actual vs Prophet prediction (3-month horizon)", fontsize=13)
ax.set_xlabel("")
ax.set_ylabel("Monthly Revenue")
ax.legend(loc="upper left", fontsize=10)
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/08_sales_forecast.png")
plt.show()


# ── 10. Plot: Forecast Components (trend + seasonality) ──────
fig2 = model_full.plot_components(forecast)
fig2.suptitle("Prophet model components — trend, holidays, yearly seasonality",
              fontsize=12, y=1.01)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/09_forecast_components.png", bbox_inches="tight")
plt.show()
print("Insight: Components plot shows trend direction + which months are seasonally strong.")


# ── 11. Plot: Test Set Evaluation ────────────────────────────
fig, ax = plt.subplots(figsize=(9, 4))

ax.plot(test_merged["ds"], test_merged["y"],
        color="#378ADD", linewidth=2, marker="o", markersize=6,
        label="Actual (test set)")
ax.plot(test_merged["ds"], test_merged["yhat"],
        color="#F59E0B", linewidth=2, marker="s", markersize=6,
        linestyle="--", label="Prophet predicted")
ax.fill_between(test_merged["ds"],
                test_merged["yhat_lower"], test_merged["yhat_upper"],
                alpha=0.2, color="#F59E0B", label="95% CI")

ax.yaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.set_title(f"Test set evaluation — MAPE: {mape:.1f}%  |  MAE: ${mae:,.0f}", fontsize=12)
ax.legend()
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/10_test_evaluation.png")
plt.show()


# ── 12. Category-level Forecasts ─────────────────────────────
print("\nBuilding category-level forecasts...")

categories = df["Category"].unique()
cat_forecasts = {}

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
colors_cat = {"Furniture": "#378ADD", "Office Supplies": "#10B981", "Technology": "#F59E0B"}

for i, cat in enumerate(categories):
    cat_df = (
        df[df["Category"] == cat]
        .groupby(pd.Grouper(key="Order_Date", freq="MS"))["Sales"]
        .sum()
        .reset_index()
        .rename(columns={"Order_Date": "ds", "Sales": "y"})
    )

    m = Prophet(yearly_seasonality=True, weekly_seasonality=False,
                daily_seasonality=False, seasonality_mode="multiplicative",
                interval_width=0.95)
    m.fit(cat_df)

    fut = m.make_future_dataframe(periods=3, freq="MS")
    fc  = m.predict(fut)
    cat_forecasts[cat] = fc

    color = colors_cat.get(cat, "#378ADD")
    axes[i].plot(cat_df["ds"], cat_df["y"], color=color, linewidth=2, label="Actual")
    future_cat = fc[fc["ds"] > cat_df["ds"].max()]
    axes[i].plot(future_cat["ds"], future_cat["yhat"],
                 color=color, linewidth=2, linestyle="--",
                 marker="o", markersize=5, label="Forecast")
    axes[i].fill_between(future_cat["ds"],
                         future_cat["yhat_lower"], future_cat["yhat_upper"],
                         alpha=0.2, color=color)
    axes[i].set_title(f"{cat}", fontsize=12)
    axes[i].yaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
    axes[i].spines[["top", "right"]].set_visible(False)
    axes[i].legend(fontsize=9)

plt.suptitle("3-Month revenue forecast by category", fontsize=13, y=1.02)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/11_category_forecasts.png", bbox_inches="tight")
plt.show()


# ── 13. Final Summary ─────────────────────────────────────────
avg_forecast = future_only["Forecast"].mean()
avg_historical = monthly["y"].tail(3).mean()
growth = (avg_forecast - avg_historical) / avg_historical * 100

print("\n" + "="*55)
print("FORECAST SUMMARY")
print("="*55)
print(f"  Historical avg (last 3 months): ${avg_historical:,.0f}/month")
print(f"  Forecasted avg (next 3 months): ${avg_forecast:,.0f}/month")
print(f"  Projected growth:               {growth:+.1f}%")
print(f"\n  Model accuracy (test set):")
print(f"  MAE:  ${mae:,.0f}")
print(f"  RMSE: ${rmse:,.0f}")
print(f"  MAPE: {mape:.1f}%")

print("\n>> Resume bullet (fill in your MAPE):")
print(f'   "Built Prophet-based sales forecasting pipeline on 9,994-row Superstore')
print(f'    dataset; achieved {mape:.0f}% MAPE on 3-month holdout; surfaced $XK')
print(f'    revenue opportunity via category-level forecasts in Power BI"')

print(f"\nAll plots saved to: {PLOTS_DIR}/")
print("Next step: Open Power BI Desktop and load data/sales_forecast.csv (Phase 4)")
