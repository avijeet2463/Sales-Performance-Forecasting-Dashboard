# ============================================================
# Sales Forecasting Dashboard — Phase 2: SQL Analysis & EDA
# Dataset: Superstore Sales (Kaggle)
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import seaborn as sns
import sqlalchemy as sa
import os

sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({"figure.dpi": 130, "figure.facecolor": "white"})
PLOTS_DIR = "notebooks/plots"
os.makedirs(PLOTS_DIR, exist_ok=True)


# ── 1. Load Data ─────────────────────────────────────────────
df = pd.read_csv("data/Sample - Superstore.csv", encoding="windows-1252")

# Fix column names — remove spaces AND hyphens
df.columns = df.columns.str.strip().str.replace(" ", "_").str.replace("-", "_")

df["Order_Date"] = pd.to_datetime(df["Order_Date"])
df["Ship_Date"]  = pd.to_datetime(df["Ship_Date"])

print("Shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Date range:", df["Order_Date"].min(), "to", df["Order_Date"].max())
print("Missing values:\n", df.isnull().sum()[df.isnull().sum() > 0])


# ── 2. Load into SQLite ──────────────────────────────────────
engine = sa.create_engine("sqlite:///data/superstore.db")
df.to_sql("sales", engine, if_exists="replace", index=False)
print("\nData loaded into SQLite: data/superstore.db")


def sql(query):
    with engine.connect() as conn:
        return pd.read_sql(query, conn)


# ── 3. SQL KPI Queries ───────────────────────────────────────
print("\n" + "="*55)
print("SQL KPI RESULTS")
print("="*55)

profit = sql("""
    SELECT
        ROUND(SUM(Sales), 2)  AS total_sales,
        ROUND(SUM(Profit), 2) AS total_profit,
        ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS profit_margin_pct
    FROM sales
""")
print(f"Total Revenue:  ${profit['total_sales'][0]:,.2f}")
print(f"Total Profit:   ${profit['total_profit'][0]:,.2f}")
print(f"Profit Margin:  {profit['profit_margin_pct'][0]:.1f}%")

monthly_revenue = sql("""
    SELECT
        SUBSTR(Order_Date, 1, 7) AS month,
        ROUND(SUM(Sales), 2)     AS revenue,
        ROUND(SUM(Profit), 2)    AS profit,
        COUNT(DISTINCT Order_ID) AS orders
    FROM sales
    GROUP BY month
    ORDER BY month
""")

top_products = sql("""
    SELECT
        Product_Name,
        ROUND(SUM(Sales), 2)  AS revenue,
        ROUND(SUM(Profit), 2) AS profit
    FROM sales
    GROUP BY Product_Name
    ORDER BY revenue DESC
    LIMIT 10
""")

region_perf = sql("""
    SELECT
        Region,
        ROUND(SUM(Sales), 2)  AS revenue,
        ROUND(SUM(Profit), 2) AS profit,
        ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS margin_pct
    FROM sales
    GROUP BY Region
    ORDER BY revenue DESC
""")
print("\nRevenue by region:")
print(region_perf.to_string(index=False))

# Get actual sub-category column name
subcol = [c for c in df.columns if "sub" in c.lower()][0]
print(f"\nSub-category column detected: {subcol}")

category_perf = sql(f"""
    SELECT
        Category,
        {subcol} AS Sub_Category,
        ROUND(SUM(Sales), 2)  AS revenue,
        ROUND(SUM(Profit), 2) AS profit,
        ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS margin_pct
    FROM sales
    GROUP BY Category, {subcol}
    ORDER BY revenue DESC
""")

yoy = sql("""
    SELECT
        SUBSTR(Order_Date, 1, 4) AS year,
        ROUND(SUM(Sales), 2) AS revenue
    FROM sales
    GROUP BY year
    ORDER BY year
""")
print("\nYoY Revenue:")
print(yoy.to_string(index=False))


# ── 4. Monthly Revenue Trend ─────────────────────────────────
monthly_revenue["month"] = pd.to_datetime(monthly_revenue["month"])

fig, ax = plt.subplots(figsize=(12, 4))
ax.plot(monthly_revenue["month"], monthly_revenue["revenue"],
        color="#378ADD", linewidth=2, marker="o", markersize=3)
ax.fill_between(monthly_revenue["month"], monthly_revenue["revenue"],
                alpha=0.1, color="#378ADD")
ax.yaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.set_title("Monthly revenue trend (2014-2017)", fontsize=13)
ax.set_ylabel("Revenue")
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/01_monthly_revenue_trend.png")
plt.show()
print("Business insight: Clear Q4 spike every year — holiday seasonality.")


# ── 5. Revenue & Profit by Category ─────────────────────────
cat_summary = category_perf.groupby("Category").agg(
    revenue=("revenue", "sum"), profit=("profit", "sum")
).reset_index()

fig, axes = plt.subplots(1, 2, figsize=(11, 4))
x = np.arange(len(cat_summary))
w = 0.35
axes[0].bar(x - w/2, cat_summary["revenue"], w, label="Revenue", color="#378ADD", edgecolor="none")
axes[0].bar(x + w/2, cat_summary["profit"], w, label="Profit", color="#10B981", edgecolor="none")
axes[0].set_xticks(x)
axes[0].set_xticklabels(cat_summary["Category"])
axes[0].yaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
axes[0].set_title("Revenue vs profit by category", fontsize=12)
axes[0].legend()
axes[0].spines[["top", "right"]].set_visible(False)

axes[1].pie(cat_summary["revenue"], labels=cat_summary["Category"],
            autopct="%1.1f%%", colors=["#378ADD", "#10B981", "#F59E0B"],
            startangle=90, wedgeprops={"edgecolor": "white", "linewidth": 2})
axes[1].set_title("Revenue share by category", fontsize=12)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/02_revenue_by_category.png", bbox_inches="tight")
plt.show()


# ── 6. Profit Margin by Region ───────────────────────────────
region_sorted = region_perf.sort_values("margin_pct")
colors = ["#EF4444" if x < 0 else "#378ADD" for x in region_sorted["margin_pct"]]

fig, ax = plt.subplots(figsize=(8, 4))
ax.barh(region_sorted["Region"], region_sorted["margin_pct"],
        color=colors, edgecolor="none", height=0.5)
for bar in ax.patches:
    w = bar.get_width()
    ax.text(w + 0.2, bar.get_y() + bar.get_height()/2,
            f"{w:.1f}%", va="center", fontsize=11)
ax.set_xlabel("Profit margin (%)")
ax.set_title("Profit margin by region", fontsize=13)
ax.axvline(0, color="black", linewidth=0.5)
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/03_profit_margin_by_region.png")
plt.show()


# ── 7. Top 10 Products by Revenue ───────────────────────────
top10 = top_products.sort_values("revenue")
fig, ax = plt.subplots(figsize=(9, 6))
ax.barh(top10["Product_Name"].str[:40], top10["revenue"],
        color="#378ADD", edgecolor="none", height=0.6)
ax.set_xlabel("Revenue ($)")
ax.set_title("Top 10 products by revenue", fontsize=13)
ax.xaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/04_top10_products.png", bbox_inches="tight")
plt.show()


# ── 8. Discount vs Profit Scatter ────────────────────────────
fig, ax = plt.subplots(figsize=(8, 5))
scatter = ax.scatter(df["Discount"], df["Profit"],
                     c=df["Profit"], cmap="RdYlGn",
                     alpha=0.4, s=15, edgecolors="none")
plt.colorbar(scatter, ax=ax, label="Profit ($)")
z = np.polyfit(df["Discount"], df["Profit"], 1)
p = np.poly1d(z)
x_line = np.linspace(0, df["Discount"].max(), 100)
ax.plot(x_line, p(x_line), color="#EF4444", linewidth=2,
        linestyle="--", label=f"Trend (slope={z[0]:.0f})")
ax.axhline(0, color="black", linewidth=0.5)
ax.set_xlabel("Discount rate")
ax.set_ylabel("Profit ($)")
ax.set_title("Discount vs profit — heavy discounting destroys margin", fontsize=12)
ax.legend()
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/05_discount_vs_profit.png")
plt.show()

corr = df[["Discount", "Profit"]].corr().iloc[0, 1]
print(f"Business insight: Discount-Profit correlation = {corr:.3f}")


# ── 9. Sub-category Profit ───────────────────────────────────
subcat = sql(f"""
    SELECT
        {subcol} AS Sub_Category,
        ROUND(SUM(Sales), 2)  AS revenue,
        ROUND(SUM(Profit), 2) AS profit
    FROM sales
    GROUP BY {subcol}
    ORDER BY profit ASC
""")

colors = ["#EF4444" if p < 0 else "#378ADD" for p in subcat["profit"]]
fig, ax = plt.subplots(figsize=(9, 7))
ax.barh(subcat["Sub_Category"], subcat["profit"],
        color=colors, edgecolor="none", height=0.6)
ax.axvline(0, color="black", linewidth=0.8)
ax.set_xlabel("Total profit ($)")
ax.set_title("Profit by sub-category — Tables and Bookcases lose money", fontsize=12)
ax.xaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/06_profit_by_subcategory.png", bbox_inches="tight")
plt.show()

losing = subcat[subcat["profit"] < 0]["Sub_Category"].tolist()
print(f"Business insight: Loss-making sub-categories: {losing}")


# ── 10. YoY Revenue Growth ───────────────────────────────────
yoy["revenue_prev"] = yoy["revenue"].shift(1)
yoy["growth_pct"] = ((yoy["revenue"] - yoy["revenue_prev"]) /
                      yoy["revenue_prev"] * 100).round(1)

fig, ax1 = plt.subplots(figsize=(8, 4))
ax2 = ax1.twinx()
ax1.bar(yoy["year"], yoy["revenue"], color="#378ADD", alpha=0.7, edgecolor="none", width=0.4)
ax1.yaxis.set_major_formatter(mtick.FuncFormatter(lambda x, _: f"${x/1000:.0f}K"))
ax1.set_ylabel("Revenue ($)")
ax1.set_title("Year-over-year revenue growth", fontsize=13)
ax2.plot(yoy["year"][1:], yoy["growth_pct"][1:],
         color="#10B981", marker="o", linewidth=2, markersize=8)
for i, row in yoy[1:].iterrows():
    ax2.annotate(f"{row['growth_pct']:.1f}%", xy=(row["year"], row["growth_pct"]),
                 xytext=(0, 10), textcoords="offset points",
                 ha="center", fontsize=11, color="#10B981", fontweight="bold")
ax2.set_ylabel("YoY growth (%)", color="#10B981")
ax2.tick_params(axis="y", labelcolor="#10B981")
ax1.spines[["top"]].set_visible(False)
plt.tight_layout()
plt.savefig(f"{PLOTS_DIR}/07_yoy_growth.png")
plt.show()


# ── 11. Summary ──────────────────────────────────────────────
print("\n" + "="*55)
print("EDA SUMMARY — Key Business Insights")
print("="*55)
print(f"  • Total revenue (2014-2017): ${df['Sales'].sum():,.0f}")
print(f"  • Total profit:              ${df['Profit'].sum():,.0f}")
print(f"  • Overall profit margin:     {df['Profit'].sum()/df['Sales'].sum()*100:.1f}%")
print(f"  • Best region by margin:     {region_perf.sort_values('margin_pct', ascending=False).iloc[0]['Region']}")
print(f"  • Loss-making sub-cats:      {losing}")
print(f"  • Discount-profit corr:      {corr:.3f} (negative = discounts hurt profit)")
print(f"\nAll plots saved to: {PLOTS_DIR}/")
print("Next step: Run sales_forecast.py (Phase 3 — Prophet model)")
