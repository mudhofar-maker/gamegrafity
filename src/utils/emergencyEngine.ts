import { BiologicalCycle, EmergencyDirective, FarmBalances } from '../types/farm';
import { formatRupiah } from './formatters';

export function calculateEmergencyDirective(
  cycle: BiologicalCycle,
  balances: FarmBalances
): EmergencyDirective {
  const { cohorts, feedStockKg, electricityDaysRemaining, biosecurityHealth, accumulatedEggs, population } = cycle;
  const feedNeededToday = Math.ceil(population * 0.12);

  // 1. TOP CRITICAL: Sick chicks with virus symptoms -> Must salvage to Junkfood food processor immediately!
  if (cohorts.sickChicksCount > 0) {
    const salvageValue = cohorts.sickChicksCount * 15000;
    const potentialTotalLoss = cohorts.sickChicksCount * 45000;
    return {
      urgencyLevel: 'CRITICAL',
      title: '🚨 DARURAT WABAH: Anak Ayam Terdeteksi Gejala Virus!',
      directiveText: `➔ TINDAKAN UTAMA: Segera Jual ${cohorts.sickChicksCount} Anak Ayam ke Pabrik Olahan / Junkfood!`,
      explanation: `Ditemukan gejala ${cohorts.virusName} (${cohorts.virusSymptoms}). Jika dibiarkan mati di kandang, Anda rugi total ${formatRupiah(potentialTotalLoss)}. Masukkan ke rantai olahan junkfood sekarang untuk menyelamatkan modal ${formatRupiah(salvageValue)}!`,
      actionType: 'JUNKFOOD_SALVAGE',
      actionLabel: `Jual ke Junkfood (${formatRupiah(salvageValue)})`,
      highlightTarget: 'btn-junkfood-salvage',
      financialImpact: `Penyelamatan Modal: +${formatRupiah(salvageValue)} (Mencegah Rugi Total)`,
    };
  }

  // 2. CRITICAL: Feed stock depleted or about to starve
  if (feedStockKg < feedNeededToday) {
    const neededKg = Math.max(10, feedNeededToday * 3);
    const feedCost = 7000 * 10;
    return {
      urgencyLevel: 'CRITICAL',
      title: '⚠️ KRISIS STOK PAKAN: Kawanan Ayam Terancam Kelaparan!',
      directiveText: `➔ TINDAKAN UTAMA: Beli Pakan Konsentrat Segera di Katalog!`,
      explanation: `Pakan tersisa hanya ${feedStockKg} Kg (kebutuhan harian ${feedNeededToday} Kg). Tanpa pakan, produksi telur anjlok 100% dan memicu kanibalisme.`,
      actionType: 'BUY_FEED',
      actionLabel: `Beli Pakan Konsentrat (Rp 7.000/Kg)`,
      highlightTarget: 'catalog-feed-concentrate',
      financialImpact: `Biaya Operasional: -${formatRupiah(feedCost)}`,
    };
  }

  // 3. CRITICAL: Electricity & Ventilation outage in closed-house
  if (electricityDaysRemaining <= 0) {
    return {
      urgencyLevel: 'CRITICAL',
      title: '⚡ DARURAT VENTILASI: Kipas Exhaust & Daya Listrik Mati!',
      directiveText: `➔ TINDAKAN UTAMA: Bayar Sewa Listrik & Ventilasi Kandang Sekarang!`,
      explanation: `Kandang closed-house tanpa blower exhaust berisiko akumulasi gas amonia beracun & heatstroke mematikan dalam hitungan jam.`,
      actionType: 'BUY_ELECTRICITY',
      actionLabel: `Bayar Listrik & Blower (Rp 50.000/Hari)`,
      highlightTarget: 'catalog-electricity-ventilation',
      financialImpact: `Biaya Utilitas: -${formatRupiah(50000)} (Mencegah Kematian Massal)`,
    };
  }

  // 3b. CRITICAL: Heat Stress without AC Conditioner
  if (cycle.acClimateDaysRemaining <= 0 && (cycle.ambientTempC > 27.5 || cycle.heatStressActive)) {
    return {
      urgencyLevel: 'CRITICAL',
      title: '🌡️ DARURAT TERMAL: Suhu Kandang Panas & AC Conditioner Mati!',
      directiveText: `➔ TINDAKAN UTAMA: Sewa AC Conditioner & Pengatur Suhu Api Kandang Sekarang!`,
      explanation: `Suhu kandang melonjak ke ${cycle.ambientTempC.toFixed(1)}°C. Tanpa AC pendingin evaporative, ayam layer mengalami heatstress berat, cangkang telur tipis/pecah, dan tingkat kematian melonjak.`,
      actionType: 'BUY_AC_CLIMATE',
      actionLabel: `Sewa AC & Pemanas Api (Rp 65.000/Hari)`,
      highlightTarget: 'catalog-ac-climate-controller',
      financialImpact: `Biaya Sewa AC: -${formatRupiah(65000)} (Menyelamatkan Kualitas Telur Grade A)`,
    };
  }

  // 4. HIGH: Biosecurity Health dropping
  if (biosecurityHealth < 75) {
    return {
      urgencyLevel: 'HIGH',
      title: '🛡️ BIOSEKURITI MELEMAH: Sanitasi & Kekebalan Kritis!',
      directiveText: `➔ TINDAKAN UTAMA: Berikan Vaksin & Vitamin Biosekuriti Sekarang!`,
      explanation: `Kesehatan kandang turun ke ${biosecurityHealth}%. Sangat rentan terserang wabah ND (Tetelo) & Avian Flu yang dapat memusnahkan seluruh populasi.`,
      actionType: 'CALL_DOCTOR',
      actionLabel: `Beli Vitamin/Vaksin (Rp 25.000)`,
      highlightTarget: 'catalog-vitamin-biosecurity',
      financialImpact: `Investasi Preventif: -${formatRupiah(25000)} (Memulihkan Biosekuriti 100%)`,
    };
  }

  // 5. HIGH: Spent hens (Ayam Afkir Tua) eating expensive feed without producing eggs
  if (cohorts.spentHensAfkirCount > 0) {
    const afkirValue = cohorts.spentHensAfkirCount * 38000;
    return {
      urgencyLevel: 'HIGH',
      title: '🍗 EFISIENSI KANDANG: Ada Ayam Afkir Tua Non-Produksi!',
      directiveText: `➔ TINDAKAN UTAMA: Jual ${cohorts.spentHensAfkirCount} Ekor Ayam Afkir ke Pasar Daging Karkas!`,
      explanation: `Ayam afkir (>72 minggu) tidak lagi bertelur tetapi menghabiskan pakan porsi penuh setiap hari. Segera cairkan menjadi uang tunai!`,
      actionType: 'SELL_SPENT_HENS',
      actionLabel: `Jual Ayam Afkir (+${formatRupiah(afkirValue)})`,
      highlightTarget: 'btn-sell-afkir',
      financialImpact: `Pemasukan Tunai: +${formatRupiah(afkirValue)}`,
    };
  }

  // 6. MEDIUM: Accumulated eggs ready to liquidate
  if (accumulatedEggs >= 60) {
    const eggValue = accumulatedEggs * 2500;
    return {
      urgencyLevel: 'MEDIUM',
      title: '🧺 REAPING PROFIT: Akumulasi Telur Siap Dicairkan!',
      directiveText: `➔ TINDAKAN UTAMA: Cairkan ${accumulatedEggs} Butir Telur ke DANA P2P atau Web3 ETH!`,
      explanation: `Telur di gudang mencapai ${accumulatedEggs} butir senilai ${formatRupiah(eggValue)}. Amankan keuntungan panen Anda tanpa potongan broker.`,
      actionType: 'HARVEST_EGGS',
      actionLabel: `Cairkan Profit Panen (${formatRupiah(eggValue)})`,
      highlightTarget: 'btn-withdraw-eggs',
      financialImpact: `Pencairan Bersih: +${formatRupiah(eggValue)}`,
    };
  }

  // 7. LOW / INFO: Normal operational cycle
  return {
    urgencyLevel: 'INFO',
    title: '✅ KONDISI KANDANG NORMAL & OPTIMAL',
    directiveText: `➔ TINDAKAN: Majukan Siklus 1 Hari untuk Memanen Telur Baru`,
    explanation: `Semua sistem berjalan stabil. Pakan cukup, ventilasi aktif, biosekuriti 100%, dan indukan layer sedang dalam fase bertelur aktif.`,
    actionType: 'NONE',
    actionLabel: `Majukan Siklus 1 Hari`,
    highlightTarget: 'btn-advance-cycle',
    financialImpact: `Estimasi Produksi: +${Math.floor(cohorts.layerProductiveCount * 0.9)} Butir Telur`,
  };
}
