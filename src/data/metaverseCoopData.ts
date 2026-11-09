import { MetaverseCoopItem } from '../types/farm';

export const METAVERSE_COOP_CATALOG: MetaverseCoopItem[] = [
  {
    id: 'kandang-skala-kecil-50',
    name: 'Kandang Skala Kecil (50 Ekor)',
    tier: 'Modular Semi-Closed Mini',
    monthlyRentIdr: 250000,
    capacityBirds: 50,
    constructionCostRangeIdr: 'Rp 1.500.000 – Rp 3.000.000',
    constructionCostMinIdr: 1500000,
    constructionCostMaxIdr: 3000000,
    scaleCategory: 'SKALA_KECIL_50',
    description: 'Kandang modular semi-closed hemat ruang berkapasitas 50 ekor ayam pullet. Solusi praktis bagi peternak pemula tanpa perlu menanggung beban modal awal konstruksi fisik Rp 1.500.000 – Rp 3.000.000.',
    ventilationType: 'Exhaust Fan 16 Inch & Ventilasi Ram Kawat Kasa Ganda',
    coolingSystem: 'Sirkulasi Alami + Micro Sprayer Manual',
    sensors: [
      'Sensor Suhu NTC Analog',
      'Sensor Kelembapan Relatif (RH%)',
      'Voltase Monitor Daya Genset/Listrik'
    ],
    eggBonusPercent: 5,
    badge: 'Konstruksi: Rp 1.5M – Rp 3M',
    recommended: false,
    specDetails: {
      dimensions: '6m x 3m x 2.8m (Modular Baja Ringan)',
      feederType: 'Manual Hanging Feeder 5 Kg',
      manureHandling: 'Sistem Sekam & Pengerukan Berkala',
      lightingControl: 'Saklar Timer Otomatis 16 Jam',
      iotTelemetryInterval: 'Tiap 60 Detik',
      biosecurityRating: 'Tier 3 (Steril Standar Pemula)'
    }
  },
  {
    id: 'kandang-standar', // backward-compatible alias for Menengah 100 ekor
    name: 'Kandang Kapasitas Menengah (100 Ekor)',
    tier: 'Semi-Closed Standar Galvanis',
    monthlyRentIdr: 550000,
    capacityBirds: 100,
    constructionCostRangeIdr: 'Rp 3.500.000 – Rp 6.500.000',
    constructionCostMinIdr: 3500000,
    constructionCostMaxIdr: 6500000,
    scaleCategory: 'SKALA_MENENGAH_100',
    description: 'Kandang standar semi-closed galvanis berdaya tampung 100 ekor. Mengeliminasi beban Capex konstruksi fisik Rp 3.500.000 – Rp 6.500.000 dengan biaya sewa utility bulanan ringan dan sirkulasi udara terkontrol.',
    ventilationType: 'Dual Exhaust Blower 24 Inch & Tirai Insulasi Terpal PE',
    coolingSystem: 'Sprinkler Kabut Nozzle Micro-Mist Manual',
    sensors: [
      'Sensor Suhu NTC Analog',
      'Sensor Kelembapan DHT22',
      'Voltase Monitor Daya Listrik'
    ],
    eggBonusPercent: 12,
    badge: 'Konstruksi: Rp 3.5M – Rp 6.5M',
    recommended: false,
    specDetails: {
      dimensions: '12m x 5m x 3.2m',
      feederType: 'Pan Feeder Manual Gravitasi',
      manureHandling: 'Sistem Sekam & Pengerukan Teratur',
      lightingControl: 'Timer Analog 16 Jam Terang',
      iotTelemetryInterval: 'Tiap 30 Detik',
      biosecurityRating: 'Tier 2 (Steril Standar Pinsar)'
    }
  },
  {
    id: 'kandang-bertingkat-iot',
    name: 'Kandang Skala Komersial (500 Ekor)',
    tier: 'Smart Multi-Tier Closed House',
    monthlyRentIdr: 1850000,
    capacityBirds: 500,
    constructionCostRangeIdr: 'Rp 15.000.000 – Rp 25.000.000',
    constructionCostMinIdr: 15000000,
    constructionCostMaxIdr: 25000000,
    scaleCategory: 'SKALA_KOMERSIAL_500',
    description: 'Infrastruktur closed-house 3 tingkat galvanis LoRaWAN berkapasitas 500 ekor. Menghemat biaya pembangunan fisik Rp 15.000.000 – Rp 25.000.000 dengan sistem tunnel ventilation dan evaporative cooling pad otomatis.',
    ventilationType: 'Negative Pressure Tunnel Ventilation (Inverter 1.450 RPM)',
    coolingSystem: 'Evaporative Cellulose Cooling Pad Otomatis (Auto-Trigger >26°C)',
    sensors: [
      'Digital Sensor Suhu SHT31 (Akurasi ±0.1°C)',
      'Digital Sensor Kelembapan Relatif (RH%)',
      'Sensor Gas Amonia NH3 Elektrokromik',
      'Optical Egg Counter Sensor',
      'Digital Silo Load Cell Timbangan Pakan'
    ],
    eggBonusPercent: 25,
    badge: 'Konstruksi: Rp 15M – Rp 25M',
    recommended: true,
    specDetails: {
      dimensions: '28m x 9m x 4.5m (3 Lantai Galvanis)',
      feederType: 'Sistem Pakan Otomatis Spiral Auger',
      manureHandling: 'Conveyor Sabuk Polipropilen Otomatis Harian',
      lightingControl: 'Dimmable LED Spektrum Unggas Otomatis',
      iotTelemetryInterval: 'Real-Time (Tiap 3 Detik)',
      biosecurityRating: 'Tier 1 (Biosecurity Level 4 Steril)'
    }
  },
  {
    id: 'kandang-cyber-metaverse',
    name: 'Kandang Skala Industri (1.000 Ekor)',
    tier: 'Hyper-Scale Mega Closed House',
    monthlyRentIdr: 3500000,
    capacityBirds: 1000,
    constructionCostRangeIdr: 'Rp 35.000.000 – Rp 55.000.000',
    constructionCostMinIdr: 35000000,
    constructionCostMaxIdr: 55000000,
    scaleCategory: 'SKALA_INDUSTRI_1000',
    description: 'Fasilitas mega closed-house industri otonom berkapasitas 1.000 ekor dengan AI Matrix HVAC, panel surya microgrid, dan konveyor telur timbangan gramasi. Mengeliminasi modal konstruksi raksasa Rp 35.000.000 – Rp 55.000.000.',
    ventilationType: 'AI Matrix HVAC Multi-Zone Variable Airflow',
    coolingSystem: 'Geothermal Heat Pump + Dual Evaporative Cooling Walls',
    sensors: [
      'Dual-Band LoRaWAN + Zigbee 3.0 Mesh Array',
      'Thermal Infrared Matrix Sensor (Deteksi Titik Demam Unggas)',
      'Sensor Multi-Gas (NH3, CO2, H2S, O2)',
      'Smart Contract Merkle Leaf Attestation Engine'
    ],
    eggBonusPercent: 45,
    badge: 'Konstruksi: Rp 35M – Rp 55M',
    recommended: false,
    specDetails: {
      dimensions: '55m x 12m x 5.2m (Multi-Zone Industrial Mega House)',
      feederType: 'Robotic Precision Feeding Matrix',
      manureHandling: 'Sistem Bio-Gas Converter Otomatis',
      lightingControl: 'Circadian Rhythm AI Dynamic Lighting',
      iotTelemetryInterval: 'Ultra-Fast (Tiap 1 Detik On-Chain)',
      biosecurityRating: 'Level 4+ Zero-Pathogen Air Filtration'
    }
  },
  {
    id: 'lahan-metaverse-plot',
    name: 'Sewa Lahan Metaverse Sovereign',
    tier: 'Digital Land Asset',
    monthlyRentIdr: 500000,
    capacityBirds: 200,
    constructionCostRangeIdr: 'Sewa Lahan Petak: Rp 500.000/bln',
    scaleCategory: 'LAHAN',
    description: 'Kavling plot peternakan digital berdaulat untuk penempatan modul kandang baru dengan sertifikat NFT hak guna pakai, zona sanitasi biosekuriti steril, dan konektivitas daya microgrid.',
    ventilationType: 'Open Green Buffer Zone dengan Tanaman Penyaring Alami',
    coolingSystem: 'Canopy Pelindung Radiasi Sinar UV & Hujan Badai',
    sensors: [
      'Sensor Kelembapan Tanah & Ph Meter Digital',
      'Perimeter Infrared Intrusion Alert Security'
    ],
    eggBonusPercent: 5,
    badge: 'Ekspansi Kavling',
    recommended: false,
    specDetails: {
      dimensions: 'Kavling 40m x 25m (1.000 m² Metaverse)',
      feederType: 'Central Pipeline Feeder Port',
      manureHandling: 'Zona Kompos Terisolir',
      lightingControl: 'Solar Ambient Light Perimeter',
      iotTelemetryInterval: 'Tiap 5 Menit',
      biosecurityRating: 'Tier 1 Buffer Perimeter'
    }
  }
];

export const INFRASTRUCTURE_PACKAGES: import('../types/farm').InfrastructurePackage[] = [
  {
    id: 'pkg-starter-node',
    name: 'Paket Kemitraan Starter (100 Ekor Pullet)',
    tierLevel: 'starter',
    badge: 'Paket Mandiri Pemula (100 Ekor)',
    tagline: 'Paket kemitraan 100 ekor pullet 18 minggu lengkap bibit, sewa kandang, vitamin, deposit cuci kandang, dan cadangan pakan awal.',
    recommended: false,
    entryPackagePriceIdr: 12000000, // Rp 12.000.000 all-in siap produksi
    totalMonthlyRentIdr: 1050000,
    breakdown: {
      landCostIdr: 500000,
      coopCostIdr: 550000,
      landDesc: 'Lahan Peternakan Berdaulat (Kavling 1.000 m² dengan Zona Biosekuriti Steril)',
      coopDesc: 'Kandang Semi-Closed House Standar Kapasitas Menengah 100 Ekor'
    },
    capacityBirds: 100,
    hardwareSpecs: {
      ventilation: 'Dual Exhaust Blower 24 Inch & Tirai Insulasi Terpal PE',
      sensors: 'Sensor NTC Analog Suhu & Sensor RH DHT22 Real-Time',
      coolingSystem: 'Sprinkler Kabut Micro-Mist Manual',
      structure: 'Konstruksi Baja Ringan Semi-Closed Galvanis 100 Ekor'
    },
    projectedNetProfitMonthly: {
      minIdr: 1100000,
      maxIdr: 1350000,
      displayRange: 'Rp 1.100.000 - Rp 1.350.000 / bln',
      dailyEggs: 85, // ~85% Hen-Day lay rate
      monthlyEggRevenueIdr: 3474000, // ~161.5 kg x Rp 21.500/kg
      monthlyFeedCostIdr: 2200000,
      estNetProfitIdr: 1250000
    }
  },
  {
    id: 'pkg-pro-iot-tier1',
    name: 'Paket Kemitraan Pro Smart IoT (500 Ekor Pullet)',
    tierLevel: 'pro',
    badge: 'Pilihan Favorit Peternak (500 Ekor - Best ROI)',
    tagline: 'Kandang closed-house 3 tingkat galvanis dengan otomasi tunnel ventilation, sensor LoRaWAN, dan timbangan gramasi otomatis.',
    recommended: true,
    entryPackagePriceIdr: 58000000, // Rp 58.000.000 all-in
    totalMonthlyRentIdr: 2350000,
    breakdown: {
      landCostIdr: 500000,
      coopCostIdr: 1850000,
      landDesc: 'Lahan Peternakan Berdaulat (Kavling 1.000 m² + Koneksi Microgrid & Air Artesis)',
      coopDesc: 'Kandang Bertingkat IoT 3 Tingkat Galvanis (Evaporative Pad & Inverter 1.450 RPM)'
    },
    capacityBirds: 500,
    hardwareSpecs: {
      ventilation: 'Negative Pressure Tunnel Ventilation (Inverter 1.450 RPM)',
      sensors: 'LoRaWAN Wireless Digital SHT31, Sensor NH3 Amonia & Optical Egg Counter',
      coolingSystem: 'Evaporative Cellulose Cooling Pad Otomatis (Auto-Trigger >26°C)',
      structure: '3 Tingkat Galvanis Hot-Dip Anti-Karat & Konveyor Sabuk Feses Otomatis'
    },
    projectedNetProfitMonthly: {
      minIdr: 4500000,
      maxIdr: 5500000,
      displayRange: 'Rp 4.500.000 - Rp 5.500.000 / bln',
      dailyEggs: 425, // ~85% lay rate of 500
      monthlyEggRevenueIdr: 17370000, // 425 * 30 * 62.5g = 796.8 kg * Rp 21.500/kg
      monthlyFeedCostIdr: 11000000,
      estNetProfitIdr: 5200000
    }
  },
  {
    id: 'pkg-sovereign-mega',
    name: 'Paket Kemitraan Sovereign Industrial (1.000 Ekor Pullet)',
    tierLevel: 'sovereign',
    badge: 'Enterprise Hyper-Scale Sovereign (1.000 Ekor)',
    tagline: 'Infrastruktur mega closed-house otonom berkapasitas 1.000 ekor dengan AI Matrix HVAC, Solar Microgrid, dan penyerapan broker langsung.',
    recommended: false,
    entryPackagePriceIdr: 115000000, // Rp 115.000.000 all-in
    totalMonthlyRentIdr: 4000000,
    breakdown: {
      landCostIdr: 500000,
      coopCostIdr: 3500000,
      landDesc: 'Lahan Peternakan Berdaulat Kavling Luas (Akses Logistik Truk Pakan & Buffer Perimeter)',
      coopDesc: 'Kandang Cyber-Coop v4 Multi-Zone (AI Matrix HVAC + Geothermal Chiller)'
    },
    capacityBirds: 1000,
    hardwareSpecs: {
      ventilation: 'AI Matrix HVAC Multi-Zone Variable Airflow & Air Filtration HEPA H13',
      sensors: 'Dual-Band LoRaWAN + Zigbee 3.0 Mesh, Thermal Infrared Matrix Demam Unggas',
      coolingSystem: 'Geothermal Chiller + Dual Evaporative Cooling Walls',
      structure: 'Solar Microgrid Zero-Emission & Otomasi Panen Langsung On-Chain'
    },
    projectedNetProfitMonthly: {
      minIdr: 9500000,
      maxIdr: 12000000,
      displayRange: 'Rp 9.500.000 - Rp 12.000.000 / bln',
      dailyEggs: 850, // ~85% lay rate of 1000
      monthlyEggRevenueIdr: 34740000,
      monthlyFeedCostIdr: 22000000,
      estNetProfitIdr: 10500000
    }
  }
];

