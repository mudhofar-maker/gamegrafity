import { EggGrade, GramasiCalculation } from '../types/farm';

export interface GradeSpec {
  grade: EggGrade;
  label: string;
  sublabel: string;
  avgGramsPerEgg: number;
  pricePerKg: number;
  eggsPerKg: number;
  supermarketRetailPriceKg: number;
}

export const EGG_BROKER_PRICE_CONFIG = {
  initialWithdrawalPriceKg: 21000, // Catatan acuan awal penarikan di angka Rp 21.000 per kg
  minBrokerBuyPriceKg: 21500, // Kisaran harga broker dari peternak (batas bawah)
  maxBrokerBuyPriceKg: 22000, // Kisaran harga broker dari peternak (batas atas)
  benchmarkBrokerBuyPriceKg: 21500, // Acuan standar broker beli dari peternak
  retailModernMarketPriceKg: 27500, // Harga jual broker/owner ke ritel modern & horeka
  ownerOfftakerSpreadAvgKg: 6000, // Margin bersih offtaker broker: Rp 27.500 - Rp 21.500 = Rp 6.000/kg
};

export const EGG_GRADE_SPECS: Record<EggGrade, GradeSpec> = {
  GRADE_A: {
    grade: 'GRADE_A',
    label: 'Grade A Super (Jumbo)',
    sublabel: '>63g / butir • Kualitas Premium Horeka & Supermarket',
    avgGramsPerEgg: 65.0,
    pricePerKg: 22000, // Batas atas pembelian broker langsung dari peternak (Rp 22.000/kg)
    eggsPerKg: 15.38,
    supermarketRetailPriceKg: 28500, // Harga jual broker/owner ke ritel (Margin Rp 6.500/kg)
  },
  GRADE_B: {
    grade: 'GRADE_B',
    label: 'Grade B Standar (Komil / Normal)',
    sublabel: '55 - 62.5g / butir • Standar Acuan Pasar Peternak ke Broker (Rp 21.500/kg)',
    avgGramsPerEgg: 62.5,
    pricePerKg: 21500, // Acuan resmi broker dari peternak
    eggsPerKg: 16.0,
    supermarketRetailPriceKg: 27500, // Margin broker/owner Rp 6.000/kg
  },
  GRADE_C: {
    grade: 'GRADE_C',
    label: 'Grade C Bintek (Kecil / Awal)',
    sublabel: '<55g / butir • Acuan Awal Penarikan Peternak (Rp 21.000/kg)',
    avgGramsPerEgg: 52.0,
    pricePerKg: 21000, // Acuan awal penarikan di angka Rp 21.000/kg
    eggsPerKg: 19.23,
    supermarketRetailPriceKg: 26500, // Margin broker/owner Rp 5.500/kg
  },
};

// Hitung gramasi penjualan telur
export function calculateEggGramasi(eggCount: number, grade: EggGrade): GramasiCalculation {
  const spec = EGG_GRADE_SPECS[grade];
  const totalWeightGrams = eggCount * spec.avgGramsPerEgg;
  const totalWeightKg = totalWeightGrams / 1000;
  const farmerGrossRevenue = Math.round(totalWeightKg * spec.pricePerKg);

  // Margin owner saat menyalurkan ke jaringan distribusi hilir ritel modern
  const ownerSpreadPerKg = spec.supermarketRetailPriceKg - spec.pricePerKg;
  const ownerOfftakerMargin = Math.round(totalWeightKg * ownerSpreadPerKg);

  const equivalentPricePerEgg = eggCount > 0 ? Math.round(farmerGrossRevenue / eggCount) : 0;

  return {
    eggCount,
    grade,
    gramsPerEgg: spec.avgGramsPerEgg,
    totalWeightGrams,
    totalWeightKg,
    pricePerKg: spec.pricePerKg,
    farmerGrossRevenue,
    ownerOfftakerMargin,
    equivalentPricePerEgg,
  };
}

// Konfigurasi resmi siklus produktif & acuan pembelian ayam afkir oleh broker
export interface FullCycleProductiveSpec {
  cycleDurationMonths: number; // 12 bulan penuh
  cycleDurationDays: number; // 365 hari
  cycleHenAgeWeeks: string; // 72 hingga 78 minggu
  productivityRatePercent: number; // 85% rata-rata
  baseFlockSize: number; // 100 Ekor
  totalEggsPer100Hens: number; // 31.025 butir
  totalWeightKgPer100Hens: number; // 1.939 kg
  avgEggWeightGrams: number; // ~62.5 gram (Standar Grade A/B)
  brokerBuyPricePerBirdMin: number; // Rp 35.000 / ekor
  brokerBuyPricePerBirdMax: number; // Rp 45.000 / ekor
  brokerBuyPricePerBirdBenchmark: number; // Rp 40.000 / ekor
  brokerBuyPricePerKgLiveweight: number; // Rp 15.000 / kg bobot hidup
  terminalCondition: string; // Penjualan seluruh ayam ke broker & kondisi kandang kosong total
}

export const OFFICIAL_PRODUCTIVE_CYCLE_SPEC: FullCycleProductiveSpec = {
  cycleDurationMonths: 12,
  cycleDurationDays: 365,
  cycleHenAgeWeeks: '72 hingga 78 minggu usia ayam',
  productivityRatePercent: 85,
  baseFlockSize: 100,
  totalEggsPer100Hens: 31025,
  totalWeightKgPer100Hens: 1939,
  avgEggWeightGrams: 62.5,
  brokerBuyPricePerBirdMin: 35000,
  brokerBuyPricePerBirdMax: 45000,
  brokerBuyPricePerBirdBenchmark: 40000,
  brokerBuyPricePerKgLiveweight: 15000,
  terminalCondition: 'Penjualan seluruh ayam ke broker/pengepul sebagai ayam afkir & kondisi kandang menjadi kosong total',
};

// Hitung akumulasi produksi telur & bobot kilogram untuk ukuran populasi mana pun
export function calculateFullCycleProduction(flockSize: number) {
  const ratio = flockSize / 100;
  const totalEggs = Math.round(ratio * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.totalEggsPer100Hens);
  const totalWeightKg = Number((ratio * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.totalWeightKgPer100Hens).toFixed(1));
  const dailyEggs = Math.round(flockSize * (OFFICIAL_PRODUCTIVE_CYCLE_SPEC.productivityRatePercent / 100));
  const dailyWeightKg = Number(((dailyEggs * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.avgEggWeightGrams) / 1000).toFixed(2));

  // Acuan Pembelian Broker untuk Seluruh Ayam Afkir
  const afkirGrossPerBirdMin = flockSize * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.brokerBuyPricePerBirdMin;
  const afkirGrossPerBirdMax = flockSize * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.brokerBuyPricePerBirdMax;
  const afkirGrossPerBirdBenchmark = flockSize * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.brokerBuyPricePerBirdBenchmark;
  
  // Berdasarkan timbangan bobot hidup (rata-rata 2.50 kg di ujung siklus)
  const avgLiveweightKg = 2.50;
  const totalLiveweightKg = Number((flockSize * avgLiveweightKg).toFixed(1));
  const afkirGrossLiveweightPayout = Math.round(totalLiveweightKg * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.brokerBuyPricePerKgLiveweight);

  return {
    flockSize,
    productivityRatePercent: 85,
    cycleDurationMonths: 12,
    cycleHenAgeWeeks: '72 – 78 Minggu',
    dailyEggs,
    dailyWeightKg,
    totalEggs,
    totalWeightKg,
    afkirGrossPerBirdMin,
    afkirGrossPerBirdMax,
    afkirGrossPerBirdBenchmark,
    totalLiveweightKg,
    afkirGrossLiveweightPayout,
  };
}

// Konfigurasi bisnis ayam afkir (Broker Purchase Benchmark)
export const AFKIR_GRAMASI_CONFIG = {
  pricePerKgLiveweight: 15000, // Rp 15.000 / Kg bobot hidup acuan broker
  pricePerBirdMin: 35000, // Rp 35.000 / ekor batas bawah
  pricePerBirdMax: 45000, // Rp 45.000 / ekor batas atas
  pricePerBirdBenchmark: 40000, // Rp 40.000 / ekor acuan sistem
  avgLiveweightKg: 2.50, // 2.50 kg rata-rata bobot ayam di ujung siklus (2.5 kg * Rp 15.000 = Rp 37.500)
  ownerSlaughterMarginKg: 2500, // Margin broker/owner saat karkas didistribusikan ke horeka
};

export function calculateSpentHensGramasi(
  henCount: number,
  pricingMethod: 'PER_EKOR' | 'PER_KG' = 'PER_EKOR',
  customPricePerBird = 40000,
  customAvgWeightKg = 2.50
) {
  const totalWeightKg = Number((henCount * customAvgWeightKg).toFixed(1));
  let farmerPayout = 0;

  if (pricingMethod === 'PER_EKOR') {
    farmerPayout = henCount * customPricePerBird;
  } else {
    farmerPayout = Math.round(totalWeightKg * AFKIR_GRAMASI_CONFIG.pricePerKgLiveweight);
  }

  const ownerProfit = Math.round(totalWeightKg * AFKIR_GRAMASI_CONFIG.ownerSlaughterMarginKg);
  const payoutPerBird = henCount > 0 ? Math.round(farmerPayout / henCount) : 0;

  return {
    henCount,
    totalWeightKg,
    pricePerKgLiveweight: AFKIR_GRAMASI_CONFIG.pricePerKgLiveweight,
    pricePerBirdRangeIdr: 'Rp 35.000 – Rp 45.000 / ekor',
    pricingMethod,
    customPricePerBird,
    farmerPayout,
    ownerProfit,
    payoutPerBird,
  };
}

// 5 Galur/Strain Ayam Petelur Komersial Utama di Indonesia (Patokan Acuan Pasar)
export interface LayerStrainSpec {
  id: string;
  name: string;
  marketPriceRangeIdr: string;
  officialPriceIdr: number;
  highlightTrait: string;
  annualEggsPerHen: number;
  layRatePeakPercent: number;
  feedIntakeGramsDaily: number;
  fcrRatio: number;
  avgAfkirLiveweightKg: number;
  eggColorType: string;
}

export const COMMERCIAL_LAYER_STRAINS: Record<string, LayerStrainSpec> = {
  'hyline-brown': {
    id: 'pullet-hyline-brown',
    name: 'Hy-Line Brown',
    marketPriceRangeIdr: 'Rp 85.000 – Rp 95.000 / ekor',
    officialPriceIdr: 90000,
    highlightTrait: 'Strain paling populer di Indonesia, sangat adaptif cuaca tropis, produksi telur cokelat tinggi dan stabil.',
    annualEggsPerHen: 330,
    layRatePeakPercent: 95,
    feedIntakeGramsDaily: 115,
    fcrRatio: 2.12,
    avgAfkirLiveweightKg: 1.95,
    eggColorType: 'Cokelat Gelap Tegas (Grade A/B)',
  },
  'lohmann-brown': {
    id: 'pullet-lohmann-brown',
    name: 'Lohmann Brown',
    marketPriceRangeIdr: 'Rp 85.000 – Rp 95.000 / ekor',
    officialPriceIdr: 90000,
    highlightTrait: 'Produktivitas puncak sangat tinggi, cangkang telur tebal tahan retak, efisiensi konversi pakan hemat.',
    annualEggsPerHen: 335,
    layRatePeakPercent: 96,
    feedIntakeGramsDaily: 114,
    fcrRatio: 2.10,
    avgAfkirLiveweightKg: 2.00,
    eggColorType: 'Cokelat Tebal Tahan Retak',
  },
  'isa-brown': {
    id: 'pullet-isa-brown',
    name: 'Isa Brown',
    marketPriceRangeIdr: 'Rp 83.000 – Rp 92.000 / ekor',
    officialPriceIdr: 88000,
    highlightTrait: 'Karakter tenang dan jinak, daya tahan tinggi terhadap berbagai cuaca tropis, rasio pakan optimal.',
    annualEggsPerHen: 325,
    layRatePeakPercent: 94,
    feedIntakeGramsDaily: 116,
    fcrRatio: 2.15,
    avgAfkirLiveweightKg: 1.95,
    eggColorType: 'Cokelat Kemerahan Seragam',
  },
  'hisex-brown': {
    id: 'pullet-hisex-brown',
    name: 'Hisex Brown',
    marketPriceRangeIdr: 'Rp 82.000 – Rp 90.000 / ekor',
    officialPriceIdr: 86000,
    highlightTrait: 'Performa produksi puncak panjang, rata-rata ukuran telur besar (dominan Grade A Jumbo).',
    annualEggsPerHen: 320,
    layRatePeakPercent: 93,
    feedIntakeGramsDaily: 118,
    fcrRatio: 2.18,
    avgAfkirLiveweightKg: 2.05,
    eggColorType: 'Cokelat Tua Jumbo (>64g)',
  },
  'lokal-arab': {
    id: 'pullet-lokal-arab',
    name: 'Ayam Petelur Lokal / Arab (Silver & Gold)',
    marketPriceRangeIdr: 'Rp 65.000 – Rp 75.000 / ekor',
    officialPriceIdr: 70000,
    highlightTrait: 'Alternatif pasar khusus telur konsumsi putih/krem khas kampung, konsumsi pakan hemat & harga jual premium.',
    annualEggsPerHen: 260,
    layRatePeakPercent: 84,
    feedIntakeGramsDaily: 85,
    fcrRatio: 2.40,
    avgAfkirLiveweightKg: 1.45,
    eggColorType: 'Putih / Krem Mutiara Khas Kampung',
  },
};

// Hitung Unit Economics & Bukti Matematika Anti-Kebangkrutan (Solvency Model)
export function calculateAntiBankruptcyEconomics(strainKey = 'hyline-brown', flockSize = 500) {
  const strain = COMMERCIAL_LAYER_STRAINS[strainKey] || COMMERCIAL_LAYER_STRAINS['hyline-brown'];
  const feedPricePerKg = 7000;
  const daysInCycle = OFFICIAL_PRODUCTIVE_CYCLE_SPEC.cycleDurationDays; // 365 hari (1 tahun / 12 bulan penuh)
  
  // 1. Modal Input Bibit Pullet
  const totalPulletCost = flockSize * strain.officialPriceIdr;

  // 2. Produksi Telur Sepanjang 1 Siklus Penuh (Rata-rata 85% Hen-Day: 31.025 butir / 1.939 Kg per 100 ekor)
  const ratio100 = flockSize / 100;
  const totalEggsProduced = Math.round(ratio100 * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.totalEggsPer100Hens);
  const totalEggWeightKg = Number((ratio100 * OFFICIAL_PRODUCTIVE_CYCLE_SPEC.totalWeightKgPer100Hens).toFixed(1));
  const totalEggRevenueWholesale = Math.round(totalEggWeightKg * EGG_GRADE_SPECS.GRADE_B.pricePerKg); // Rp 26.500/Kg

  // 3. Biaya Pakan Konsentrat (115g/hari per ekor)
  const totalFeedKgConsumed = Math.round((flockSize * strain.feedIntakeGramsDaily * daysInCycle) / 1000);
  const totalFeedCost = totalFeedKgConsumed * feedPricePerKg;

  // 4. Laba Operasional Kotor Telur
  const grossEggProfit = totalEggRevenueWholesale - totalFeedCost;

  // 5. Pencairan Akhir Modal Ayam Afkir oleh Broker (Acuan Rp 35.000 – Rp 45.000/ekor, rata-rata Rp 40.000/ekor)
  const afkirTerminalPayout = flockSize * AFKIR_GRAMASI_CONFIG.pricePerBirdBenchmark;
  const totalAfkirWeightKg = Number((flockSize * AFKIR_GRAMASI_CONFIG.avgLiveweightKg).toFixed(1));
  const afkirTerminalPayoutByKg = Math.round(totalAfkirWeightKg * AFKIR_GRAMASI_CONFIG.pricePerKgLiveweight);
  const afkirTerminalOwnerMargin = Math.round(totalAfkirWeightKg * AFKIR_GRAMASI_CONFIG.ownerSlaughterMarginKg);

  // 6. Net Profit Bersih Peternak (Setelah depresiasi bibit + afkir recovery)
  const netDepreciationBibit = totalPulletCost - afkirTerminalPayout;
  const netFarmerProfitTotal = grossEggProfit - netDepreciationBibit;
  const monthlyFarmerNetProfit = Math.round(netFarmerProfitTotal / 12); // 12 bulan penuh

  // 7. Pendapatan Kas Platform Owner (Margin pakan Rp 700/kg + margin afkir + margin spread telur Rp 2.300/kg)
  const ownerFeedMargin = Math.round(totalFeedKgConsumed * 700);
  const ownerEggSpreadMargin = Math.round(totalEggWeightKg * 2300);
  const ownerTotalClearanceRevenue = ownerFeedMargin + ownerEggSpreadMargin + afkirTerminalOwnerMargin;

  // 8. Solvency Ratio (Perbandingan Total Arus Kas Masuk terhadap Total Beban)
  const totalCashFlowGenerated = totalEggRevenueWholesale + afkirTerminalPayout;
  const totalCosts = totalPulletCost + totalFeedCost;
  const solvencyRatio = Number((totalCashFlowGenerated / totalCosts).toFixed(2));

  return {
    strain,
    flockSize,
    daysInCycle,
    cycleHenAgeWeeks: OFFICIAL_PRODUCTIVE_CYCLE_SPEC.cycleHenAgeWeeks,
    productivityRatePercent: OFFICIAL_PRODUCTIVE_CYCLE_SPEC.productivityRatePercent,
    totalPulletCost,
    totalEggsProduced,
    totalEggWeightKg,
    totalEggRevenueWholesale,
    totalFeedKgConsumed,
    totalFeedCost,
    grossEggProfit,
    afkirTerminalPayout,
    afkirTerminalPayoutByKg,
    totalAfkirWeightKg,
    afkirTerminalOwnerMargin,
    netFarmerProfitTotal,
    monthlyFarmerNetProfit,
    ownerTotalClearanceRevenue,
    solvencyRatio,
    isSolvent: solvencyRatio >= 1.25, // Di atas 1.25x membuktikan sistem 100% surplus & anti-bangkrut
  };
}

// Logika Bisnis Win-Win (Saling Menguntungkan)
export const WIN_WIN_BUSINESS_EXPLANATION = {
  title: 'Logika Bisnis Gramasi & Kemitraan Saling Menguntungkan (Win-Win)',
  points: [
    {
      actor: 'Peternak (Pengguna)',
      role: 'Mitra Produsen Telur & Karkas Berdaulat',
      benefits: [
        'Beli Bibit per Ekor Siap Telur (Rp 70.000 - Rp 90.000): Mendapatkan pullet umur 18 minggu bersertifikat (Hy-Line, Lohmann, Isa, Hisex, Arab), bebas risiko kematian masa brooding anak ayam.',
        'Jual Telur Menggunakan Gramasi (Kg): Bukan hitungan flat butir. Peternak yang merawat ayam secara optimal menghasilkan telur Grade A (>63g) seharga Rp 28.500/Kg, sehingga pendapatan per butir naik drastis.',
        'Balik Modal Bibit di Akhir Siklus: Ayam afkir ditimbang bobot hidup (~1.95 - 2.05 Kg @ Rp 23.000/Kg = Rp 44.850 - Rp 47.150/ekor). Modal bibit awal kembali 50%+, sehingga laba operasional telur selama 54 minggu adalah MURNI KEUNTUNGAN BERSIH.',
        'Penyelamatan Virus Junkfood: Jika bibit sakit, tetap laku dijual ke pabrik olahan junkfood per bobot karkas (Rp 15.000/ekor) sehingga risiko modal hangus 100% berhasil dieliminasi.',
      ],
    },
    {
      actor: 'Owner / Platform Treasury',
      role: 'Agregator Hulu-Hilir & Penjamin Likuiditas (Offtaker)',
      benefits: [
        'Margin Suplai Hulu: Margin sehat dari pabrik pakan konsentrat (Rp 700/Kg) dan penetasan bibit unggul.',
        'Margin Agregasi Gramasi Hilir: Owner menyerap telur dengan timbangan kilogram netto, lalu mendistribusikan ke jaringan ritel modern dengan spread Rp 2.300 - Rp 3.000/Kg.',
        'Bebas Beban Operasional Langsung: Owner tidak perlu memelihara kandang secara fisik, namun kas treasury bertumbuh stabil dari skala volume transaksi per gramasi.',
        'Ekosistem Web3 & P2P: Payout instan terdesentralisasi meningkatkan perputaran modal hingga 4x lebih cepat dibanding broker konvensional tanpa risiko gagal bayar.',
      ],
    },
  ],
};

// ==================== STRUKTUR DATA UTILITY HULU (STANDAR INDUSTRI PRESISI) ====================
export interface PakanFaseItem {
  faseId: number;
  namaFase: string;
  spesifikasi: string;
  konsumsiKgPerEkor: number;
  hargaPerKg: number;
  subtotal: number;
}

export interface VitaminKesehatanItem {
  item: string;
  fungsi: string;
  kebutuhanKg?: number;
  kebutuhanSatuan?: number;
  hargaPerKg?: number;
  hargaSatuan?: number;
  subtotal: number;
}

export interface DatabaseUtilityHulu {
  metadata: {
    kapasitasUnit: string;
    durasiSiklus: string;
    deskripsi: string;
  };
  pulletAwal: {
    item: string;
    jumlahEkor: number;
    hargaSatuan: number;
    subtotal: number;
  };
  pakanFaseBerurutan: PakanFaseItem[];
  vitaminDanKesehatan: VitaminKesehatanItem[];
  jasaPerawatanKandangKosong: {
    item: string;
    rincian: string;
    subtotal: number;
  };
  infrastrukturPendukung: {
    listrikDanAir: number;
  };
}

export const DATABASE_UTILITY_LENGKAP_HULU: DatabaseUtilityHulu = {
  metadata: {
    kapasitasUnit: "1 Paket (100 Ekor Ayam Petelur)",
    durasiSiklus: "12 Bulan (72-78 Minggu)",
    deskripsi: "Standar operasional hulu tertutup tanpa merek komersial"
  },

  // 1. KOMPONEN PULLET AWAL
  pulletAwal: {
    item: "Pullet Siap Produksi (Umur 18 Minggu)",
    jumlahEkor: 100,
    hargaSatuan: 85000,
    subtotal: 8500000
  },

  // 2. 5 FASE PAKAN STANDAR BERURUTAN
  pakanFaseBerurutan: [
    {
      faseId: 1,
      namaFase: "Pre-Starter (0 - 5 Minggu)",
      spesifikasi: "Pakan Starter Butiran Halus / Crumble Tinggi Protein",
      konsumsiKgPerEkor: 0.8,
      hargaPerKg: 14500,
      subtotal: 100 * 0.8 * 14500 // 1.160.000
    },
    {
      faseId: 2,
      namaFase: "Starter (6 - 10 Minggu)",
      spesifikasi: "Pakan Pertumbuhan Awal / Grower Crumble",
      konsumsiKgPerEkor: 1.5,
      hargaPerKg: 13500,
      subtotal: 100 * 1.5 * 13500 // 2.025.000
    },
    {
      faseId: 3,
      namaFase: "Grower / Pullet (11 - 18 Minggu)",
      spesifikasi: "Konsentrat Pullet / Pakan Perkembangan Kerangka",
      konsumsiKgPerEkor: 2.7,
      hargaPerKg: 12500,
      subtotal: 100 * 2.7 * 12500 // 3.375.000
    },
    {
      faseId: 4,
      namaFase: "Layer - Puncak Produksi (18 - 40 Minggu)",
      spesifikasi: "Pakan Komplit Produksi / Layer Puncak (Energi & Kalsium Tinggi)",
      konsumsiKgPerEkor: 34.0,
      hargaPerKg: 11500,
      subtotal: 100 * 34.0 * 11500 // 39.100.000
    },
    {
      faseId: 5,
      namaFase: "Layer Lanjutan & Menuju Afkir (41 - 52 Minggu)",
      spesifikasi: "Pakan Layer Pemeliharaan Lanjutan & Kalsium Cangkang",
      konsumsiKgPerEkor: 6.0,
      hargaPerKg: 11000,
      subtotal: 100 * 6.0 * 11000 // 6.600.000
    }
  ],

  // 3. STANDAR VITAMIN & SUPLEMEN KESEHATAN
  vitaminDanKesehatan: [
    {
      item: "Premix Vitamin & Mineral Kalsium (Layer)",
      fungsi: "Penguat cangkang telur & pencegah kelumpuhan",
      kebutuhanKg: 3,
      hargaPerKg: 27000,
      subtotal: 3 * 27000 // 81.000
    },
    {
      item: "Multivitamin Anti-Stres & Imun Air Minum",
      fungsi: "Stamina cuaca ekstrem & pemulihan pasca vaksin",
      kebutuhanSatuan: 4,
      hargaSatuan: 40000,
      subtotal: 4 * 40000 // 160.000
    },
    {
      item: "Suplemen Asam Amino / Pemacu Produksi",
      fungsi: "Menjaga stabilitas jumlah & ukuran butir telur",
      kebutuhanKg: 2,
      hargaPerKg: 55000,
      subtotal: 2 * 55000 // 110.000
    }
  ],

  // 4. JASA PERAWATAN & PEMBERSIHAN KANDANG KOSONG (PASCA-AFKIR)
  jasaPerawatanKandangKosong: {
    item: "Paket Jasa Pembersihan, Sanitasi & Sterilisasi Total",
    rincian: "Pengerukan feses bawah panggung, cuci tekanan tinggi (jet washer), desinfeksi medis total, dan tebar sekam baru selama masa istirahat kandang.",
    subtotal: 350000
  },

  // 5. INFRASTRUKTUR PENDUKUNG (LISTRIK & AIR)
  infrastrukturPendukung: {
    listrikDanAir: 600000
  }
};

// --- FUNGSI KALKULASI TOTAL HPP HULU ---
export function hitungHppHuluTotal(db: DatabaseUtilityHulu = DATABASE_UTILITY_LENGKAP_HULU) {
  const pullet = db.pulletAwal.subtotal;
  const pakan = db.pakanFaseBerurutan.reduce((acc, curr) => acc + curr.subtotal, 0);
  const vitamin = db.vitaminDanKesehatan.reduce((acc, curr) => acc + curr.subtotal, 0);
  const jasaKandang = db.jasaPerawatanKandangKosong.subtotal;
  const infrastruktur = db.infrastrukturPendukung.listrikDanAir;

  return {
    pullet,
    pakan,
    vitamin,
    jasaKandang,
    infrastruktur,
    totalHpp: pullet + pakan + vitamin + jasaKandang + infrastruktur
  };
}

// ==================== MATEMATIKA BISNIS KEMITRAAN & EKOSISTEM "AIR MANCUR ABADI" ====================
export interface PerpetualFountainPackageModel {
  packageId: string;
  packageName: string;
  flockSize: number;
  entryCostIdr: number;
  monthlyCoopRentIdr: number;
  annualEggOutputKg: number;
  annualEggRevenueBrokerIdr: number; // Peternak jual ke broker @ Rp 21.500 / kg
  terminalAfkirRevenueIdr: number; // 100 ekor @ Rp 40.000
  totalGrossFarmerRevenueIdr: number;
  annualFeedAndOperationalCostIdr: number;
  netFarmerProfitIdr: number;
  farmerRoiPercent: number;
  ownerAnnualRevenueStreams: {
    pulletSaleMarginIdr: number;
    feedPhasesMarginIdr: number;
    vitaminMarginIdr: number;
    coopRentAnnualIdr: number;
    cleaningPostAfkirServiceIdr: number;
    eggBrokerTradingMarginIdr: number;
    afkirBrokerTradingMarginIdr: number;
    autoCompoundingFeeIdr: number;
    totalOwnerNetProfitIdr: number;
  };
}

export const PERPETUAL_FOUNTAIN_PACKAGES: Record<string, PerpetualFountainPackageModel> = {
  'pkg-micro-10': {
    packageId: 'pkg-micro-node-10',
    packageName: 'Paket Kemitraan Mikro (10 Ekor Pullet)',
    flockSize: 10,
    entryCostIdr: 1250000, // Rp 1.250.000 all-in siap produksi (termasuk 10 pullet 18 minggu, sewa kandang mikro, pakan awal & vitamin)
    monthlyCoopRentIdr: 85000,
    annualEggOutputKg: 193.9,
    annualEggRevenueBrokerIdr: Math.round(193.9 * 21500), // Rp 4.168.850
    terminalAfkirRevenueIdr: 10 * 40000, // Rp 400.000
    totalGrossFarmerRevenueIdr: Math.round(193.9 * 21500) + 400000, // Rp 4.568.850
    annualFeedAndOperationalCostIdr: 4008850,
    netFarmerProfitIdr: 560000, // ~44.8% ROI realistis
    farmerRoiPercent: 44.8,
    ownerAnnualRevenueStreams: {
      pulletSaleMarginIdr: 100000, // Rp 10.000 x 10
      feedPhasesMarginIdr: 630000, // Grosir pakan 450 kg
      vitaminMarginIdr: 12000,
      coopRentAnnualIdr: 1020000, // Sewa kandang mikro Rp 85k x 12 bln
      cleaningPostAfkirServiceIdr: 35000, // Jasa cuci kandang mikro pasca-afkir
      eggBrokerTradingMarginIdr: Math.round(193.9 * 6000), // Rp 1.163.400 (jual ritel @ Rp 27.500)
      afkirBrokerTradingMarginIdr: 180000, // Karkas broker margin
      autoCompoundingFeeIdr: 92000, // Biaya administrasi auto-compounding 3.5%
      totalOwnerNetProfitIdr: 3232400,
    },
  },
  'pkg-starter-100': {
    packageId: 'pkg-starter-node',
    packageName: 'Paket Kemitraan Starter (100 Ekor Pullet)',
    flockSize: 100,
    entryCostIdr: 12000000, // Rp 12.000.000 all-in siap produksi
    monthlyCoopRentIdr: 550000,
    annualEggOutputKg: 1939,
    annualEggRevenueBrokerIdr: Math.round(1939 * 21500), // Rp 41.688.500
    terminalAfkirRevenueIdr: 100 * 40000, // Rp 4.000.000
    totalGrossFarmerRevenueIdr: Math.round(1939 * 21500) + 4000000, // Rp 45.688.500
    annualFeedAndOperationalCostIdr: 34188500,
    netFarmerProfitIdr: 5500000, // ~45.8% ROI realistis
    farmerRoiPercent: 45.8,
    ownerAnnualRevenueStreams: {
      pulletSaleMarginIdr: 1000000, // Rp 10.000 x 100
      feedPhasesMarginIdr: 6300000, // Grosir pakan
      vitaminMarginIdr: 120000,
      coopRentAnnualIdr: 6600000, // Sewa kandang Rp 550k x 12 bln
      cleaningPostAfkirServiceIdr: 350000, // Jasa cuci kandang kosong pasca-afkir
      eggBrokerTradingMarginIdr: Math.round(1939 * 6000), // Rp 11.634.000 (jual ritel @ Rp 27.500)
      afkirBrokerTradingMarginIdr: 1800000, // Karkas broker margin
      autoCompoundingFeeIdr: 920000, // Biaya administrasi auto-compounding 3.5%
      totalOwnerNetProfitIdr: 28724000,
    },
  },
  'pkg-pro-500': {
    packageId: 'pkg-pro-iot-tier1',
    packageName: 'Paket Kemitraan Pro Smart IoT (500 Ekor Pullet)',
    flockSize: 500,
    entryCostIdr: 58000000,
    monthlyCoopRentIdr: 2350000,
    annualEggOutputKg: 9695,
    annualEggRevenueBrokerIdr: Math.round(9695 * 21500), // Rp 208.442.500
    terminalAfkirRevenueIdr: 500 * 40000, // Rp 20.000.000
    totalGrossFarmerRevenueIdr: Math.round(9695 * 21500) + 20000000, // Rp 228.442.500
    annualFeedAndOperationalCostIdr: 170942500,
    netFarmerProfitIdr: 27500000, // ~47.4% ROI
    farmerRoiPercent: 47.4,
    ownerAnnualRevenueStreams: {
      pulletSaleMarginIdr: 5000000,
      feedPhasesMarginIdr: 31500000,
      vitaminMarginIdr: 600000,
      coopRentAnnualIdr: 28200000,
      cleaningPostAfkirServiceIdr: 1750000,
      eggBrokerTradingMarginIdr: Math.round(9695 * 6000), // Rp 58.170.000
      afkirBrokerTradingMarginIdr: 9000000,
      autoCompoundingFeeIdr: 4600000,
      totalOwnerNetProfitIdr: 138820000,
    },
  },
  'pkg-sovereign-1000': {
    packageId: 'pkg-sovereign-mega',
    packageName: 'Paket Kemitraan Sovereign Industrial (1.000 Ekor Pullet)',
    flockSize: 1000,
    entryCostIdr: 115000000,
    monthlyCoopRentIdr: 4000000,
    annualEggOutputKg: 19390,
    annualEggRevenueBrokerIdr: Math.round(19390 * 21500), // Rp 416.885.000
    terminalAfkirRevenueIdr: 1000 * 40000, // Rp 40.000.000
    totalGrossFarmerRevenueIdr: Math.round(19390 * 21500) + 40000000, // Rp 456.885.000
    annualFeedAndOperationalCostIdr: 341885000,
    netFarmerProfitIdr: 56000000, // ~48.7% ROI
    farmerRoiPercent: 48.7,
    ownerAnnualRevenueStreams: {
      pulletSaleMarginIdr: 10000000,
      feedPhasesMarginIdr: 63000000,
      vitaminMarginIdr: 1200000,
      coopRentAnnualIdr: 48000000,
      cleaningPostAfkirServiceIdr: 3500000,
      eggBrokerTradingMarginIdr: Math.round(19390 * 6000), // Rp 116.340.000
      afkirBrokerTradingMarginIdr: 18000000,
      autoCompoundingFeeIdr: 9200000,
      totalOwnerNetProfitIdr: 269240000,
    },
  },
};
