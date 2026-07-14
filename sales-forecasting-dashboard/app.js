// ============================================================
// Sales Dashboard — Application Logic
// Charts, Navigation, KPI Counter, client-side forecast simulation
// ============================================================

(() => {
  'use strict';

  const D = DASHBOARD_DATA;
  const charts = {};

  // ── Colors ────────────────────────────────────────────────
  const COLORS = {
    indigo: '#6366F1',
    indigoAlpha: 'rgba(99,102,241,0.18)',
    blue: '#3B82F6',
    blueAlpha: 'rgba(59,130,246,0.15)',
    green: '#10B981',
    greenAlpha: 'rgba(16,185,129,0.15)',
    amber: '#F59E0B',
    amberAlpha: 'rgba(245,158,11,0.18)',
    red: '#EF4444',
    redAlpha: 'rgba(239,68,68,0.15)',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    textSec: '#CBD5E1',
    textDim: '#64748B',
    grid: 'rgba(148,163,184,0.05)',
  };

  // ── Chart.js Global Defaults ──────────────────────────────
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = COLORS.textSec;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(14, 16, 23, 0.96)';
  Chart.defaults.plugins.tooltip.titleColor = '#F8FAFC';
  Chart.defaults.plugins.tooltip.bodyColor = '#CBD5E1';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(148,163,184,0.12)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.point.hoverBorderWidth = 2;
  Chart.defaults.elements.line.tension = 0.35;
  Chart.defaults.elements.line.borderWidth = 2.5;
  Chart.defaults.elements.bar.borderRadius = 4;

  // ── Helper Utilities ──────────────────────────────────────
  function fmt$(v) {
    if (Math.abs(v) >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
    if (Math.abs(v) >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
    return '$' + v.toFixed(0);
  }

  function fmtFull$(v) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function gridOpts() {
    return {
      grid: { color: COLORS.grid },
      border: { display: false },
      ticks: { color: COLORS.textDim, font: { size: 10 }, padding: 4 }
    };
  }

  function dollarAxis() {
    return {
      ...gridOpts(),
      ticks: {
        ...gridOpts().ticks,
        callback: v => fmt$(v)
      }
    };
  }

  function createGradient(canvasOrCtx, color, maxAlpha = 0.18) {
    const ctx = canvasOrCtx instanceof HTMLCanvasElement ? canvasOrCtx.getContext('2d') : canvasOrCtx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    // Convert hex to rgb
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    gradient.addColorStop(0, `rgba(${r},${g},${b},${maxAlpha})`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    return gradient;
  }

  // ── Animated Counter ──────────────────────────────────────
  function animateCounter(el, target, prefix = '', suffix = '', duration = 1200) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (target > 999999) {
        el.textContent = prefix + (current / 1e6).toFixed(2) + 'M' + suffix;
      } else if (target > 999) {
        el.textContent = prefix + (current / 1e3).toFixed(1) + 'K' + suffix;
      } else {
        el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
      else {
        if (target > 999999) el.textContent = prefix + (target / 1e6).toFixed(2) + 'M' + suffix;
        else el.textContent = prefix + target.toLocaleString(undefined, { maximumFractionDigits: 0 }) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  // ══════════════════════════════════════════════════════════
  // PAGE 1: Overview Initialization
  // ══════════════════════════════════════════════════════════
  function initOverview() {
    animateCounter(document.getElementById('kpi-revenue'), D.kpis.totalRevenue, '$');
    animateCounter(document.getElementById('kpi-profit'), D.kpis.totalProfit, '$');
    animateCounter(document.getElementById('kpi-orders'), D.kpis.totalOrders);
    animateCounter(document.getElementById('kpi-customers'), D.kpis.totalCustomers);

    // Trend Chart
    if (!charts.revenueTrend) {
      const ctx = document.getElementById('chart-revenue-trend');
      charts.revenueTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: D.monthly.map(m => m.date),
          datasets: [
            {
              label: 'Revenue',
              data: D.monthly.map(m => m.revenue),
              borderColor: COLORS.indigo,
              backgroundColor: createGradient(ctx, COLORS.indigo, 0.15),
              fill: true,
              pointBackgroundColor: COLORS.indigo,
            },
            {
              label: 'Profit',
              data: D.monthly.map(m => m.profit),
              borderColor: COLORS.green,
              backgroundColor: createGradient(ctx, COLORS.green, 0.08),
              fill: true,
              borderWidth: 1.5,
              pointBackgroundColor: COLORS.green,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', align: 'end' },
            tooltip: {
              callbacks: {
                label: ctx => ctx.dataset.label + ': ' + fmtFull$(ctx.parsed.y)
              }
            }
          },
          scales: {
            x: {
              ...gridOpts(),
              ticks: {
                ...gridOpts().ticks,
                maxTicksLimit: 12
              }
            },
            y: dollarAxis()
          }
        }
      });
    }

    // Category Donut
    if (!charts.categoryDonut) {
      charts.categoryDonut = new Chart(document.getElementById('chart-category-donut'), {
        type: 'doughnut',
        data: {
          labels: D.categories.map(c => c.name),
          datasets: [{
            data: D.categories.map(c => c.revenue),
            backgroundColor: [COLORS.indigo, COLORS.green, COLORS.amber],
            borderColor: '#141621',
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed / total) * 100).toFixed(1);
                  return ctx.label + ': ' + fmtFull$(ctx.parsed) + ' (' + pct + '%)';
                }
              }
            }
          }
        },
        plugins: [{
          id: 'centerText',
          afterDraw(chart) {
            const { ctx, chartArea: { width, height, top, left } } = chart;
            ctx.save();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            ctx.font = "bold 18px 'Inter', sans-serif";
            ctx.fillStyle = '#F8FAFC';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$2.30M', centerX, centerY - 8);
            ctx.font = "500 10px 'Inter', sans-serif";
            ctx.fillStyle = '#64748B';
            ctx.fillText('Sales Volume', centerX, centerY + 10);
            ctx.restore();
          }
        }]
      });
    }

    // YoY Revenue
    if (!charts.yoy) {
      charts.yoy = new Chart(document.getElementById('chart-yoy'), {
        type: 'bar',
        data: {
          labels: D.yoy.map(y => y.year.toString()),
          datasets: [{
            label: 'Sales',
            data: D.yoy.map(y => y.revenue),
            backgroundColor: [COLORS.indigoAlpha, COLORS.indigoAlpha, COLORS.indigoAlpha, COLORS.indigo],
            borderColor: [COLORS.indigo, COLORS.indigo, COLORS.indigo, COLORS.indigo],
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => fmtFull$(ctx.parsed.y) } }
          },
          scales: {
            x: gridOpts(),
            y: dollarAxis()
          }
        }
      });
    }

    // Segment Revenue
    if (!charts.segment) {
      charts.segment = new Chart(document.getElementById('chart-segment'), {
        type: 'bar',
        data: {
          labels: D.segments.map(s => s.name),
          datasets: [{
            label: 'Revenue',
            data: D.segments.map(s => s.revenue),
            backgroundColor: [COLORS.indigo, COLORS.cyan, COLORS.purple],
            borderRadius: 6,
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => fmtFull$(ctx.parsed.x) } }
          },
          scales: {
            x: dollarAxis(),
            y: gridOpts()
          }
        }
      });
    }
  }

  // ══════════════════════════════════════════════════════════
  // PAGE 2: Deep Dive Initialization
  // ══════════════════════════════════════════════════════════
  function initDeepDive() {
    // Rev vs Profit Category
    if (!charts.catRevProfit) {
      charts.catRevProfit = new Chart(document.getElementById('chart-cat-revprofit'), {
        type: 'bar',
        data: {
          labels: D.categories.map(c => c.name),
          datasets: [
            {
              label: 'Revenue',
              data: D.categories.map(c => c.revenue),
              backgroundColor: COLORS.indigo,
              borderRadius: 6,
              barPercentage: 0.55
            },
            {
              label: 'Profit',
              data: D.categories.map(c => c.profit),
              backgroundColor: COLORS.green,
              borderRadius: 6,
              barPercentage: 0.55
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', align: 'end' } },
          scales: {
            x: gridOpts(),
            y: dollarAxis()
          }
        }
      });
    }

    // Regional Margin
    if (!charts.regionMargin) {
      const regions = [...D.regions].sort((a,b) => a.margin - b.margin);
      charts.regionMargin = new Chart(document.getElementById('chart-region-margin'), {
        type: 'bar',
        data: {
          labels: regions.map(r => r.name),
          datasets: [{
            label: 'Margin %',
            data: regions.map(r => r.margin),
            backgroundColor: regions.map(r => r.margin < 10 ? COLORS.red : COLORS.indigo),
            borderRadius: 6,
            barPercentage: 0.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ctx.parsed.x + '%' } }
          },
          scales: {
            x: {
              ...gridOpts(),
              ticks: { ...gridOpts().ticks, callback: v => v + '%' }
            },
            y: gridOpts()
          }
        }
      });
    }

    // Top Products
    if (!charts.topProducts) {
      charts.topProducts = new Chart(document.getElementById('chart-top-products'), {
        type: 'bar',
        data: {
          labels: D.top10Products.map(p => p.name.substring(0, 32) + '...'),
          datasets: [{
            data: D.top10Products.map(p => p.revenue),
            backgroundColor: COLORS.indigo,
            borderRadius: 4,
            barPercentage: 0.55
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: dollarAxis(),
            y: gridOpts()
          }
        }
      });
    }

    // Scatter Plot
    if (!charts.discountScatter) {
      charts.discountScatter = new Chart(document.getElementById('chart-discount-scatter'), {
        type: 'scatter',
        data: {
          datasets: [{
            data: D.scatter.map(s => ({ x: s.d, y: s.p })),
            backgroundColor: D.scatter.map(s => s.p < 0 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.45)'),
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ...gridOpts(),
              title: { display: true, text: 'Discount Rate', color: COLORS.textDim },
              ticks: { ...gridOpts().ticks, callback: v => (v * 100) + '%' }
            },
            y: {
              ...dollarAxis(),
              title: { display: true, text: 'Order Net Profit', color: COLORS.textDim }
            }
          }
        }
      });
    }

    // Sub-category profit
    if (!charts.subcatProfit) {
      charts.subcatProfit = new Chart(document.getElementById('chart-subcat-profit'), {
        type: 'bar',
        data: {
          labels: D.subCategories.map(s => s.name),
          datasets: [{
            data: D.subCategories.map(s => s.profit),
            backgroundColor: D.subCategories.map(s => s.profit < 0 ? COLORS.red : COLORS.indigo),
            borderRadius: 4,
            barPercentage: 0.55
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: dollarAxis(),
            y: gridOpts()
          }
        }
      });
    }
  }

  // ══════════════════════════════════════════════════════════
  // PAGE 3: Forecast & Model Initialization
  // ══════════════════════════════════════════════════════════
  function initForecast() {
    document.getElementById('metric-mae').textContent = '$' + D.modelMetrics.mae.toLocaleString();
    document.getElementById('metric-rmse').textContent = '$' + D.modelMetrics.rmse.toLocaleString();
    document.getElementById('metric-mape').textContent = D.modelMetrics.mape + '%';

    const tbody = document.getElementById('forecast-table-body');
    if (tbody.children.length === 0) {
      const names = ['Jan 2018', 'Feb 2018', 'Mar 2018'];
      D.futureForecast.forEach((f, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${names[i]}</strong></td>
          <td class="value-cell forecast-value">${fmtFull$(f.forecast)}</td>
          <td class="ci-cell">${fmtFull$(f.lower)}</td>
          <td class="ci-cell">${fmtFull$(f.upper)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Main actual vs forecast line
    if (!charts.actualVsForecast) {
      const allDates = [...D.forecast.map(f => f.date), ...D.futureForecast.map(f => f.date)];
      const actuals = [...D.forecast.map(f => f.actual), ...D.futureForecast.map(() => null)];
      const forecasts = [...D.forecast.map(f => f.forecast), ...D.futureForecast.map(f => f.forecast)];
      const lowers = [...D.forecast.map(f => f.lower), ...D.futureForecast.map(f => f.lower)];
      const uppers = [...D.forecast.map(f => f.upper), ...D.futureForecast.map(f => f.upper)];

      charts.actualVsForecast = new Chart(document.getElementById('chart-actual-vs-forecast'), {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [
            {
              label: 'Actual Revenue',
              data: actuals,
              borderColor: COLORS.indigo,
              pointBackgroundColor: COLORS.indigo,
            },
            {
              label: 'Prophet Model',
              data: forecasts,
              borderColor: COLORS.amber,
              borderDash: [5, 4],
              pointBackgroundColor: COLORS.amber,
            },
            {
              label: '95% CI High',
              data: uppers,
              borderColor: 'transparent',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              fill: '+1',
              pointRadius: 0
            },
            {
              label: '95% CI Low',
              data: lowers,
              borderColor: 'transparent',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              labels: {
                filter: item => !item.text.includes('CI')
              }
            }
          },
          scales: {
            x: {
              ...gridOpts(),
              ticks: { ...gridOpts().ticks, maxTicksLimit: 12 }
            },
            y: dollarAxis()
          }
        }
      });
    }

    // Categories mini forecasts
    buildCategoryForecastChart('chart-cat-furniture', 'Furniture', COLORS.indigo);
    buildCategoryForecastChart('chart-cat-office', 'Office Supplies', COLORS.green);
    buildCategoryForecastChart('chart-cat-tech', 'Technology', COLORS.amber);
  }

  function buildCategoryForecastChart(canvasId, name, color) {
    if (charts[canvasId]) return;
    const catData = D.categoryMonthly[name];
    const labels = catData.map(d => d.date);
    const values = catData.map(d => d.sales);

    const baseAvg = values.slice(-12).reduce((a,b)=>a+b, 0) / 12;
    const sCoeff = D.seasonality[name];
    const forecasted = [0, 1, 2].map(i => baseAvg * sCoeff[i] * 1.05);

    const allLabels = [...labels, '2018-01', '2018-02', '2018-03'];
    const actuals = [...values, null, null, null];
    const forecasts = [...Array(values.length).fill(null), ...forecasted];
    forecasts[values.length - 1] = values[values.length - 1]; // bridge

    charts[canvasId] = new Chart(document.getElementById(canvasId), {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          { data: actuals, borderColor: color, fill: false, pointRadius: 0 },
          { data: forecasts, borderColor: color, borderDash: [4,3], fill: false, pointRadius: 2 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ...gridOpts(), ticks: { ...gridOpts().ticks, maxTicksLimit: 6 } },
          y: dollarAxis()
        }
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  // PAGE 4: Live Prediction Engine
  // ══════════════════════════════════════════════════════════
  let currentScenario = 'base';

  function initPrediction() {
    const monthsSlider = document.getElementById('predict-months');
    const monthsDisplay = document.getElementById('predict-months-display');
    const predictBtn = document.getElementById('predict-btn');
    const scenarioBtns = document.querySelectorAll('.scenario-btn');

    monthsSlider.addEventListener('input', () => {
      monthsDisplay.textContent = monthsSlider.value;
    });

    scenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scenarioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentScenario = btn.dataset.scenario;
      });
    });

    predictBtn.addEventListener('click', () => {
      runPredictionSimulation();
    });

    // Draw initial placeholder
    drawPredictionSimulationChart(null);
  }

  function runPredictionSimulation() {
    const btn = document.getElementById('predict-btn');
    btn.classList.add('loading');
    btn.textContent = '⏳ Simulating Future...';

    setTimeout(() => {
      const category = document.getElementById('predict-category').value;
      const months = parseInt(document.getElementById('predict-months').value);
      const seasonality = D.seasonality[category];

      let historicalValues;
      let historicalLabels;
      if (category === 'All') {
        historicalValues = D.monthly.map(m => m.revenue);
        historicalLabels = D.monthly.map(m => m.date);
      } else {
        historicalValues = D.categoryMonthly[category].map(m => m.sales);
        historicalLabels = D.categoryMonthly[category].map(m => d => d.date);
      }

      const last12 = historicalValues.slice(-12);
      const avgBase = last12.reduce((a,b)=>a+b, 0) / 12;

      // growth multipliers
      const multipliers = { pessimistic: 0.88, base: 1.0, optimistic: 1.15 };
      const m = multipliers[currentScenario];

      const predictions = [];
      const predLabels = [];
      let expectedSum = 0;
      let lowerSum = 0;
      let upperSum = 0;

      for (let i = 0; i < months; i++) {
        const monthIdx = i % 12;
        const trend = 1 + 0.05 * ((i + 1) / 12);
        const val = avgBase * seasonality[monthIdx] * trend * m;
        const width = 0.1 + i * 0.015;
        const lower = val * (1 - width);
        const upper = val * (1 + width);

        predictions.push({ val, lower, upper });
        expectedSum += val;
        lowerSum += lower;
        upperSum += upper;

        const dateIdx = i + 1;
        predLabels.push(`2018-${String(dateIdx).padStart(2,'0')}`);
      }

      const lastYearSamePeriodSum = last12.slice(0, months).reduce((a,b)=>a+b, 0);
      const growthPct = ((expectedSum - lastYearSamePeriodSum) / lastYearSamePeriodSum * 100);

      const result = {
        category,
        scenario: currentScenario,
        months,
        predictions,
        predLabels,
        expectedSum,
        lowerSum,
        upperSum,
        growthPct,
        history: historicalValues.slice(-12),
        historyLabels: D.monthly.slice(-12).map(m => m.date)
      };

      // update UI
      animateCounter(document.getElementById('pred-revenue'), expectedSum, '$');
      document.getElementById('pred-revenue-sub').textContent = `Total revenue over ${months} months`;

      const growthSign = growthPct >= 0 ? '+' : '';
      document.getElementById('pred-growth').textContent = growthSign + growthPct.toFixed(1) + '%';
      document.getElementById('pred-growth').style.color = growthPct >= 0 ? COLORS.green : COLORS.red;

      document.getElementById('pred-confidence').textContent = fmt$(lowerSum) + ' - ' + fmt$(upperSum);

      drawPredictionSimulationChart(result);

      btn.classList.remove('loading');
      btn.textContent = '⚡ Run Simulation';
    }, 450);
  }

  function drawPredictionSimulationChart(res) {
    const ctx = document.getElementById('chart-prediction');
    if (charts.prediction) {
      charts.prediction.destroy();
    }

    if (!res) {
      charts.prediction = new Chart(ctx, {
        type: 'line',
        data: {
          labels: D.monthly.slice(-12).map(m=>m.date),
          datasets: [{ data: D.monthly.slice(-12).map(m=>m.revenue), borderColor: COLORS.indigo, fill: false }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: gridOpts(), y: dollarAxis() }
        }
      });
      return;
    }

    const allLabels = [...res.historyLabels, ...res.predLabels];
    const histData = [...res.history, ...Array(res.months).fill(null)];
    const predData = [...Array(11).fill(null), res.history[11], ...res.predictions.map(p => p.val)];
    const upperData = [...Array(11).fill(null), res.history[11], ...res.predictions.map(p => p.upper)];
    const lowerData = [...Array(11).fill(null), res.history[11], ...res.predictions.map(p => p.lower)];

    const accentColor = res.scenario === 'pessimistic' ? COLORS.red : res.scenario === 'optimistic' ? COLORS.green : COLORS.amber;

    charts.prediction = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          { label: 'Historical', data: histData, borderColor: COLORS.indigo, fill: false, pointRadius: 0 },
          { label: 'Forecast', data: predData, borderColor: accentColor, borderDash: [5,4], fill: false, pointRadius: 2 },
          { label: 'Upper Band', data: upperData, borderColor: 'transparent', backgroundColor: 'rgba(99,102,241,0.06)', fill: '+1', pointRadius: 0 },
          { label: 'Lower Band', data: lowerData, borderColor: 'transparent', backgroundColor: 'rgba(99,102,241,0.06)', fill: false, pointRadius: 0 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { filter: item => !item.text.includes('Band') } }
        },
        scales: {
          x: gridOpts(),
          y: dollarAxis()
        }
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  // Navigation Coordinator
  // ══════════════════════════════════════════════════════════
  const navigationConfig = {
    overview: {
      title: 'Executive Overview',
      description: 'High-level KPIs, revenue trends, and category performance',
      init: initOverview
    },
    deepdive: {
      title: 'Sales Deep Dive',
      description: 'Category breakdowns, regional margins, top products, and discount analysis',
      init: initDeepDive
    },
    forecast: {
      title: 'Forecast & Model Details',
      description: 'Prophet time-series forecasting model component breakdown and metrics',
      init: initForecast
    },
    predict: {
      title: 'Live Prediction Simulation',
      description: 'Extrapolate future revenue based on growth scenario configurations',
      init: initPrediction
    }
  };

  const initializedList = new Set();

  function navigateTo(pageId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    document.querySelectorAll('.page-section').forEach(sect => {
      sect.classList.toggle('active', sect.id === 'page-' + pageId);
    });

    const cfg = navigationConfig[pageId];
    if (cfg) {
      document.getElementById('pageTitle').textContent = cfg.title;
      document.getElementById('pageDescription').textContent = cfg.description;

      if (!initializedList.has(pageId)) {
        cfg.init();
        initializedList.add(pageId);
      }
    }

    document.getElementById('mainContent').scrollTop = 0;
  }

  // Event handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.page);
    });
  });

  // Startup
  navigateTo('overview');

})();
