import { MetaverseCoopItem } from '../types/farm';

export const METAVERSE_COOP_CATALOG: MetaverseCoopItem[] = [
  {
    id: 'kandang-standar',
    name: 'Kandang Standar',
    tier: 'Semi-Closed House',
    monthlyRentIdr: 750000,
    capacityBirds: 150,
    description: 'Kandang semi-tertutup higienis berstandar teknis dengan sirkulasi exhaust blower ganda dan sistem pakan gravitasi terarah. Pilihan ideal untuk peternak mandiri.',
    ventilationType: 'Dual Exhaust Blower 36 Inch & Tirai Insulasi Manual',
    coolingSystem: 'Sprinkler Kabut Nozzle Micro-Mist Manual',
    sensors: [
      'Sensor Suhu NTC Analog',
      'Sensor Kelembapan DHT22',
      'Voltase Monitor Daya Listrik'
    ],
    eggBonusPercent: 10,
    badge: 'Pilihan Standar Hemat',
    recommended: false,
    specDetails: {
      dimensions: '12m x 6m x 3.2m',
      feederType: 'Pan Feeder Manual Gravitasi',
      manureHandling: 'Sistem Sekam & Pengerukan Berkala',
      lightingControl: 'Timer Analog 16 Jam Terang',
      iotTelemetryInterval: 'Tiap 60 Detik',
      biosecurityRating: 'Tier 2 (Steril Standar)'
    }
  },
  {
    id: 'kandang-bertingkat-iot',
    name: 'Kandang Bertingkat IoT',
    tier: 'Smart Multi-Tier Closed House',
    monthlyRentIdr: 1850000,
    capacityBirds: 500,
    description: 'Infrastruktur kandang closed-house modern 3 tingkat vertikal terintegrasi telemetri IoT LoRaWAN real-time, sistem pendingin Evaporative Cooling Pad otomatis, dan konveyor kotoran teratur.',
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
    badge: 'Rekomendasi Utama (Best ROI)',
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
    name: 'Kandang Metaverse Cyber-Coop v4',
    tier: 'Hyper-Scale Web3 Mega-House',
    monthlyRentIdr: 3500000,
    capacityBirds: 1500,
    description: 'Fasilitas megahouse otonom dengan AI microclimate HVAC, panel surya microgrid, konveyor telur otomatis langsung ke unit timbangan gramasi, dan bukti attestation SLA on-chain.',
    ventilationType: 'AI Matrix HVAC Multi-Zone Variable Airflow',
    coolingSystem: 'Geothermal Heat Pump + Dual Evaporative Cooling Walls',
    sensors: [
      'Dual-Band LoRaWAN + Zigbee 3.0 Mesh Array',
      'Thermal Infrared Matrix Sensor (Deteksi Titik Demam Unggas)',
      'Sensor Multi-Gas (NH3, CO2, H2S, O2)',
      'Smart Contract Merkle Leaf Attestation Engine'
    ],
    eggBonusPercent: 45,
    badge: 'Enterprise Web3 Sovereign',
    recommended: false,
    specDetails: {
      dimensions: '60m x 14m x 5.5m (Multi-Zone Cyber Pod)',
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
    name: 'Paket Starter Node',
    tierLevel: 'starter',
    badge: 'Paket Mandiri Pemula',
    tagline: 'Solusi terjangkau untuk memulai peternakan ayam petelur produktif dengan efisiensi tinggi.',
    recommended: false,
    totalMonthlyRentIdr: 1250000,
    breakdown: {
      landCostIdr: 500000,
      coopCostIdr: 750000,
      landDesc: 'Lahan Peternakan Berdaulat (Kavling 1.000 m² dengan Zona Biosekuriti Steril)',
      coopDesc: 'Kandang Semi-Closed House Higienis (Standar Teknis Pinsar Nasional)'
    },
    capacityBirds: 150,
    hardwareSpecs: {
      ventilation: 'Dual Exhaust Blower 36 Inch & Tirai Insulasi Manual',
      sensors: 'Sensor NTC Analog Suhu & Sensor RH DHT22 Real-Time',
      coolingSystem: 'Sprinkler Kabut Micro-Mist Manual',
      structure: 'Konstruksi Baja Ringan Semi-Tertutup'
    },
    projectedNetProfitMonthly: {
      minIdr: 1200000,
      maxIdr: 1500000,
      displayRange: 'Rp 1.200.000 - Rp 1.500.000 / bln',
      dailyEggs: 132, // ~88% lay rate of 150
      monthlyEggRevenueIdr: 7425000, // 132 * 30 * 1875
      monthlyFeedCostIdr: 4725000,
      estNetProfitIdr: 1450000
    }
  },
  {
    id: 'pkg-pro-iot-tier1',
    name: 'Paket Pro IoT Tier-1',
    tierLevel: 'pro',
    badge: 'Pilihan Favorit Peternak (Best ROI)',
    tagline: 'Kandang closed-house 3 tingkat galvanis dengan otomasi tunnel ventilation dan sensor LoRaWAN.',
    recommended: true,
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
      structure: '3 Tingkat Galvanis Hot-Dip Anti-Karat & Konveyor Feses Otomatis'
    },
    projectedNetProfitMonthly: {
      minIdr: 4500000,
      maxIdr: 5500000,
      displayRange: 'Rp 4.500.000 - Rp 5.500.000 / bln',
      dailyEggs: 440, // ~88% lay rate of 500
      monthlyEggRevenueIdr: 24750000,
      monthlyFeedCostIdr: 14500000,
      estNetProfitIdr: 5200000
    }
  },
  {
    id: 'pkg-sovereign-mega',
    name: 'Paket Sovereign Mega-House',
    tierLevel: 'sovereign',
    badge: 'Enterprise Hyper-Scale Sovereign',
    tagline: 'Infrastruktur mega-house otonom berkapasitas 1.500 ekor dengan AI Matrix HVAC dan Solar Microgrid.',
    recommended: false,
    totalMonthlyRentIdr: 4000000,
    breakdown: {
      landCostIdr: 500000,
      coopCostIdr: 3500000,
      landDesc: 'Lahan Peternakan Berdaulat Kavling Luas (Akses Logistik Truk Pakan & Buffer Perimeter)',
      coopDesc: 'Kandang Cyber-Coop v4 Multi-Zone (AI Matrix HVAC + Geothermal Chiller)'
    },
    capacityBirds: 1500,
    hardwareSpecs: {
      ventilation: 'AI Matrix HVAC Multi-Zone Variable Airflow & Air Filtration HEPA H13',
      sensors: 'Dual-Band LoRaWAN + Zigbee 3.0 Mesh, Thermal Infrared Matrix Demam Unggas',
      coolingSystem: 'Geothermal Chiller + Dual Evaporative Cooling Walls',
      structure: 'Solar Microgrid Zero-Emission & Otomasi Panen Langsung On-Chain'
    },
    projectedNetProfitMonthly: {
      minIdr: 14000000,
      maxIdr: 18000000,
      displayRange: 'Rp 14.000.000 - Rp 18.000.000 / bln',
      dailyEggs: 1320, // ~88% lay rate of 1500
      monthlyEggRevenueIdr: 74250000,
      monthlyFeedCostIdr: 43500000,
      estNetProfitIdr: 16750000
    }
  }
];

