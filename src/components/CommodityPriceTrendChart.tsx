import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Info,
  BadgePercent,
  CheckCircle,
} from 'lucide-react';
import { Product } from '../types';

interface CommodityPriceTrendChartProps {
  product: Product;
}

interface PriceDataPoint {
  dayIndex: number;
  dateStr: string;
  fullDateStr: string;
  price: number;
  marketAvg: number;
}

export const CommodityPriceTrendChart: React.FC<CommodityPriceTrendChartProps> = ({
  product,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');

  // Generate deterministic 30-day historical commodity trend data based on product id & current price
  const fullTrendData: PriceDataPoint[] = useMemo(() => {
    const basePrice = product.discountPrice || product.originalPrice || 25000;
    const now = new Date();
    const dataPoints: PriceDataPoint[] = [];

    // Deterministic pseudo-random seed from product id string
    let seed = 0;
    for (let i = 0; i < product.id.length; i++) {
      seed = (seed * 31 + product.id.charCodeAt(i)) % 10000;
    }

    // Fluctuations wave parameters
    const volatility = 0.08; // 8% range variance
    const trendSlope = ((seed % 10) - 4) * 0.003; // slight upward or downward market momentum

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      // Smooth sine wave + pseudo-random fluctuation
      const dayFactor = (30 - i) * trendSlope;
      const wave = Math.sin((i + (seed % 7)) * 0.6) * volatility;
      const pseudoNoise = (((seed + i * 17) % 100) - 50) / 1000;

      // Ensure last point (i=0, today) matches current product discountPrice exactly
      let priceVal: number;
      if (i === 0) {
        priceVal = basePrice;
      } else {
        const factor = 1 - dayFactor + wave + pseudoNoise;
        priceVal = Math.round((basePrice * factor) / 500) * 500;
      }

      // Ensure price stays positive and realistic
      priceVal = Math.max(1000, priceVal);

      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      const dayDate = d.getDate();
      const monthShort = d.toLocaleDateString('id-ID', { month: 'short' });

      dataPoints.push({
        dayIndex: 30 - i,
        dateStr: i === 0 ? 'Hari Ini' : `${dayDate} ${monthShort}`,
        fullDateStr: `${dayName}, ${dayDate} ${d.toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        })}`,
        price: priceVal,
        marketAvg: Math.round((priceVal * (1 + ((seed % 5) - 2) * 0.02)) / 500) * 500,
      });
    }

    return dataPoints;
  }, [product.id, product.discountPrice, product.originalPrice]);

  // Filtered dataset according to selected timeframe (7d, 14d, 30d)
  const displayData = useMemo(() => {
    if (timeRange === '7d') {
      return fullTrendData.slice(-7);
    }
    if (timeRange === '14d') {
      return fullTrendData.slice(-14);
    }
    return fullTrendData;
  }, [fullTrendData, timeRange]);

  // Compute key statistics
  const stats = useMemo(() => {
    const prices = displayData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    const firstPrice = prices[0];
    const currentPrice = prices[prices.length - 1];
    const priceDiff = currentPrice - firstPrice;
    const percentChange = firstPrice > 0 ? (priceDiff / firstPrice) * 100 : 0;

    return {
      minPrice,
      maxPrice,
      avgPrice,
      currentPrice,
      priceDiff,
      percentChange,
      isUp: priceDiff >= 0,
    };
  }, [displayData]);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-3">
      {/* Title & Range Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Activity className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-xs text-stone-900 leading-none">
                Tren Harga Komoditas
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Recharts Live
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">
              Grafik fluktuasi pasar komoditas 30 hari terakhir
            </p>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-xl text-[10px] font-bold text-stone-600">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-2 py-1 rounded-lg transition ${
              timeRange === '7d'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'hover:text-stone-900'
            }`}
          >
            7 Hari
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('14d')}
            className={`px-2 py-1 rounded-lg transition ${
              timeRange === '14d'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'hover:text-stone-900'
            }`}
          >
            14 Hari
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-2 py-1 rounded-lg transition ${
              timeRange === '30d'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'hover:text-stone-900'
            }`}
          >
            30 Hari
          </button>
        </div>
      </div>

      {/* Summary Stat Chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[9px] font-bold text-stone-400 uppercase tracking-tight">
            Harga Terendah
          </div>
          <div className="text-xs font-black text-stone-800 mt-0.5">
            Rp {stats.minPrice.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[9px] font-bold text-stone-400 uppercase tracking-tight">
            Rata-rata {timeRange === '7d' ? '7H' : timeRange === '14d' ? '14H' : '30H'}
          </div>
          <div className="text-xs font-black text-stone-800 mt-0.5">
            Rp {stats.avgPrice.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-[9px] font-bold text-stone-400 uppercase tracking-tight">
            Harga Tertinggi
          </div>
          <div className="text-xs font-black text-stone-800 mt-0.5">
            Rp {stats.maxPrice.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart Component */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-700">Harga Sekarang:</span>
            <span className="text-sm font-black text-emerald-800">
              Rp {stats.currentPrice.toLocaleString('id-ID')}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              stats.isUp
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            {stats.isUp ? (
              <>
                <TrendingUp className="w-3 h-3 text-amber-700" />
                <span>+{stats.percentChange.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3 h-3 text-emerald-700" />
                <span>{stats.percentChange.toFixed(1)}%</span>
              </>
            )}
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e7e5e4"
              />

              <XAxis
                dataKey="dateStr"
                tick={{ fontSize: 9, fill: '#78716c' }}
                tickLine={false}
                axisLine={{ stroke: '#d6d3d1' }}
                interval={timeRange === '7d' ? 1 : timeRange === '14d' ? 2 : 4}
              />

              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 9, fill: '#78716c' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${Math.round(val / 1000)}k`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PriceDataPoint;
                    const diffFromNow = data.price - stats.currentPrice;

                    return (
                      <div className="bg-stone-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl border border-stone-800 space-y-1">
                        <div className="text-[10px] text-stone-400 font-medium">
                          {data.fullDateStr}
                        </div>
                        <div className="text-sm font-black text-amber-300">
                          Rp {data.price.toLocaleString('id-ID')}
                        </div>
                        {diffFromNow !== 0 && (
                          <div className="text-[10px] text-stone-300 flex items-center gap-1">
                            <span>vs Hari ini:</span>
                            <span
                              className={
                                diffFromNow < 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
                              }
                            >
                              {diffFromNow > 0 ? `+Rp ${diffFromNow.toLocaleString('id-ID')}` : `-Rp ${Math.abs(diffFromNow).toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#047857"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPrice)"
                activeDot={{ r: 5, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Insight Note */}
      <div className="bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl flex items-start gap-2 text-[10px] text-emerald-950 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Analisis Pasar Agrikultur: </span>
          {stats.currentPrice <= stats.avgPrice ? (
            <span>
              Harga saat ini <strong>di bawah rata-rata 30 hari</strong> (potensi hemat bagi pembeli atau waktu tepat untuk pengadaan saprotan).
            </span>
          ) : (
            <span>
              Harga komoditas sedang <strong>di atas rata-rata 30 hari</strong> (menguntungkan bagi petani produsen untuk menjual hasil panen).
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
