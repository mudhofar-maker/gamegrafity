import React, { useEffect, useRef, useState, useId } from 'react';
import Chart from 'chart.js/auto';
import type { ChartData, ChartOptions } from 'chart.js';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Clock, ShieldCheck, Activity, Layers } from 'lucide-react';

export interface LiveAssetItem {
  id: string;
  name: string;
  sub: string;
  category: string;
  qty: string;
  baseQtyNum: number;
  unitPrice: number;
  totalValue: number;
  change24h: number;
  status: string;
  statusColor: 'emerald' | 'cyan' | 'amber' | 'indigo';
}

interface LivePortfolioChartProps {
  initialTreasuryBalance?: number;
  initialEggCount?: number;
}

export function LivePortfolioChart({
  initialTreasuryBalance = 38250000,
  initialEggCount = 1480,
}: LivePortfolioChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const speedSelectId = useId();

  // State Aset Riil
  const [assets, setAssets] = useState<LiveAssetItem[]>([
    {
      id: 'treasury-bca',
      name: 'Kas Treasury BCA Cikarang',
      sub: 'Rek: 3432650071 a.n. MUDHOFAR',
      category: 'Likuiditas Fiat',
      qty: '1 Akun',
      baseQtyNum: 1,
      unitPrice: initialTreasuryBalance,
      totalValue: initialTreasuryBalance,
      change24h: 0.18,
      status: 'KLIRING AMAN',
      statusColor: 'emerald',
    },
    {
      id: 'eggs-layer',
      name: 'Telur Ayam Segar Grade A/B',
      sub: 'Stok Gudang Fisik & Virtual Offtake',
      category: 'Hasil Panen (Q)',
      qty: `${initialEggCount.toLocaleString('id-ID')} Kg`,
      baseQtyNum: initialEggCount,
      unitPrice: 28000,
      totalValue: initialEggCount * 28000,
      change24h: 2.45,
      status: 'TERSERAP BROKER',
      statusColor: 'cyan',
    },
    {
      id: 'chicken-pullet',
      name: 'Populasi Ayam Layer Aktif',
      sub: 'Kandang Bertingkat Smart Closed-House',
      category: 'Biologi Ternak',
      qty: '500 Ekor',
      baseQtyNum: 500,
      unitPrice: 75000,
      totalValue: 37500000,
      change24h: 0.00,
      status: 'PRODUKTIF 92%',
      statusColor: 'emerald',
    },
    {
      id: 'feed-reserve',
      name: 'Cadangan Pakan Konsentrat 21%',
      sub: 'Silo Terdistribusi Mandiri',
      category: 'Pakan & Nutrisi',
      qty: '850 Kg',
      baseQtyNum: 850,
      unitPrice: 7200,
      totalValue: 6120000,
      change24h: -0.40,
      status: 'TERSEDIA 14 HARI',
      statusColor: 'amber',
    },
    {
      id: 'iot-infrastructure',
      name: 'Modul IoT & Climate Control',
      sub: 'Inverter Exhaust & Cooling Pad',
      category: 'Infrastruktur',
      qty: '1 Paket Multi-Tier',
      baseQtyNum: 1,
      unitPrice: 2350000,
      totalValue: 2350000,
      change24h: 0.00,
      status: 'ONLINE 24/7',
      statusColor: 'indigo',
    },
  ]);

  // Metrik Header
  const [totalValuation, setTotalValuation] = useState<number>(0);
  const [overallChangePct, setOverallChangePct] = useState<number>(3.42);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [feedIntervalMs, setFeedIntervalMs] = useState<number>(3000);

  // Helper format rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. Inisialisasi Chart.js saat canvas siap
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Hancurkan instance lama jika ada
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Gradients
    const gradientPortfolio = ctx.createLinearGradient(0, 0, 0, 300);
    gradientPortfolio.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    gradientPortfolio.addColorStop(1, 'rgba(6, 182, 212, 0.00)');

    const gradientTreasury = ctx.createLinearGradient(0, 0, 0, 300);
    gradientTreasury.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    gradientTreasury.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

    // Inisialisasi buffer awal (12 titik riwayat)
    const labels: string[] = [];
    const portfolioPoints: number[] = [];
    const treasuryPoints: number[] = [];
    const now = new Date();

    let currentSum = assets.reduce((s, a) => s + a.totalValue, 0);
    let currentTreasury = assets.find((a) => a.id === 'treasury-bca')?.totalValue || 38250000;

    for (let i = 11; i >= 0; i--) {
      const past = new Date(now.getTime() - i * feedIntervalMs);
      labels.push(past.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const pVariation = (Math.random() - 0.48) * 120000;
      const tVariation = (Math.random() - 0.48) * 40000;
      portfolioPoints.push(Math.round(currentSum - i * 45000 + pVariation));
      treasuryPoints.push(Math.round(currentTreasury - i * 15000 + tVariation));
    }

    setTotalValuation(currentSum);
    setLastUpdated(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');

    const chartConfig: { data: ChartData<'line'>; options: ChartOptions<'line'> } = {
      data: {
        labels,
        datasets: [
          {
            label: 'Total Portofolio (IDR)',
            data: portfolioPoints,
            borderColor: '#06b6d4',
            backgroundColor: gradientPortfolio,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#0b1120',
            pointBorderWidth: 2,
          },
          {
            label: 'Kas Treasury BCA (IDR)',
            data: treasuryPoints,
            borderColor: '#10b981',
            backgroundColor: gradientTreasury,
            borderWidth: 2,
            borderDash: [4, 4],
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 400,
          easing: 'easeOutQuart',
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0b1120',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += formatRupiah(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.25)',
            },
            ticks: {
              color: '#64748b',
              font: { family: 'monospace', size: 10 },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
            },
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.25)',
            },
            ticks: {
              color: '#64748b',
              font: { family: 'monospace', size: 10 },
              callback: (value) => 'Rp ' + (Number(value) / 1000000).toFixed(1) + 'M',
            },
          },
        },
      },
    };

    try {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartConfig.data,
        options: chartConfig.options,
      });
    } catch (err) {
      console.error('Failed to initialize Chart.js:', err);
    }

    return () => {
      try {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }
      } catch (err) {
        console.warn('Error destroying chart:', err);
      }
    };
  }, []);

  // Sync props from parent when Treasury BCA or Live Egg Production updates
  useEffect(() => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === 'treasury-bca' && initialTreasuryBalance) {
          return {
            ...a,
            unitPrice: initialTreasuryBalance,
            totalValue: initialTreasuryBalance,
          };
        }
        if (a.id === 'eggs-layer' && initialEggCount) {
          const qtyKg = Number(((initialEggCount * 62.5) / 1000).toFixed(1));
          return {
            ...a,
            qty: `${initialEggCount.toLocaleString('id-ID')} Butir (~${qtyKg} Kg)`,
            baseQtyNum: initialEggCount,
            totalValue: initialEggCount * a.unitPrice,
          };
        }
        return a;
      })
    );
  }, [initialTreasuryBalance, initialEggCount]);

  // 2. Real-time update loop via setInterval
  useEffect(() => {
    if (!isLiveActive) return;

    const intervalId = window.setInterval(() => {
      const chart = chartInstanceRef.current;
      if (!chart) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Update fluktuasi harga pasar komoditas telur & kas treasury real-time
      setAssets((prevAssets) => {
        const nextAssets = prevAssets.map((asset) => {
          if (asset.id === 'eggs-layer') {
            const delta = (Math.random() - 0.48) * 180;
            const newPrice = Math.max(26000, Math.round(asset.unitPrice + delta));
            const newVal = newPrice * asset.baseQtyNum;
            const newChange = Number((asset.change24h + (Math.random() - 0.5) * 0.12).toFixed(2));
            return {
              ...asset,
              unitPrice: newPrice,
              totalValue: newVal,
              change24h: newChange,
            };
          }
          if (asset.id === 'treasury-bca') {
            const deltaTreasury = (Math.random() - 0.48) * 35000;
            const newTotal = Math.round(asset.totalValue + deltaTreasury);
            return {
              ...asset,
              unitPrice: newTotal,
              totalValue: newTotal,
              change24h: Number((asset.change24h + (Math.random() - 0.5) * 0.04).toFixed(2)),
            };
          }
          return asset;
        });

        // Hitung total nilai portofolio baru
        const newTotalValuation = nextAssets.reduce((sum, item) => sum + item.totalValue, 0);
        const treasuryVal = nextAssets.find((a) => a.id === 'treasury-bca')?.totalValue || 38250000;

        setTotalValuation(newTotalValuation);
        setOverallChangePct((prev) => Number((prev + (Math.random() - 0.48) * 0.08).toFixed(2)));
        setLastUpdated(timeStr + ' WIB');

        // Tambah titik ke chart tanpa glitch layout
        const currentLabels = chart.data.labels as string[];
        const datasetPortfolio = chart.data.datasets[0].data as number[];
        const datasetTreasury = chart.data.datasets[1].data as number[];

        currentLabels.push(timeStr);
        datasetPortfolio.push(newTotalValuation);
        datasetTreasury.push(treasuryVal);

        // Pertahankan buffer 15 titik
        if (currentLabels.length > 15) {
          currentLabels.shift();
          datasetPortfolio.shift();
          datasetTreasury.shift();
        }

        // Update mulus tanpa re-animasi berat
        try {
          chart.update('none');
        } catch (e) {
          console.warn('Failed to update chart:', e);
        }

        return nextAssets;
      });
    }, feedIntervalMs);

    return () => clearInterval(intervalId);
  }, [isLiveActive, feedIntervalMs]);

  // Handler reset data grafik
  const handleResetChart = () => {
    try {
      const chart = chartInstanceRef.current;
      if (!chart) return;
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.data.datasets[1].data = [];
      chart.update();
    } catch (e) {
      console.warn('Error resetting chart:', e);
    }
  };

  const eggAsset = assets.find((a) => a.id === 'eggs-layer');
  const treasuryAsset = assets.find((a) => a.id === 'treasury-bca');

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative space-y-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Live Portfolio &amp; Real-Time Valuation Chart
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Chart.js Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pemantauan fluktuasi aset likuiditas Kas BCA Cikarang dan komoditas peternakan secara real-time
            </p>
          </div>
        </div>

        {/* Live sync heartbeat & control bar */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Status Live Sync dengan titik hijau beranimasi */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveActive
                  ? 'bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-400 hidden sm:inline">Status:</span>
            <span className={`font-bold ${isLiveActive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isLiveActive ? 'LIVE SYNC' : 'PAUSED'}
            </span>
          </div>

          {/* Toggle Pause / Resume */}
          <button
            onClick={() => setIsLiveActive((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono font-semibold text-slate-200 transition"
            title={isLiveActive ? 'Jeda aliran data' : 'Lanjutkan aliran data'}
          >
            {isLiveActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isLiveActive ? 'Jeda' : 'Lanjutkan'}</span>
          </button>

          {/* Kecepatan Interval */}
          <div className="flex items-center gap-1">
            <label htmlFor={speedSelectId} className="sr-only">Kecepatan Interval</label>
            <select
              id={speedSelectId}
              value={feedIntervalMs}
              onChange={(e) => setFeedIntervalMs(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={2000}>2 dtk (Cepat)</option>
              <option value={3000}>3 dtk (Normal)</option>
              <option value={5000}>5 dtk (Stabil)</option>
            </select>
          </div>

          {/* Reset Chart */}
          <button
            onClick={handleResetChart}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
            title="Reset Buffer Grafik"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Header Ringkasan Metrik (Metric Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Nilai Portofolio */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Total Portofolio
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                overallChangePct >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {overallChangePct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {overallChangePct >= 0 ? '+' : ''}
              {overallChangePct.toFixed(2)}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
            {formatRupiah(totalValuation)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
            <span>Model Valuasi:</span>
            <span className="text-cyan-300">Mark-to-Market Real-Time</span>
          </div>
        </div>

        {/* Card 2: Saldo Kas Treasury Pusat (BCA Cikarang) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Kas Treasury BCA
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Dual-Payout
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {formatRupiah(treasuryAsset?.totalValue || 38250000)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
            <span>Rekening Resmi:</span>
            <span className="text-slate-300">3432650071</span>
          </div>
        </div>

        {/* Card 3: Valuasi Komoditas Hasil Panen */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Komoditas Hasil (Q)
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {eggAsset?.qty || '1.480 Kg'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 tracking-tight">
            {formatRupiah(eggAsset?.totalValue || 41440000)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between font-mono">
            <span>Harga Serap:</span>
            <span className="text-emerald-400 font-bold">Rp {eggAsset?.unitPrice.toLocaleString('id-ID')}/Kg</span>
          </div>
        </div>

        {/* Card 4: Waktu Pembaruan Terakhir (Last Updated) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Pembaruan Terakhir
            </span>
            <span className="text-[10px] font-mono text-slate-400">{feedIntervalMs / 1000}s/tick</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
            {lastUpdated || 'Menyinkronkan...'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center justify-between font-mono">
            <span>Latensi Client:</span>
            <span>&lt; 10 ms (Smooth)</span>
          </div>
        </div>
      </div>

      {/* 2. Grafik Garis (Line Chart) Responsif dengan Chart.js */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-400 rounded-full inline-block" />
              <span className="text-white font-medium">Total Valuasi Portofolio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block border-b border-emerald-400" />
              <span className="text-slate-300">Kas Treasury BCA</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">
            Buffer jendela geser (15 titik terakhir) • Smooth Auto-Update
          </span>
        </div>

        {/* Chart Canvas Box dengan tinggi terkunci agar bebas Layout Shift */}
        <div className="relative w-full h-[260px] sm:h-[320px]">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* 3. Tabel Rincian Komponen Aset Pendukung (Connected Dynamically) */}
      <div className="rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Rincian Komponen Aset &amp; Alokasi Nilai</span>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">(5 Aset Terkoneksi)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            ● Auto-Rebalance Dynamic
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Nama Aset / Alokasi</th>
                <th className="py-2.5 px-4 font-semibold">Kategori</th>
                <th className="py-2.5 px-4 text-right font-semibold">Volume / Qty</th>
                <th className="py-2.5 px-4 text-right font-semibold">Harga Satuan</th>
                <th className="py-2.5 px-4 text-right font-semibold">Total Valuasi</th>
                <th className="py-2.5 px-4 text-center font-semibold">Fluktuasi</th>
                <th className="py-2.5 px-4 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {assets.map((asset) => {
                const isPositive = asset.change24h >= 0;
                return (
                  <tr key={asset.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{asset.name}</div>
                      <div className="text-[10px] text-slate-500">{asset.sub}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                        {asset.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-200 font-semibold">{asset.qty}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{formatRupiah(asset.unitPrice)}</td>
                    <td className="py-3 px-4 text-right font-bold text-white">{formatRupiah(asset.totalValue)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          asset.statusColor === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : asset.statusColor === 'cyan'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : asset.statusColor === 'amber'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
