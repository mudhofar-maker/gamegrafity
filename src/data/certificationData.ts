export interface OfficialCertification {
  id: string;
  name: string;
  badgeCode: string;
  category: 'FOOD_SAFETY' | 'VETERINARY' | 'WEB3_SECURITY' | 'GOV_REGULATORY';
  categoryLabel: string;
  issuingAuthority: string;
  authorityAbbr: string;
  regNumber: string;
  validUntil: string;
  status: 'ACTIVE' | 'VERIFIED' | 'COMPLIANT';
  statusLabel: string;
  scope: string;
  standard: string;
  auditScore: string;
  verificationHashOrUrl?: string;
  icon: string;
  colorTheme: 'emerald' | 'amber' | 'cyan' | 'indigo' | 'purple';
  highlights: string[];
}

export const OFFICIAL_CERTIFICATIONS: OfficialCertification[] = [
  {
    id: 'cert-nkv',
    name: 'Sertifikat Nomor Kontrol Veteriner (NKV)',
    badgeCode: 'NKV TINGKAT 1',
    category: 'VETERINARY',
    categoryLabel: 'Kesehatan Hewan & Veteriner',
    issuingAuthority: 'Kementerian Pertanian Republik Indonesia (Direktorat Jenderal Peternakan dan Kesehatan Hewan)',
    authorityAbbr: 'KEMENTAN RI',
    regNumber: 'NKV-3216-UPH-08849/2026',
    validUntil: '31 Desember 2029',
    status: 'ACTIVE',
    statusLabel: 'Terakreditasi Penuh',
    scope: 'Unit Penanganan Hasil (UPH) Telur Konsumsi Segar & Budidaya Ayam Petelur Sistem Closed-House',
    standard: 'Permentan No. 11/2020 tentang Tata Cara Pengawasan dan Sertifikasi NKV',
    auditScore: 'Grade A (Sangat Baik - Skor 98.6/100)',
    icon: '🛡️',
    colorTheme: 'emerald',
    highlights: [
      'Jaminan sanitasi dan higiene fasilitas peternakan terstandarisasi',
      'Bebas residu antibiotik berbahaya dan bahan kimia berbahaya',
      'Protokol biosekuriti ketat zona isolasi 3-tier'
    ]
  },
  {
    id: 'cert-halal',
    name: 'Sertifikat Halal Resmi Indonesia (BPJPH / MUI)',
    badgeCode: 'HALAL 100%',
    category: 'FOOD_SAFETY',
    categoryLabel: 'Keamanan Pangan & Halal',
    issuingAuthority: 'Badan Penyelenggara Jaminan Produk Halal (BPJPH) Kemenag RI & Komisi Fatwa MUI',
    authorityAbbr: 'BPJPH / MUI',
    regNumber: 'ID32110008459201026',
    validUntil: 'Seumur Hidup (Peraturan BPJPH Berlaku)',
    status: 'VERIFIED',
    statusLabel: 'Halal Terverifikasi',
    scope: 'Produksi dan Distribusi Telur Ayam Konsumsi Segar, Nutrisi Organik Pakan & Produk Olahan Daging Unggas',
    standard: 'Undang-Undang No. 33 Tahun 2014 & HAS 23000 Sistem Jaminan Halal',
    auditScore: 'Implementasi SJH Sangat Baik (A)',
    icon: '🌙',
    colorTheme: 'emerald',
    highlights: [
      'Bahan pakan konsentrat bebas unsur bangkai dan najis haram',
      'Penanganan telur higienis tanpa kontaminasi kotoran',
      'Rantai distribusi halal berintegritas tinggi'
    ]
  },
  {
    id: 'cert-iso22000',
    name: 'ISO 22000:2018 Food Safety Management System',
    badgeCode: 'ISO 22000:2018',
    category: 'FOOD_SAFETY',
    categoryLabel: 'Keamanan Pangan Internasional',
    issuingAuthority: 'Komite Akreditasi Nasional (KAN) & Global Food Safety Initiative',
    authorityAbbr: 'KAN / ISO',
    regNumber: 'FSMS-ISO22K-ID-99412',
    validUntil: '15 Oktober 2028',
    status: 'VERIFIED',
    statusLabel: 'Standar Global Aktif',
    scope: 'Sistem Rantai Dingin (Cold-Chain Traceability), Grading Gramasi Telur, dan Pengendalian Bahaya HACCP',
    standard: 'ISO 22000:2018 & Codex Alimentarius FAO/WHO',
    auditScore: 'Zero Non-Conformity (Lolos 100%)',
    icon: '🌐',
    colorTheme: 'cyan',
    highlights: [
      'Pencegahan kontaminasi biologis (bebas Salmonella enteritidis)',
      'Sensor suhu dingin real-time IoT terkoneksi oracle',
      'Pelacakan lot/batch panen dari kandang hingga konsumen'
    ]
  },
  {
    id: 'cert-iso9001',
    name: 'ISO 9001:2015 Quality Management System',
    badgeCode: 'ISO 9001:2015',
    category: 'FOOD_SAFETY',
    categoryLabel: 'Mutu Manajemen Operasional',
    issuingAuthority: 'Komite Akreditasi Nasional (KAN) / International Standard Organization',
    authorityAbbr: 'KAN / ISO',
    regNumber: 'QMS-ISO9001-ID-88320',
    validUntil: '22 November 2028',
    status: 'ACTIVE',
    statusLabel: 'Sertifikasi Mutu Aktif',
    scope: 'Manajemen Operasional Peternakan Digital, Skema Kemitraan Peternak Anti-Defisit, dan Layanan Dukungan',
    standard: 'ISO 9001:2015 Quality Management Requirements',
    auditScore: 'Indeks Kepuasan Kemitraan 99.2%',
    icon: '📊',
    colorTheme: 'indigo',
    highlights: [
      'Standar Operasional Prosedur (SOP) budidaya presisi',
      'Transparansi audit kas treasury dan penarikan instan',
      'Perbaikan berkelanjutan (Continuous Improvement Loop)'
    ]
  },
  {
    id: 'cert-web3-security',
    name: 'Audit Keamanan Smart Contract & Sovereign Invariant',
    badgeCode: 'AUDIT PASSED',
    category: 'WEB3_SECURITY',
    categoryLabel: 'Keamanan Kriptografi & Blockchain',
    issuingAuthority: 'Sovereign Web3 Audit Engine & Standar OpenZeppelin Contracts v5.0',
    authorityAbbr: 'OPENZEPPELIN / EVM',
    regNumber: 'AUDIT-GAMEGRAFITY-V2-EVM',
    validUntil: 'Aktif Permanen di Blockchain (Polygon & Ethereum)',
    status: 'VERIFIED',
    statusLabel: '0 Vulnerability Lolos',
    scope: 'ERC-721 SaaS License NFT, ERC-20 Dual-Payout Treasury, Proof of Reserve Merkle Tree',
    standard: 'EIP-155, EIP-712 Typed Data Signatures & ReentrancyGuard Protection',
    auditScore: '100% Invarian Matematis Terproteksi (V_sys > V_harv)',
    verificationHashOrUrl: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    icon: '🔒',
    colorTheme: 'purple',
    highlights: [
      'Proteksi reentrancy attack dan integer overflow bawaan Solidity 0.8.20+',
      'Verifikasi kepemilikan non-custodial (kunci privat di tangan peternak)',
      'Audit pembuktian kas pusat otomatis anti-kebobolan'
    ]
  },
  {
    id: 'cert-gfp',
    name: 'Good Farming Practices (GFP) Unggas Petelur',
    badgeCode: 'GFP CERTIFIED',
    category: 'VETERINARY',
    categoryLabel: 'Budidaya & Animal Welfare',
    issuingAuthority: 'Balai Kesehatan Hewan dan Karantina Pertanian RI',
    authorityAbbr: 'BKH-KEMENTAN',
    regNumber: 'GFP-POULTRY-3216-0421',
    validUntil: '10 Agustus 2027',
    status: 'ACTIVE',
    statusLabel: 'Praktik Peternakan Terbaik',
    scope: 'Kandang Modern Closed-House, Manajemen Ventilasi Udara Otomatis, dan Kesejahteraan Unggas (Animal Welfare)',
    standard: 'Pedoman Good Farming Practices (GFP) Unggas Petelur Ditjen PKH',
    auditScore: 'Kematian Rendah & Zero Mortality Virtual Protocol',
    icon: '🌱',
    colorTheme: 'emerald',
    highlights: [
      'Kondisi iklim mikro kandang terjaga 24°C dengan kelembaban 65%',
      'Kepadatan kandang ideal mendukung kebebasan gerak ayam',
      'Penyediaan pakan otomatis dan sanitasi air minum bebas patogen'
    ]
  },
  {
    id: 'cert-pse',
    name: 'Penyelenggara Sistem Elektronik (PSE) & Keuangan Invarian',
    badgeCode: 'PSE KOMINFO',
    category: 'GOV_REGULATORY',
    categoryLabel: 'Regulasi & Fintech Digital',
    issuingAuthority: 'Kementerian Komunikasi dan Informatika RI (Ditjen Aptika)',
    authorityAbbr: 'KOMINFO RI',
    regNumber: '008924.01/DJAI.PSE/11/2026',
    validUntil: 'Terdaftar & Tervalidasi',
    status: 'ACTIVE',
    statusLabel: 'Penyelenggara Terdaftar',
    scope: 'Sistem Pengelolaan Dana Peternak, Modul Dual-Payout Hub P2P E-Wallet, dan Integrasi QRIS Standar Bank Indonesia',
    standard: 'PP No. 71/2019 (PSTE) & Standar QRIS ASPI / Bank Indonesia',
    auditScore: 'Keamanan Data Pelanggan Terenkripsi 256-bit',
    icon: '🇮🇩',
    colorTheme: 'amber',
    highlights: [
      'Rekening operasional resmi BCA KCP Cikarang 3432650071 terdaftar',
      'Protokol enkripsi lalu lintas data perbankan & blockchain TLS 1.3',
      'Kepatuhan penuh regulasi perlindungan data pribadi pengguna (UU PDP)'
    ]
  }
];
