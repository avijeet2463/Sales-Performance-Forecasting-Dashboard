// ============================================================
// Sales Dashboard — Embedded Data (extracted from CSV files)
// ============================================================

const DASHBOARD_DATA = {

  // ── KPI Summary ─────────────────────────────────────────────
  kpis: {
    totalRevenue: 2297200.86,
    totalProfit: 286397.02,
    profitMargin: 12.5,
    totalOrders: 5009,
    totalCustomers: 793,
    avgOrderValue: 458.61,
    discountProfitCorr: -0.219
  },

  // ── Monthly Revenue & Profit (2014-01 to 2017-12) ──────────
  monthly: [
    {date:"2014-01",revenue:14236.90,profit:2450.19,orders:32},
    {date:"2014-02",revenue:4519.89,profit:862.31,orders:28},
    {date:"2014-03",revenue:55691.01,profit:498.73,orders:71},
    {date:"2014-04",revenue:28295.34,profit:3488.84,orders:66},
    {date:"2014-05",revenue:23648.29,profit:2738.71,orders:69},
    {date:"2014-06",revenue:34595.13,profit:4976.52,orders:66},
    {date:"2014-07",revenue:33946.39,profit:-841.48,orders:65},
    {date:"2014-08",revenue:27909.47,profit:5318.10,orders:72},
    {date:"2014-09",revenue:81777.35,profit:8328.10,orders:130},
    {date:"2014-10",revenue:31453.39,profit:3448.26,orders:78},
    {date:"2014-11",revenue:78628.72,profit:9292.13,orders:151},
    {date:"2014-12",revenue:69545.62,profit:8983.57,orders:141},
    {date:"2015-01",revenue:18174.08,profit:-3281.01,orders:29},
    {date:"2015-02",revenue:11951.41,profit:2813.85,orders:36},
    {date:"2015-03",revenue:38726.25,profit:9732.10,orders:79},
    {date:"2015-04",revenue:34195.21,profit:4187.50,orders:72},
    {date:"2015-05",revenue:30131.69,profit:4667.87,orders:74},
    {date:"2015-06",revenue:24797.29,profit:3335.56,orders:68},
    {date:"2015-07",revenue:28765.32,profit:3288.65,orders:66},
    {date:"2015-08",revenue:36898.33,profit:5355.81,orders:68},
    {date:"2015-09",revenue:64595.92,profit:8209.16,orders:140},
    {date:"2015-10",revenue:31404.92,profit:2817.37,orders:87},
    {date:"2015-11",revenue:75972.56,profit:12474.79,orders:158},
    {date:"2015-12",revenue:74919.52,profit:8016.97,orders:161},
    {date:"2016-01",revenue:18542.49,profit:2824.82,orders:48},
    {date:"2016-02",revenue:22978.82,profit:5004.58,orders:45},
    {date:"2016-03",revenue:51715.88,profit:3611.97,orders:86},
    {date:"2016-04",revenue:38750.04,profit:2977.81,orders:89},
    {date:"2016-05",revenue:56987.73,profit:8662.15,orders:108},
    {date:"2016-06",revenue:40344.53,profit:4750.38,orders:97},
    {date:"2016-07",revenue:39261.96,profit:4432.88,orders:96},
    {date:"2016-08",revenue:31115.37,profit:2062.07,orders:90},
    {date:"2016-09",revenue:73410.02,profit:9328.66,orders:192},
    {date:"2016-10",revenue:59687.74,profit:16243.14,orders:105},
    {date:"2016-11",revenue:79411.97,profit:4011.41,orders:183},
    {date:"2016-12",revenue:96999.04,profit:17885.31,orders:176},
    {date:"2017-01",revenue:43971.37,profit:7140.44,orders:69},
    {date:"2017-02",revenue:20301.13,profit:1613.87,orders:53},
    {date:"2017-03",revenue:58872.35,profit:14751.89,orders:118},
    {date:"2017-04",revenue:36521.54,profit:933.29,orders:116},
    {date:"2017-05",revenue:44261.11,profit:6342.58,orders:118},
    {date:"2017-06",revenue:52981.73,profit:8223.34,orders:133},
    {date:"2017-07",revenue:45264.42,profit:6952.62,orders:111},
    {date:"2017-08",revenue:63120.89,profit:9040.96,orders:111},
    {date:"2017-09",revenue:87866.65,profit:10991.56,orders:226},
    {date:"2017-10",revenue:77776.92,profit:9275.28,orders:147},
    {date:"2017-11",revenue:118447.82,profit:9690.10,orders:261},
    {date:"2017-12",revenue:83829.32,profit:8483.35,orders:224}
  ],

  // ── Category Performance ───────────────────────────────────
  categories: [
    {name:"Furniture",   revenue:741999.80, profit:18451.27},
    {name:"Office Supplies", revenue:719047.03, profit:122490.80},
    {name:"Technology",  revenue:836154.03, profit:145454.95}
  ],

  // ── Region Performance ─────────────────────────────────────
  regions: [
    {name:"West",    revenue:725457.82, profit:108418.45, margin:14.9},
    {name:"East",    revenue:678781.24, profit:91522.78,  margin:13.5},
    {name:"South",   revenue:391721.91, profit:46749.43,  margin:11.9},
    {name:"Central", revenue:501239.89, profit:39706.36,  margin:7.9}
  ],

  // ── Top 10 Products by Revenue ────────────────────────────
  top10Products: [
    {name:"Canon imageCLASS 2200 Advanced Copier",     revenue:61599.82},
    {name:"Fellowes PB500 Electric Punch Plastic",     revenue:27453.38},
    {name:"Cisco TelePresence System EX90 Videoconf",  revenue:22638.48},
    {name:"HON 5400 Series Task Chairs",               revenue:21870.58},
    {name:"GBC DocuBind TL300 Electric Binding System", revenue:19823.44},
    {name:"Hewlett Packard LaserJet 3310 Copier",      revenue:18839.68},
    {name:"Hamilton Beach Refrigerator, Red",          revenue:16526.73},
    {name:"Nokia Smart Phone, with Caller ID",         revenue:16399.27},
    {name:"Sharp Wireless Fax, Digital",               revenue:15999.96},
    {name:"High Speed Automatic Electric Letter Open",  revenue:15719.99}
  ],

  // ── Sub-category Profit (sorted ascending) ────────────────
  subCategories: [
    {name:"Tables",      profit:-17725.48, revenue:206965.53},
    {name:"Bookcases",   profit:-3472.56,  revenue:114880.00},
    {name:"Supplies",    profit:-1189.10,  revenue:46673.54},
    {name:"Fasteners",   profit:949.52,    revenue:3024.28},
    {name:"Machines",    profit:3384.76,   revenue:189238.63},
    {name:"Labels",      profit:5546.25,   revenue:12486.31},
    {name:"Art",         profit:6527.79,   revenue:27118.79},
    {name:"Envelopes",   profit:6964.18,   revenue:16476.40},
    {name:"Furnishings", profit:13059.14,  revenue:91705.16},
    {name:"Appliances",  profit:18138.01,  revenue:107532.16},
    {name:"Storage",     profit:21278.83,  revenue:223843.61},
    {name:"Chairs",      profit:26590.17,  revenue:328449.10},
    {name:"Binders",     profit:30221.76,  revenue:203412.73},
    {name:"Paper",       profit:34053.57,  revenue:78479.21},
    {name:"Accessories", profit:41936.64,  revenue:167380.32},
    {name:"Phones",      profit:44515.73,  revenue:330007.05},
    {name:"Copiers",     profit:55617.82,  revenue:149528.03}
  ],

  // ── Year-over-Year Revenue ────────────────────────────────
  yoy: [
    {year:2014, revenue:484247.50},
    {year:2015, revenue:470532.51},
    {year:2016, revenue:609205.60},
    {year:2017, revenue:733215.26}
  ],

  // ── Segment Breakdown ─────────────────────────────────────
  segments: [
    {name:"Consumer",    revenue:1161401.34},
    {name:"Corporate",   revenue:706146.37},
    {name:"Home Office", revenue:429653.15}
  ],

  // ── Discount vs Profit Scatter (sampled 300 pts) ──────────
  scatter: [
    {d:0.0,p:44.99},{d:0.0,p:74.97},{d:0.0,p:300.74},{d:0.0,p:28.33},{d:0.0,p:30.7},
    {d:0.0,p:3.6},{d:0.0,p:35.71},{d:0.0,p:121.11},{d:0.0,p:9.07},{d:0.0,p:35.66},
    {d:0.0,p:5.56},{d:0.0,p:120.94},{d:0.0,p:12.49},{d:0.0,p:76.09},{d:0.0,p:109.75},
    {d:0.0,p:36.4},{d:0.0,p:87.48},{d:0.0,p:5.62},{d:0.0,p:14.71},{d:0.0,p:9.78},
    {d:0.0,p:39.89},{d:0.0,p:2.71},{d:0.0,p:26.9},{d:0.0,p:55.84},{d:0.0,p:13.88},
    {d:0.0,p:2.63},{d:0.0,p:792.27},{d:0.0,p:15.4},{d:0.0,p:31.1},{d:0.0,p:3.03},
    {d:0.0,p:6.87},{d:0.0,p:6.88},{d:0.0,p:6.07},{d:0.0,p:26.65},{d:0.0,p:76.25},
    {d:0.0,p:385.38},{d:0.0,p:75.97},{d:0.0,p:64.52},{d:0.0,p:1.45},{d:0.0,p:10.05},
    {d:0.0,p:3.11},{d:0.0,p:1.71},{d:0.0,p:7.31},{d:0.0,p:14.63},{d:0.0,p:68.82},
    {d:0.0,p:13.45},{d:0.0,p:23.23},{d:0.0,p:4.49},{d:0.0,p:6.66},{d:0.0,p:60.88},
    {d:0.1,p:313.26},{d:0.15,p:84.29},
    {d:0.2,p:18.12},{d:0.2,p:3.63},{d:0.2,p:-43.73},{d:0.2,p:27.25},{d:0.2,p:1.36},
    {d:0.2,p:3.63},{d:0.2,p:5.2},{d:0.2,p:23.84},{d:0.2,p:1.01},{d:0.2,p:10.79},
    {d:0.2,p:1.29},{d:0.2,p:46.1},{d:0.2,p:17.37},{d:0.2,p:1.58},{d:0.2,p:7.63},
    {d:0.2,p:18.68},{d:0.2,p:10.39},{d:0.2,p:67.26},{d:0.2,p:9.25},{d:0.2,p:0.47},
    {d:0.2,p:17.19},{d:0.2,p:1.31},{d:0.2,p:-27.29},{d:0.2,p:-1.35},{d:0.2,p:10.98},
    {d:0.2,p:9.83},{d:0.2,p:10.26},{d:0.2,p:82.5},{d:0.2,p:0.34},{d:0.2,p:4.1},
    {d:0.2,p:15.61},{d:0.2,p:15.11},{d:0.2,p:2.69},{d:0.2,p:4.24},{d:0.2,p:-10.39},
    {d:0.2,p:-6.1},{d:0.2,p:19.99},{d:0.2,p:0.84},{d:0.2,p:38.57},{d:0.2,p:17.76},
    {d:0.2,p:2.88},{d:0.2,p:16.7},{d:0.2,p:-6.93},{d:0.2,p:3.63},{d:0.2,p:4.1},
    {d:0.2,p:69.0},{d:0.2,p:-1.5},{d:0.2,p:11.45},{d:0.2,p:158.58},{d:0.2,p:9.56},
    {d:0.2,p:-10.92},{d:0.2,p:20.58},{d:0.2,p:4.5},{d:0.2,p:10.92},{d:0.2,p:19.6},
    {d:0.2,p:2.13},{d:0.2,p:5.44},{d:0.2,p:1.53},{d:0.2,p:13.44},{d:0.2,p:4.91},
    {d:0.2,p:26.87},{d:0.2,p:1.24},{d:0.2,p:0.6},{d:0.2,p:83.21},{d:0.2,p:8.87},
    {d:0.2,p:-2.1},{d:0.2,p:46.63},{d:0.2,p:8.55},{d:0.2,p:1.75},{d:0.2,p:43.2},
    {d:0.2,p:-3.26},{d:0.2,p:11.28},{d:0.2,p:19.79},{d:0.2,p:3.87},{d:0.2,p:30.47},
    {d:0.2,p:2.25},{d:0.2,p:6.71},{d:0.2,p:3.98},{d:0.2,p:36.69},{d:0.2,p:18.34},
    {d:0.2,p:4.03},{d:0.2,p:27.72},{d:0.2,p:2.0},{d:0.2,p:0.91},{d:0.2,p:1.17},
    {d:0.2,p:1.37},{d:0.2,p:54.59},{d:0.2,p:1.91},{d:0.2,p:25.19},{d:0.2,p:2.38},
    {d:0.2,p:2.44},{d:0.2,p:-25.05},{d:0.2,p:4.39},{d:0.2,p:20.16},{d:0.2,p:2.93},
    {d:0.2,p:78.4},{d:0.2,p:1.4},{d:0.2,p:21.42},{d:0.2,p:6.75},{d:0.2,p:11.92},
    {d:0.2,p:17.54},{d:0.2,p:5.88},{d:0.2,p:0.48},{d:0.2,p:0.59},{d:0.2,p:-43.83},
    {d:0.2,p:2.51},{d:0.2,p:-23.49},{d:0.2,p:944.99},{d:0.2,p:0.86},{d:0.2,p:77.75},
    {d:0.2,p:-13.29},{d:0.2,p:8.77},{d:0.2,p:60.5},{d:0.2,p:1.81},{d:0.2,p:19.76},
    {d:0.2,p:12.42},{d:0.2,p:204.07},{d:0.2,p:-6.53},{d:0.2,p:-16.61},{d:0.2,p:6.0},
    {d:0.2,p:-21.47},{d:0.2,p:7.74},{d:0.2,p:-58.69},{d:0.2,p:2.99},{d:0.2,p:5.19},
    {d:0.2,p:0.29},{d:0.2,p:66.64},{d:0.2,p:252.59},{d:0.2,p:8.92},{d:0.2,p:33.86},
    {d:0.2,p:5.64},{d:0.2,p:-7.2},{d:0.2,p:20.45},{d:0.2,p:-4.06},{d:0.2,p:60.46},
    {d:0.2,p:-12.41},{d:0.2,p:4.47},{d:0.2,p:36.4},{d:0.2,p:485.99},{d:0.2,p:49.5},
    {d:0.2,p:1906.48},{d:0.2,p:-0.21},{d:0.2,p:1.68},{d:0.2,p:95.99},{d:0.2,p:2.77},
    {d:0.2,p:376.11},{d:0.2,p:-18.45},{d:0.2,p:5.2},{d:0.2,p:13.72},{d:0.2,p:5.78},
    {d:0.2,p:3.63},{d:0.2,p:28.08},{d:0.2,p:22.3},{d:0.2,p:9.75},{d:0.2,p:3.25},
    {d:0.2,p:95.59},{d:0.2,p:54.4},{d:0.2,p:9.69},{d:0.2,p:1.68},{d:0.2,p:3.43},
    {d:0.2,p:8.67},{d:0.2,p:2.8},{d:0.2,p:124.48},
    {d:0.3,p:-18.56},{d:0.3,p:-8.58},{d:0.3,p:-15.22},{d:0.3,p:-12.06},{d:0.3,p:-14.87},
    {d:0.3,p:-24.86},{d:0.3,p:-117.88},
    {d:0.32,p:-27.26},
    {d:0.4,p:-374.99},{d:0.4,p:-52.64},{d:0.4,p:-75.83},{d:0.4,p:-50.39},{d:0.4,p:-66.23},
    {d:0.4,p:-114.0},{d:0.4,p:-249.32},{d:0.4,p:-120.29},
    {d:0.5,p:-53.29},
    {d:0.6,p:-3.94},{d:0.6,p:-356.73},{d:0.6,p:-75.84},{d:0.6,p:-10.17},{d:0.6,p:-19.86},
    {d:0.6,p:-14.39},
    {d:0.7,p:-643.71},{d:0.7,p:-4.2},{d:0.7,p:-13.39},{d:0.7,p:-1306.55},{d:0.7,p:-4.52},
    {d:0.7,p:-2.18},{d:0.7,p:-5.86},{d:0.7,p:-12.35},{d:0.7,p:-1065.37},{d:0.7,p:-1.91},
    {d:0.7,p:-4.59},
    {d:0.8,p:-3.46},{d:0.8,p:-39.8},{d:0.8,p:-13.72},{d:0.8,p:-52.83},{d:0.8,p:-30.87},
    {d:0.8,p:-10.15},{d:0.8,p:-7.82},{d:0.8,p:-123.86},{d:0.8,p:-25.65}
  ],

  // ── Forecast Data (from Prophet model) ────────────────────
  forecast: [
    {date:"2014-01",actual:14236.90,forecast:21228.90,lower:9200.23,upper:33655.60},
    {date:"2014-02",actual:4519.89,forecast:11641.82,lower:-190.13,upper:24579.66},
    {date:"2014-03",actual:55691.01,forecast:41072.92,lower:27905.72,upper:54232.04},
    {date:"2014-04",actual:28295.35,forecast:28296.37,lower:14875.56,upper:40367.27},
    {date:"2014-05",actual:23648.29,forecast:28136.36,lower:15927.40,upper:40674.64},
    {date:"2014-06",actual:34595.13,forecast:29685.94,lower:15903.43,upper:42225.48},
    {date:"2014-07",actual:33946.39,forecast:29375.96,lower:15966.35,upper:41735.22},
    {date:"2014-08",actual:27909.47,forecast:34125.53,lower:19772.90,upper:45929.69},
    {date:"2014-09",actual:81777.35,forecast:81757.11,lower:68935.92,upper:95155.43},
    {date:"2014-10",actual:31453.39,forecast:36733.99,lower:23838.71,upper:50063.37},
    {date:"2014-11",actual:78628.72,forecast:71845.12,lower:58484.54,upper:84635.96},
    {date:"2014-12",actual:69545.62,forecast:62986.56,lower:48515.07,upper:74455.78},
    {date:"2015-01",actual:18174.08,forecast:19458.24,lower:6535.71,upper:32963.33},
    {date:"2015-02",actual:11951.41,forecast:15417.87,lower:3565.70,upper:26744.07},
    {date:"2015-03",actual:38726.25,forecast:47840.21,lower:35377.95,upper:60050.18},
    {date:"2015-04",actual:34195.21,forecast:33812.86,lower:21759.06,upper:46852.89},
    {date:"2015-05",actual:30131.69,forecast:27033.00,lower:14925.38,upper:40090.56},
    {date:"2015-06",actual:24797.29,forecast:32268.66,lower:20352.47,upper:45546.92},
    {date:"2015-07",actual:28765.33,forecast:33805.82,lower:20734.28,upper:46499.23},
    {date:"2015-08",actual:36898.33,forecast:41573.46,lower:28740.51,upper:54087.91},
    {date:"2015-09",actual:64595.92,forecast:66414.77,lower:54110.46,upper:78796.56},
    {date:"2015-10",actual:31404.92,forecast:35041.81,lower:22915.08,upper:48227.40},
    {date:"2015-11",actual:75972.56,forecast:85541.62,lower:72698.36,upper:97657.12},
    {date:"2015-12",actual:74919.52,forecast:72039.03,lower:59040.21,upper:83791.46},
    {date:"2016-01",actual:18542.49,forecast:17150.38,lower:4146.81,upper:30955.00},
    {date:"2016-02",actual:22978.82,forecast:20455.35,lower:8106.72,upper:34069.98},
    {date:"2016-03",actual:51715.88,forecast:50643.15,lower:38109.01,upper:63639.83},
    {date:"2016-04",actual:38750.04,forecast:32710.59,lower:20184.25,upper:46314.55},
    {date:"2016-05",actual:56987.73,forecast:48291.65,lower:35370.07,upper:61647.72},
    {date:"2016-06",actual:40344.53,forecast:42701.45,lower:29914.14,upper:54571.79},
    {date:"2016-07",actual:39261.96,forecast:37936.54,lower:24960.35,upper:51280.10},
    {date:"2016-08",actual:31115.37,forecast:38352.78,lower:25049.02,upper:51228.53},
    {date:"2016-09",actual:73410.02,forecast:71843.74,lower:59012.97,upper:84841.03},
    {date:"2016-10",actual:59687.74,forecast:64924.69,lower:52117.33,upper:78374.21},
    {date:"2016-11",actual:79411.97,forecast:87748.79,lower:74635.18,upper:100716.66},
    {date:"2016-12",actual:96999.04,forecast:84996.02,lower:71798.84,upper:97119.60},
    {date:"2017-01",actual:43971.37,forecast:39618.85,lower:27200.79,upper:52062.49},
    {date:"2017-02",actual:20301.13,forecast:15227.97,lower:1834.81,upper:29360.64},
    {date:"2017-03",actual:58872.35,forecast:62425.40,lower:49158.67,upper:75221.04},
    {date:"2017-04",actual:36521.54,forecast:41765.62,lower:28424.37,upper:54222.04},
    {date:"2017-05",actual:44261.11,forecast:50855.72,lower:36821.30,upper:64239.92},
    {date:"2017-06",actual:52981.73,forecast:48665.55,lower:35798.21,upper:61929.96},
    {date:"2017-07",actual:45264.42,forecast:45593.58,lower:32749.18,upper:59374.55},
    {date:"2017-08",actual:63120.89,forecast:49657.25,lower:37461.32,upper:61825.53},
    {date:"2017-09",actual:87866.65,forecast:87827.82,lower:75490.03,upper:101147.67},
    {date:"2017-10",actual:77776.92,forecast:67350.78,lower:53418.22,upper:80433.92},
    {date:"2017-11",actual:118447.82,forecast:108709.18,lower:95299.59,upper:121060.82},
    {date:"2017-12",actual:83829.32,forecast:100152.06,lower:86998.72,upper:112870.38}
  ],

  // ── Future 3-Month Forecast ───────────────────────────────
  futureForecast: [
    {date:"2018-01", forecast:38610.59, lower:26650.92, upper:50970.06},
    {date:"2018-02", forecast:21188.70, lower:7633.35,  upper:34745.71},
    {date:"2018-03", forecast:74801.09, lower:61983.86, upper:86962.88}
  ],

  // ── Category Monthly Data (for category-level forecasts) ──
  categoryMonthly: {
    "Furniture": [
      {date:"2014-01",sales:6242.52},{date:"2014-02",sales:1839.66},{date:"2014-03",sales:14573.96},
      {date:"2014-04",sales:7944.84},{date:"2014-05",sales:6912.79},{date:"2014-06",sales:13206.13},
      {date:"2014-07",sales:10821.05},{date:"2014-08",sales:7320.35},{date:"2014-09",sales:23816.48},
      {date:"2014-10",sales:12304.25},{date:"2014-11",sales:21564.87},{date:"2014-12",sales:30645.97},
      {date:"2015-01",sales:11739.94},{date:"2015-02",sales:3134.37},{date:"2015-03",sales:12499.78},
      {date:"2015-04",sales:10475.70},{date:"2015-05",sales:9374.95},{date:"2015-06",sales:7714.18},
      {date:"2015-07",sales:13674.42},{date:"2015-08",sales:9638.59},{date:"2015-09",sales:26273.02},
      {date:"2015-10",sales:12026.62},{date:"2015-11",sales:30880.83},{date:"2015-12",sales:23085.82},
      {date:"2016-01",sales:7622.74},{date:"2016-02",sales:3925.55},{date:"2016-03",sales:12801.09},
      {date:"2016-04",sales:13212.09},{date:"2016-05",sales:15119.84},{date:"2016-06",sales:13070.57},
      {date:"2016-07",sales:13068.52},{date:"2016-08",sales:12483.23},{date:"2016-09",sales:27262.88},
      {date:"2016-10",sales:11872.58},{date:"2016-11",sales:31783.63},{date:"2016-12",sales:36678.71},
      {date:"2017-01",sales:5964.03},{date:"2017-02",sales:6866.34},{date:"2017-03",sales:10893.44},
      {date:"2017-04",sales:9065.96},{date:"2017-05",sales:16957.56},{date:"2017-06",sales:19008.59},
      {date:"2017-07",sales:11813.02},{date:"2017-08",sales:15441.87},{date:"2017-09",sales:29028.21},
      {date:"2017-10",sales:21884.07},{date:"2017-11",sales:37056.72},{date:"2017-12",sales:31407.47}
    ],
    "Office Supplies": [
      {date:"2014-01",sales:4851.08},{date:"2014-02",sales:1071.72},{date:"2014-03",sales:8605.88},
      {date:"2014-04",sales:11155.07},{date:"2014-05",sales:7135.62},{date:"2014-06",sales:12953.04},
      {date:"2014-07",sales:15121.21},{date:"2014-08",sales:11379.46},{date:"2014-09",sales:27423.30},
      {date:"2014-10",sales:7211.13},{date:"2014-11",sales:26862.44},{date:"2014-12",sales:18006.46},
      {date:"2015-01",sales:1808.78},{date:"2015-02",sales:5368.07},{date:"2015-03",sales:15882.55},
      {date:"2015-04",sales:12558.56},{date:"2015-05",sales:9113.74},{date:"2015-06",sales:10647.75},
      {date:"2015-07",sales:4719.94},{date:"2015-08",sales:11735.11},{date:"2015-09",sales:19305.77},
      {date:"2015-10",sales:8673.41},{date:"2015-11",sales:21218.13},{date:"2015-12",sales:16201.67},
      {date:"2016-01",sales:5299.68},{date:"2016-02",sales:6794.35},{date:"2016-03",sales:17346.93},
      {date:"2016-04",sales:10647.45},{date:"2016-05",sales:13035.20},{date:"2016-06",sales:10901.81},
      {date:"2016-07",sales:12924.44},{date:"2016-08",sales:8959.74},{date:"2016-09",sales:23263.74},
      {date:"2016-10",sales:16281.79},{date:"2016-11",sales:20487.28},{date:"2016-12",sales:37997.57},
      {date:"2017-01",sales:21274.29},{date:"2017-02",sales:7407.77},{date:"2017-03",sales:14550.29},
      {date:"2017-04",sales:15072.19},{date:"2017-05",sales:13736.96},{date:"2017-06",sales:16912.04},
      {date:"2017-07",sales:10241.47},{date:"2017-08",sales:30059.85},{date:"2017-09",sales:31895.84},
      {date:"2017-10",sales:23037.19},{date:"2017-11",sales:31472.34},{date:"2017-12",sales:30436.94}
    ],
    "Technology": [
      {date:"2014-01",sales:3143.29},{date:"2014-02",sales:1608.51},{date:"2014-03",sales:32511.17},
      {date:"2014-04",sales:9195.43},{date:"2014-05",sales:9599.88},{date:"2014-06",sales:8435.96},
      {date:"2014-07",sales:8004.13},{date:"2014-08",sales:9209.66},{date:"2014-09",sales:30537.57},
      {date:"2014-10",sales:11938.02},{date:"2014-11",sales:30201.41},{date:"2014-12",sales:20893.19},
      {date:"2015-01",sales:4625.35},{date:"2015-02",sales:3448.97},{date:"2015-03",sales:10343.92},
      {date:"2015-04",sales:11160.95},{date:"2015-05",sales:11643.00},{date:"2015-06",sales:6435.37},
      {date:"2015-07",sales:10370.97},{date:"2015-08",sales:15524.63},{date:"2015-09",sales:19017.13},
      {date:"2015-10",sales:10704.89},{date:"2015-11",sales:23873.60},{date:"2015-12",sales:35632.03},
      {date:"2016-01",sales:5620.07},{date:"2016-02",sales:12258.91},{date:"2016-03",sales:21567.85},
      {date:"2016-04",sales:14890.50},{date:"2016-05",sales:28832.69},{date:"2016-06",sales:16372.15},
      {date:"2016-07",sales:13269.00},{date:"2016-08",sales:9672.40},{date:"2016-09",sales:22883.41},
      {date:"2016-10",sales:31533.37},{date:"2016-11",sales:27141.06},{date:"2016-12",sales:22322.76},
      {date:"2017-01",sales:16733.05},{date:"2017-02",sales:6027.02},{date:"2017-03",sales:33428.62},
      {date:"2017-04",sales:12383.39},{date:"2017-05",sales:13566.59},{date:"2017-06",sales:17061.10},
      {date:"2017-07",sales:23209.93},{date:"2017-08",sales:17619.16},{date:"2017-09",sales:26942.60},
      {date:"2017-10",sales:32855.66},{date:"2017-11",sales:49918.77},{date:"2017-12",sales:21984.91}
    ]
  },

  // ── Seasonality Coefficients (monthly multipliers for prediction engine) ──
  // Derived from Prophet model's yearly seasonality component
  // These represent how each month's revenue typically scales relative to average
  seasonality: {
    "All": [0.55, 0.30, 1.05, 0.60, 0.68, 0.66, 0.64, 0.70, 1.35, 0.87, 1.55, 1.40],
    "Furniture":       [0.45, 0.22, 0.70, 0.55, 0.66, 0.72, 0.67, 0.61, 1.45, 0.79, 1.65, 1.67],
    "Office Supplies": [0.52, 0.32, 0.92, 0.76, 0.66, 0.76, 0.65, 0.75, 1.48, 0.85, 1.45, 1.55],
    "Technology":      [0.48, 0.30, 1.38, 0.68, 0.82, 0.62, 0.65, 0.69, 1.28, 1.18, 1.62, 1.22]
  },

  // ── Model Performance Metrics ─────────────────────────────
  modelMetrics: {
    mae: 10874,
    rmse: 13547,
    mape: 14.2,
    testMonths: 3
  }
};
