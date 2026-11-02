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

export const EGG_GRADE_SPECS: Record<EggGrade, GradeSpec> = {
  GRADE_A: {
    grade: 'GRADE_A',
    label: 'Grade A Super (Jumbo)',
    sublabel: '>63g / butir • Kualitas Premium Horeka & Supermarket',
    avgGramsPerEgg: 65.0,
    pricePerKg: 28500, // Harga beli offtaker ke peternak
    eggsPerKg: 15.38,
    supermarketRetailPriceKg: 31500, // Harga jual owner ke supermarket (margin Rp 3.000/kg)
  },
  GRADE_B: {
    grade: 'GRADE_B',
    label: 'Grade B Standar (Komil / Normal)',
    sublabel: '55 - 62.5g / butir • Standar Acuan Pasar Nasional (Pinsar)',
    avgGramsPerEgg: 62.5,
    pricePerKg: 26500,
    eggsPerKg: 16.0,
    supermarketRetailPriceKg: 28800, // Margin Rp 2.300/kg
  },
  GRADE_C: {
    grade: 'GRADE_C',
    label: 'Grade C Bintek (Kecil)',
    sublabel: '<55g / butir • Hasil Awal Bertelur Pullet Baru',
    avgGramsPerEgg: 52.0,
    pricePerKg: 23500,
    eggsPerKg: 19.23,
    supermarketRetailPriceKg: 25500, // Margin Rp 2.000/kg
  },
};

// Hitung gramasi penjualan telur
export function calculateEggGramasi(eggCount: number, grade: EggGrade): GramasiCalculation {
  const spec = EGG_GRADE_SPECS[grade];
  const totalWeightGrams = eggCount * spec.avgGramsPerEgg;
  const totalWeightKg = totalWeightGrams / 1000;
  const farmerGrossRevenue = Math.round(totalWeightKg * spec.pricePerKg);

  // Margin owner saat menyalurkan ke jaringan distribusi hilir
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

// Konfigurasi bisnis ayam afkir (Liveweight Kg)
export const AFKIR_GRAMASI_CONFIG = {
  pricePerKgLiveweight: 23000, // Rp 23.000 / Kg bobot hidup
  avgLiveweightKg: 1.95, // Rata-rata bobot ayam petelur tua 1.95 kg
  ownerSlaughterMarginKg: 3500, // Margin owner saat karkas dipotong ke restoran
};

export function calculateSpentHensGramasi(henCount: number) {
  const totalWeightKg = henCount * AFKIR_GRAMASI_CONFIG.avgLiveweightKg;
  const farmerPayout = Math.round(totalWeightKg * AFKIR_GRAMASI_CONFIG.pricePerKgLiveweight);
  const ownerProfit = Math.round(totalWeightKg * AFKIR_GRAMASI_CONFIG.ownerSlaughterMarginKg);
  const payoutPerBird = henCount > 0 ? Math.round(farmerPayout / henCount) : 0;

  return {
    henCount,
    totalWeightKg,
    pricePerKgLiveweight: AFKIR_GRAMASI_CONFIG.pricePerKgLiveweight,
    farmerPayout,
    ownerProfit,
    payoutPerBird,
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
        'Beli Bibit per Ekor (Rp 45.000): Mendapatkan pullet umur 18 minggu bersertifikat, bebas risiko kematian masa brooding.',
        'Jual Telur Menggunakan Gramasi (Kg): Bukan hitungan flat butir. Peternak yang merawat ayam secara optimal menghasilkan telur Grade A (>63g) seharga Rp 28.500/Kg, sehingga pendapatan per butir naik drastis.',
        'Balik Modal Bibit di Akhir Siklus: Ayam afkir ditimbang bobot hidup (~1.95 Kg @ Rp 23.000/Kg = Rp 44.850/ekor). Modal bibit awal kembali 99%, sehingga seluruh telur yang dihasilkan selama siklus adalah MURNI LABA BERSIH.',
        'Penyelamatan Virus Junkfood: Jika bibit sakit, tetap laku dijual ke pabrik junkfood per bobot karkas (Rp 15.000/ekor) sehingga risiko modal hangus 100% berhasil dieliminasi.',
      ],
    },
    {
      actor: 'Owner / Platform Treasury',
      role: 'Agregator Hulu-Hilir & Penjamin Likuiditas (Offtaker)',
      benefits: [
        'Margin Suplai Hulu: Margin sehat dari pabrik pakan konsentrat (Rp 700/Kg) dan penetasan bibit unggul.',
        'Margin Agregasi Gramasi Hilir: Owner menyerap telur dengan timbangan kilogram netto, lalu mendistribusikan ke jaringan ritel modern dengan spread Rp 2.300 - Rp 3.000/Kg.',
        'Bebas Beban Operasional Langsung: Owner tidak perlu memelihara kandang secara manual, namun kas treasury bertumbuh stabil dari skala volume transaksi per gramasi.',
        'Ekosistem Web3 & P2P: Payout instan terdesentralisasi meningkatkan perputaran modal hingga 4x lebih cepat dibanding broker konvensional.',
      ],
    },
  ],
};
