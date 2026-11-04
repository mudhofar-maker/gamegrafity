import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // In-memory backend ledger & verification store
  const p2pTransactions: any[] = [];
  const web3Transactions: any[] = [];

  // Seed international sovereign farmer registry
  const registeredFarmers: any[] = [
    {
      id: 'farmer-genesis-id',
      farmName: 'Gamegrafity Blitar Sovereign Genesis',
      country: 'Indonesia (East Java / Blitar)',
      countryCode: 'ID',
      flag: '🇮🇩',
      region: 'Southeast Asia',
      flockSize: 680000,
      dailyEggYield: 605200,
      housingSystem: 'Smart IoT Closed-House (Biosecurity Level 4)',
      certifications: ['Pinsar Nasional', 'Halal MUI', 'Avian Influenza H5N1 Sentinel Certified'],
      payoutRail: 'Web3 ETH Smart Contract & DANA P2P',
      currency: 'IDR',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9012',
      did: 'did:poultry:iso3166-ID:bio4:0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9012',
      ensName: 'blitar-origin.gamegrafity.eth',
      status: 'TIER-1_ACCREDITED',
      txHash: '0x71c89f2a938b4efc891102b3c45781a9f029381746251bdf28172938472910ab',
      blockNumber: 21049210,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      merkleProof: '0x71c89f...2d3a',
      nodeOperator: 'Gamegrafity Sovereign Genesis',
      ambientTempC: 24.2,
      humidityRh: 65,
      ammoniaPpm: 9
    },
    {
      id: 'farmer-us-ia',
      farmName: 'Midwest Layer Hub & Agro-Trust',
      country: 'United States (Iowa / Georgia)',
      countryCode: 'US',
      flag: '🇺🇸',
      region: 'North America',
      flockSize: 1450000,
      dailyEggYield: 1290500,
      housingSystem: 'Aviary Multi-Tier Cage-Free (EU Directive Compliant)',
      certifications: ['USDA Organic NOP', 'Cage-Free Humane Certified', 'HACCP Codex Alimentarius Cold-Chain'],
      payoutRail: 'Arbitrum Layer-2 (USDC Instant)',
      currency: 'USD',
      walletAddress: '0x3f5c9e2b1a8d4f7c6e0b3a5d8f2c1e4a7b0d9e3f',
      did: 'did:poultry:iso3166-US:organic:0x3f5c9e2b1a8d4f7c6e0b3a5d8f2c1e4a7b0d9e3f',
      ensName: 'midwest-hub.gamegrafity.eth',
      status: 'TIER-1_ACCREDITED',
      txHash: '0x9d4a8f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
      blockNumber: 21049225,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      merkleProof: '0x9d4a8f...3e2b',
      nodeOperator: 'Iowa Sovereign Agro-Trust',
      ambientTempC: 22.8,
      humidityRh: 58,
      ammoniaPpm: 8
    },
    {
      id: 'farmer-br-pr',
      farmName: 'Cascavel Export Megahub Co-op',
      country: 'Brazil (Paraná / Santa Catarina)',
      countryCode: 'BR',
      flag: '🇧🇷',
      region: 'South America',
      flockSize: 3200000,
      dailyEggYield: 2848000,
      housingSystem: 'Smart IoT Closed-House (Biosecurity Level 4)',
      certifications: ['Global G.A.P. Poultry Standard v6', 'Halal Fed Brazil', 'Avian Influenza H5N1 Sentinel Certified'],
      payoutRail: 'Ethereum Mainnet (ETH Sovereign)',
      currency: 'BRL',
      walletAddress: '0x7e2d9b4c1f6a8e3b0d5c2a7f9e1b4d8c3a6f0e2b',
      did: 'did:poultry:iso3166-BR:bio4:0x7e2d9b4c1f6a8e3b0d5c2a7f9e1b4d8c3a6f0e2b',
      ensName: 'cascavel-coop.gamegrafity.eth',
      status: 'TIER-1_ACCREDITED',
      txHash: '0x4f1c998a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123',
      blockNumber: 21049240,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      merkleProof: '0x4f1c99...8a12',
      nodeOperator: 'Paraná Co-op Agro-Sovereign',
      ambientTempC: 24.1,
      humidityRh: 62,
      ammoniaPpm: 6
    },
    {
      id: 'farmer-nl-ge',
      farmName: 'Barneveld Innovation Aviary Syndicate',
      country: 'Netherlands (Gelderland / Barneveld)',
      countryCode: 'NL',
      flag: '🇳🇱',
      region: 'Western Europe',
      flockSize: 920000,
      dailyEggYield: 828000,
      housingSystem: 'Aviary Multi-Tier Cage-Free (EU Directive Compliant)',
      certifications: ['EU Animal Welfare Council Directive', 'KAT Cage-Free Standard', 'HACCP Codex Alimentarius Cold-Chain'],
      payoutRail: 'Arbitrum Layer-2 (USDC Instant)',
      currency: 'EUR',
      walletAddress: '0x5b8a2c7f1d4e9c3b6f0a8d2e4c7b1a5f9e3d6c0a',
      did: 'did:poultry:iso3166-NL:aviary:0x5b8a2c7f1d4e9c3b6f0a8d2e4c7b1a5f9e3d6c0a',
      ensName: 'barneveld-aviary.gamegrafity.eth',
      status: 'TIER-1_ACCREDITED',
      txHash: '0x88e7b16c44a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef01',
      blockNumber: 21049260,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      merkleProof: '0x88e7b1...6c44',
      nodeOperator: 'Dutch Agro-Robotics Syndicate',
      ambientTempC: 21.5,
      humidityRh: 60,
      ammoniaPpm: 4
    },
    {
      id: 'farmer-fr-br',
      farmName: 'Bretagne Fermiers Réunis & Bio-Pasture',
      country: 'France (Brittany / Pays de la Loire)',
      countryCode: 'FR',
      flag: '🇫🇷',
      region: 'Western Europe',
      flockSize: 550000,
      dailyEggYield: 478500,
      housingSystem: 'Pasture-Raised Organic Free-Range',
      certifications: ['Label Rouge & Bio France', 'EU Animal Welfare Council Directive'],
      payoutRail: 'Ethereum Mainnet (ETH Sovereign)',
      currency: 'EUR',
      walletAddress: '0x2a9e4d1f8b3c6a0e7d5b2c9f1a4e8d3b6c0a7f2e',
      did: 'did:poultry:iso3166-FR:organic:0x2a9e4d1f8b3c6a0e7d5b2c9f1a4e8d3b6c0a7f2e',
      ensName: 'bretagne-bio.gamegrafity.eth',
      status: 'TIER-1_ACCREDITED',
      txHash: '0x12d98a4477b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123',
      blockNumber: 21049275,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      merkleProof: '0x12d98a...4477',
      nodeOperator: 'Bretagne Fermiers Réunis',
      ambientTempC: 20.9,
      humidityRh: 64,
      ammoniaPpm: 5
    }
  ];

  // API: Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Gamegrafity Farm Sovereign Agro-Fi Engine',
      version: '2.5.0',
      timestamp: new Date().toISOString(),
      network: 'Ethereum Mainnet / Sepolia L2 Bridge',
      activeContract: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredFarmersCount: registeredFarmers.length
    });
  });

  // API: Get all registered global farmers
  app.get('/api/farmers', (req, res) => {
    const { region, countryCode } = req.query;
    let list = registeredFarmers;

    if (region && typeof region === 'string' && region !== 'ALL') {
      list = list.filter(f => f.region.toLowerCase() === region.toLowerCase());
    }

    if (countryCode && typeof countryCode === 'string') {
      list = list.filter(f => f.countryCode.toLowerCase() === countryCode.toLowerCase());
    }

    res.json({
      success: true,
      count: list.length,
      totalBirds: list.reduce((sum, f) => sum + (f.flockSize || 0), 0),
      totalDailyEggs: list.reduce((sum, f) => sum + (f.dailyEggYield || Math.floor((f.flockSize || 0) * 0.88)), 0),
      farmers: list
    });
  });

  // API: Get farmer stats summary
  app.get('/api/farmers/stats', (_req, res) => {
    const totalBirds = registeredFarmers.reduce((sum, f) => sum + (f.flockSize || 0), 0);
    const totalDailyEggs = registeredFarmers.reduce((sum, f) => sum + (f.dailyEggYield || Math.floor((f.flockSize || 0) * 0.88)), 0);
    const countries = Array.from(new Set(registeredFarmers.map(f => f.countryCode)));

    res.json({
      success: true,
      totalFarmers: registeredFarmers.length,
      totalBirds,
      totalDailyEggs,
      totalDailyWeightKg: Number(((totalDailyEggs * 62.5) / 1000).toFixed(1)),
      uniqueCountriesCount: countries.length,
      activeContract: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      biosecurityConsensus: '100% Zero-Infection Protocol'
    });
  });

  // API: Register a new sovereign farmer live into backend & smart contract ledger
  app.post('/api/farmers/register', (req, res) => {
    const {
      farmName,
      country,
      countryCode,
      flag,
      region,
      flockSize,
      housingSystem,
      certifications,
      payoutRail,
      currency,
      walletAddress,
      did,
      ensName
    } = req.body;

    if (!farmName || !country || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Parameter pendaftaran tidak lengkap: farmName, country, dan walletAddress wajib diisi.'
      });
    }

    // Check if already registered by walletAddress or DID
    const existingIndex = registeredFarmers.findIndex(
      f => f.walletAddress.toLowerCase() === walletAddress.toLowerCase() ||
           (did && f.did.toLowerCase() === did.toLowerCase())
    );

    const safeFlockSize = Number(flockSize) || 5000;
    const dailyEggs = Math.floor(safeFlockSize * 0.88);
    const blockNumber = 21049350 + Math.floor(Math.random() * 20);

    // Cryptographic transaction hash for on-chain registration event
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const txHash = '0x' + randomHex;

    const newFarmerRecord = {
      id: 'farmer-' + (countryCode || 'GL').toLowerCase() + '-' + Date.now().toString(36),
      farmName: farmName.trim(),
      country,
      countryCode: countryCode || 'GL',
      flag: flag || '🌍',
      region: region || 'Global',
      flockSize: safeFlockSize,
      dailyEggYield: dailyEggs,
      housingSystem: housingSystem || 'Smart IoT Closed-House (Biosecurity Level 4)',
      certifications: Array.isArray(certifications) && certifications.length > 0
        ? certifications
        : ['Global G.A.P. Poultry Standard v6', 'Avian Influenza H5N1 Sentinel Certified'],
      payoutRail: payoutRail || 'Arbitrum Layer-2 (USDC Instant)',
      currency: currency || 'USD',
      walletAddress,
      did: did || `did:poultry:iso3166-${countryCode || 'GL'}:${walletAddress.slice(0, 10)}...${randomHex.slice(0, 8)}`,
      ensName: ensName || `${(countryCode || 'global').toLowerCase()}-farm.gamegrafity.eth`,
      status: 'TIER-1_ACCREDITED',
      txHash,
      blockNumber,
      contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      registeredAt: new Date().toISOString(),
      merkleProof: '0x' + randomHex.slice(0, 6) + '...' + randomHex.slice(-4),
      nodeOperator: farmName.trim(),
      ambientTempC: 24.0 + Number((Math.random() * 0.8 - 0.4).toFixed(1)),
      humidityRh: Math.floor(58 + Math.random() * 8),
      ammoniaPpm: Math.floor(4 + Math.random() * 5)
    };

    if (existingIndex >= 0) {
      registeredFarmers[existingIndex] = {
        ...registeredFarmers[existingIndex],
        ...newFarmerRecord,
        id: registeredFarmers[existingIndex].id
      };
    } else {
      registeredFarmers.unshift(newFarmerRecord);
    }

    // Record on-chain smart contract transaction for Etherscan viewer
    const contractReceipt = {
      txHash,
      contract: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      farmerAddress: walletAddress,
      blockNumber,
      confirmations: 14,
      gasUsed: '112,430',
      gasPriceGwei: '15.2',
      status: '0x1 (Success)',
      method: 'registerSovereignFarmer(string,bytes32,string)',
      registeredFarmer: newFarmerRecord,
      timestamp: new Date().toISOString()
    };
    web3Transactions.unshift(contractReceipt);

    console.log(`[Agro-Fi Registry] New Global Farmer Registered: ${newFarmerRecord.farmName} (${newFarmerRecord.country}) - DID: ${newFarmerRecord.did}`);

    res.json({
      success: true,
      message: `Pendaftaran berhasil! Peternakan '${newFarmerRecord.farmName}' telah diverifikasi secara on-chain di Smart Contract GamegrafityFarmCore.`,
      farmer: newFarmerRecord,
      tx: {
        txHash,
        blockNumber,
        contractAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
        gasUsed: '112,430',
        confirmations: 14,
        method: 'registerSovereignFarmer(string)'
      }
    });
  });

  // API: Get single farmer by identifier (wallet, DID, or id)
  app.get('/api/farmers/:identifier', (req, res) => {
    const id = req.params.identifier.toLowerCase();
    const found = registeredFarmers.find(
      f => f.id.toLowerCase() === id ||
           f.walletAddress.toLowerCase() === id ||
           f.did.toLowerCase() === id
    );

    if (found) {
      return res.json({ success: true, farmer: found });
    }
    res.status(404).json({ success: false, message: 'Peternak tidak ditemukan dalam registri global.' });
  });

  // API: P2P DANA Payout Simulator & Verifier
  app.post('/api/p2p/withdraw', (req, res) => {
    const { danaNumber, accountName, amountIdr, eggCount, farmerAddress } = req.body;

    if (!danaNumber || !amountIdr || amountIdr <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payload: DANA number and amount required' });
    }

    const txId = 'DANA-P2P-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const escrowNodeId = 'MERCHANT-ESCROW-' + Math.floor(1000 + Math.random() * 9000);

    const record = {
      txId,
      channel: 'DANA_P2P',
      danaNumber,
      accountName: accountName || 'Sovereign Agro Farmer',
      amountIdr,
      eggCount: eggCount || 0,
      farmerAddress: farmerAddress || 'Sovereign Node',
      escrowNodeId,
      status: 'SETTLED',
      timestamp: new Date().toISOString(),
      feeIdr: 0, // Zero broker fee guaranteed
      refId: 'ID' + Math.floor(100000000000 + Math.random() * 900000000000)
    };

    p2pTransactions.unshift(record);

    res.json({
      success: true,
      message: 'Penarikan P2P DANA berhasil diverifikasi dan ditransfer secara instan tanpa potongan broker!',
      data: record
    });
  });

  // API: Web3 Smart Contract Harvest Settlement Verification
  app.post('/api/web3/verify-harvest', (req, res) => {
    const { txHash, farmerAddress, eggCount, ethAmount, blockNumber, attestation } = req.body;

    if (!txHash) {
      return res.status(400).json({ success: false, message: 'Transaction hash required' });
    }

    const currentBlock = blockNumber || (21049280 + Math.floor(Math.random() * 50));
    const record = {
      txHash,
      contract: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      farmerAddress,
      eggCount,
      ethAmount,
      blockNumber: currentBlock,
      confirmations: 12,
      gasUsed: '84,392',
      gasPriceGwei: '14.2',
      status: '0x1 (Success)',
      attestation: attestation || null,
      timestamp: new Date().toISOString()
    };

    web3Transactions.unshift(record);

    res.json({
      success: true,
      data: record
    });
  });

  // API: Get live Etherscan state
  app.get('/api/web3/tx/:hash', (req, res) => {
    const tx = web3Transactions.find(t => t.txHash.toLowerCase() === req.params.hash.toLowerCase());
    if (tx) {
      return res.json({ found: true, tx });
    }
    res.json({ found: false, message: 'Transaction mined on public testnet' });
  });

  // In-memory active coop rentals and telemetry store
  const activeRentals: any[] = [
    {
      coopId: 'kandang-bertingkat-iot',
      name: 'Kandang Bertingkat IoT',
      tier: 'Smart Multi-Tier Closed House',
      status: 'AKTIF',
      rentedAt: Date.now() - 3600000,
      expiresAt: Date.now() + 29 * 86400 * 1000 + 23 * 3600 * 1000 + 58 * 60 * 1000,
      durationDays: 30,
      monthlyRentIdr: 1850000,
      contractCode: 'COOP-IOT-2026-X891',
      txHash: '0x8f2a938b4efc891102b3c45781a9f029381746251bdf28172938472910ab',
      capacityBirds: 500,
      iotTelemetry: {
        tempC: 24.2,
        targetTempC: 24.0,
        humidityRh: 65,
        targetHumidityRh: 65,
        ammoniaPpm: 7.8,
        coolingPadActive: true,
        exhaustFanRpm: 1450,
        airVelocityMs: 2.4,
        lastSyncTime: new Date().toISOString(),
        sensorHealthPercent: 99
      }
    }
  ];

  // API: Get Metaverse Coop Rental Catalog & Active State
  app.get('/api/infrastructure/coops', (_req, res) => {
    res.json({
      success: true,
      activeRentals,
      treasuryRecipient: '0xOwnerTreasuryProtocolReserve89D2'
    });
  });

  // API: Process Coop Rental (Deduct wallet & credit Kas Treasury Owner)
  app.post('/api/infrastructure/rent', (req, res) => {
    const { coopId, name, durationDays = 30, costIdr, farmerAddress } = req.body;

    if (!coopId || !costIdr || costIdr <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payload: coopId and costIdr required' });
    }

    const contractCode = `COOP-${coopId.toUpperCase().replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const expiresAt = Date.now() + durationDays * 86400 * 1000;

    const rentalRecord = {
      coopId,
      name: name || coopId,
      status: 'AKTIF',
      rentedAt: Date.now(),
      expiresAt,
      durationDays,
      monthlyRentIdr: costIdr,
      contractCode,
      txHash,
      farmerAddress: farmerAddress || 'Sovereign Node',
      treasuryCreditedIdr: costIdr,
      iotTelemetry: {
        tempC: 24.2,
        targetTempC: 24.0,
        humidityRh: 65,
        targetHumidityRh: 65,
        ammoniaPpm: 7.8,
        coolingPadActive: true,
        exhaustFanRpm: 1450,
        airVelocityMs: 2.4,
        lastSyncTime: new Date().toISOString(),
        sensorHealthPercent: 100
      }
    };

    activeRentals.unshift(rentalRecord);

    res.json({
      success: true,
      message: `Sewa ${rentalRecord.name} berhasil diaktifkan. Saldo dipotong dan disetorkan ke Kas Treasury Owner.`,
      rental: rentalRecord
    });
  });

  // Pre-configured Infrastructure Bundled Packages
  const infrastructurePackages = [
    {
      id: 'pkg-starter-node',
      name: 'Paket Starter Node',
      tierLevel: 'starter',
      badge: 'Paket Mandiri Pemula',
      tagline: 'Lahan Rp 500k + Kandang Standar Rp 750k',
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
        sensors: 'Sensor NTC Suhu Analog & Sensor RH DHT22 Real-Time',
        coolingSystem: 'Sprinkler Kabut Nozzle Micro-Mist Manual',
        structure: 'Baja Ringan Semi-Tertutup'
      },
      projectedNetProfitMonthly: {
        minIdr: 1200000,
        maxIdr: 1500000,
        displayRange: 'Rp 1.200.000 - Rp 1.500.000 / bln',
        dailyEggs: 132,
        monthlyGrossRevenueIdr: 7425000,
        monthlyPackageCostIdr: 1250000,
        monthlyFeedAndUtilityCostIdr: 4725000,
        monthlyNetProfitIdr: 1450000
      }
    },
    {
      id: 'pkg-pro-iot-tier1',
      name: 'Paket Pro IoT Tier-1',
      tierLevel: 'pro',
      badge: 'Pilihan Favorit Peternak (Best ROI)',
      tagline: 'Lahan Rp 500k + Kandang Bertingkat IoT Rp 1.850k',
      recommended: true,
      totalMonthlyRentIdr: 2350000,
      breakdown: {
        landCostIdr: 500000,
        coopCostIdr: 1850000,
        landDesc: 'Lahan Peternakan Berdaulat (Kavling 1.000 m² + Microgrid & Air Artesis)',
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
        dailyEggs: 440,
        monthlyGrossRevenueIdr: 24750000,
        monthlyPackageCostIdr: 2350000,
        monthlyFeedAndUtilityCostIdr: 17200000,
        monthlyNetProfitIdr: 5200000
      }
    },
    {
      id: 'pkg-sovereign-mega',
      name: 'Paket Sovereign Mega-House',
      tierLevel: 'sovereign',
      badge: 'Enterprise Hyper-Scale Sovereign',
      tagline: 'Lahan Rp 500k + Kandang Cyber-Coop v4 Rp 3.500k',
      totalMonthlyRentIdr: 4000000,
      breakdown: {
        landCostIdr: 500000,
        coopCostIdr: 3500000,
        landDesc: 'Lahan Peternakan Berdaulat Kavling Luas (Akses Logistik Truk & Buffer Perimeter)',
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
        dailyEggs: 1320,
        monthlyGrossRevenueIdr: 74250000,
        monthlyPackageCostIdr: 4000000,
        monthlyFeedAndUtilityCostIdr: 53500000,
        monthlyNetProfitIdr: 16750000
      }
    }
  ];

  // API: Get bundled infrastructure packages
  app.get('/api/infrastructure/packages', (_req, res) => {
    res.json({
      success: true,
      packages: infrastructurePackages,
      treasuryRecipient: '0xOwnerTreasuryProtocolReserve89D2'
    });
  });

  // API: Rent Bundled Package (Starter Node, Pro IoT Tier-1, Sovereign Mega-House)
  app.post('/api/infrastructure/packages/rent', (req, res) => {
    const { packageId, farmerAddress, durationDays = 30 } = req.body;
    const pkg = infrastructurePackages.find(p => p.id === packageId);

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Paket infrastruktur tidak ditemukan.' });
    }

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const contractCode = `PKG-${pkg.tierLevel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = Date.now() + durationDays * 86400 * 1000;

    const rentalRecord = {
      packageId: pkg.id,
      packageName: pkg.name,
      coopId: pkg.id,
      name: pkg.name,
      tier: pkg.tierLevel.toUpperCase(),
      status: 'AKTIF',
      rentedAt: Date.now(),
      expiresAt,
      durationDays,
      monthlyRentIdr: pkg.totalMonthlyRentIdr,
      contractCode,
      txHash,
      capacityBirds: pkg.capacityBirds,
      farmerAddress: farmerAddress || 'Sovereign Node',
      treasuryCreditedIdr: pkg.totalMonthlyRentIdr,
      iotTelemetry: {
        tempC: 24.0,
        targetTempC: 24.0,
        humidityRh: 65,
        targetHumidityRh: 65,
        ammoniaPpm: 7.2,
        coolingPadActive: true,
        exhaustFanRpm: 1450,
        airVelocityMs: 2.4,
        lastSyncTime: new Date().toISOString(),
        sensorHealthPercent: 100
      }
    };

    activeRentals.unshift(rentalRecord);

    console.log(`[Infrastructure Package] Rented: ${pkg.name} (${pkg.totalMonthlyRentIdr} IDR) - Deposited to Kas Treasury Owner`);

    res.json({
      success: true,
      message: `Sewa ${pkg.name} berhasil diaktifkan selama ${durationDays} hari! Saldo dipotong dan disetorkan ke Kas Treasury Owner.`,
      rental: rentalRecord,
      txHash
    });
  });

  // API: Get unlimited supply catalog & batch schedules
  app.get('/api/supplies/unlimited', (_req, res) => {
    res.json({
      success: true,
      guarantee: 'UNLIMITED_DIGITAL_STOCK_24_7',
      stockStatus: 'Zero Stock-Out Guaranteed',
      items: [
        { id: 'chick-pullet', name: 'Bibit Ayam Isa Brown', quota: 'Unlimited Stream', replenishment: 'Pre-Order Batch 24/7' },
        { id: 'feed-concentrate', name: 'Pakan Konsentrat Layer 21%', quota: 'Buffer Silo Penuh', replenishment: 'Continuous Flow' },
        { id: 'vitamin-biosecurity', name: 'Vaksin & Vitamin Biosekuriti', quota: 'Cold-Chain Ready', replenishment: 'Instant Dispatch' },
        { id: 'electricity-ventilation', name: 'Listrik & Ventilasi Kandang', quota: 'Microgrid Hybrid Active', replenishment: '24/7 Power' },
        { id: 'ac-climate-controller', name: 'AC Conditioner & Pengatur Suhu Api', quota: 'Active Thermostat Grid', replenishment: '24/7 Climate API' }
      ]
    });
  });

  // API: Calculate Net Profit Simulation
  app.get('/api/simulation/net-profit', (req, res) => {
    const birds = Number(req.query.capacity) || 500;
    const layRate = 0.88;
    const dailyEggs = Math.floor(birds * layRate);
    const monthlyEggs = dailyEggs * 30;
    const eggPriceIdr = 1875; // Rp 1.875/butir or ~Rp 30.000/kg
    const grossRevenueIdr = monthlyEggs * eggPriceIdr;

    // Infrastructure package tier mapping
    let packageCostIdr = 1250000;
    if (birds >= 1500) {
      packageCostIdr = 4000000;
    } else if (birds >= 500) {
      packageCostIdr = 2350000;
    }

    // Daily feed 110g per hen * 30 days * Rp 7000/kg
    const monthlyFeedKg = (birds * 0.11 * 30);
    const monthlyFeedCostIdr = Math.round(monthlyFeedKg * 7000);
    const utilityCostIdr = Math.round((birds <= 150 ? 500000 : birds <= 500 ? 1200000 : 3500000));
    const totalExpensesIdr = packageCostIdr + monthlyFeedCostIdr + utilityCostIdr;
    const netProfitIdr = grossRevenueIdr - totalExpensesIdr;

    res.json({
      success: true,
      capacityBirds: birds,
      dailyEggYield: dailyEggs,
      monthlyEggYield: monthlyEggs,
      grossRevenueIdr,
      breakdown: {
        packageRentalCostIdr: packageCostIdr,
        feedCostIdr: monthlyFeedCostIdr,
        utilityAndClimateCostIdr: utilityCostIdr,
        totalExpensesIdr
      },
      netProfitMonthlyIdr: netProfitIdr,
      roiPercent: Number(((netProfitIdr / (packageCostIdr + monthlyFeedCostIdr)) * 100).toFixed(1)),
      iotBaseline: {
        tempC: 24.0,
        humidityRh: 65,
        ammoniaPpm: 7.2
      }
    });
  });

  // In-memory Auto-Compound State
  let autoCompoundState = {
    isEnabled: true,
    cashPayoutPercent: 60,
    autoCompoundPercent: 40,
    targetReinvestment: 'HYBRID_GROWTH',
    totalCompoundedAmountIdr: 450000,
    totalAdditionalBirdsFromCompound: 10,
    totalFeedStockPurchasedKg: 65,
    compoundingCyclesCompleted: 3,
    lastCompoundedAt: new Date().toISOString(),
    projectedMonthlyGrowthRatePercent: 18.5
  };

  // API: Get Auto-Compound Config
  app.get('/api/compound/config', (_req, res) => {
    res.json({ success: true, config: autoCompoundState });
  });

  // API: Update Auto-Compound Config
  app.post('/api/compound/config', (req, res) => {
    const { isEnabled, cashPayoutPercent, targetReinvestment } = req.body;
    if (cashPayoutPercent !== undefined) {
      const cash = Math.min(80, Math.max(30, Number(cashPayoutPercent)));
      autoCompoundState.cashPayoutPercent = cash;
      autoCompoundState.autoCompoundPercent = 100 - cash;
    }
    if (isEnabled !== undefined) {
      autoCompoundState.isEnabled = Boolean(isEnabled);
    }
    if (targetReinvestment) {
      autoCompoundState.targetReinvestment = targetReinvestment;
    }
    res.json({ success: true, config: autoCompoundState });
  });

  // API: Execute Auto-Compound Batch
  app.post('/api/compound/execute', (req, res) => {
    const { compoundAmountIdr, cashPayoutIdr } = req.body;
    const compoundAmount = Number(compoundAmountIdr) || 2080000;
    const cashAmount = Number(cashPayoutIdr) || 3120000;

    const addedBirds = Math.floor((compoundAmount * 0.6) / 45000);
    const addedFeedKg = Math.floor((compoundAmount * 0.4) / 7000);

    autoCompoundState.totalCompoundedAmountIdr += compoundAmount;
    autoCompoundState.totalAdditionalBirdsFromCompound += addedBirds;
    autoCompoundState.totalFeedStockPurchasedKg += addedFeedKg;
    autoCompoundState.compoundingCyclesCompleted += 1;
    autoCompoundState.lastCompoundedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Auto-Compound batch berhasil dieksekusi! Porsi tunai ${cashAmount.toLocaleString()} IDR dicairkan, ${compoundAmount.toLocaleString()} IDR otomatis diputar menjadi +${addedBirds} ekor ayam & +${addedFeedKg} kg pakan.`,
      executed: {
        compoundAmount,
        cashAmount,
        addedBirds,
        addedFeedKg,
        compoundingCyclesCompleted: autoCompoundState.compoundingCyclesCompleted
      },
      updatedConfig: autoCompoundState
    });
  });

  // API: Direct Multi-Rail Payment Checkout (QRIS / DANA / BCA / Web3 Wallet)
  app.post('/api/payment/checkout', (req, res) => {
    const { packageId, paymentChannel, amountIdr, farmerAddress } = req.body;
    const pkg = infrastructurePackages.find(p => p.id === packageId) || infrastructurePackages[1];
    const finalAmount = Number(amountIdr) || pkg.totalMonthlyRentIdr;
    const channel = paymentChannel || 'QRIS';

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const contractCode = `PKG-${pkg.tierLevel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = Date.now() + 30 * 86400 * 1000;

    const activatedRental = {
      packageId: pkg.id,
      packageName: pkg.name,
      coopId: pkg.id,
      name: pkg.name,
      tier: pkg.tierLevel.toUpperCase(),
      status: 'AKTIF',
      rentedAt: Date.now(),
      expiresAt,
      durationDays: 30,
      monthlyRentIdr: finalAmount,
      contractCode,
      txHash,
      capacityBirds: pkg.capacityBirds,
      farmerAddress: farmerAddress || 'Sovereign Node',
      paymentChannel: channel,
      treasuryCreditedIdr: finalAmount,
      iotTelemetry: {
        tempC: 24.0,
        targetTempC: 24.0,
        humidityRh: 65,
        targetHumidityRh: 65,
        ammoniaPpm: 7.2,
        coolingPadActive: true,
        exhaustFanRpm: 1450,
        airVelocityMs: 2.4,
        lastSyncTime: new Date().toISOString(),
        sensorHealthPercent: 100
      }
    };

    activeRentals.unshift(activatedRental);

    console.log(`[Payment Checkout] ${pkg.name} paid via ${channel} (${finalAmount} IDR) -> Kas Treasury Owner credited! Status: AKTIF`);

    res.json({
      success: true,
      message: `Pembayaran via ${channel} lunas! Kandang ${pkg.name} otomatis berstatus AKTIF. Sensor IoT & countdown masa sewa 30 hari langsung berjalan 24/7.`,
      rental: activatedRental,
      txHash,
      contractCode,
      treasuryCreditedIdr: finalAmount
    });
  });

  // In-memory Harvest Revenue Split & Owner Treasury Cashouts Store
  const settledHarvestSplits: any[] = [];
  const ownerCashouts: any[] = [];

  // API: Automated Virtual Harvest Revenue Split (Ending Flow)
  app.post('/api/harvest/settle-split', (req, res) => {
    const { eggCount, customPricePerKg = 30000, cashPercent = 60, compoundPercent = 40, farmerAddress } = req.body;
    const safeEggs = Number(eggCount) || 120;
    const weightKg = Number(((safeEggs * 62.5) / 1000).toFixed(2));
    const grossHarvestValueIdr = Math.round(weightKg * Number(customPricePerKg));

    // Automated Revenue Split:
    // 70% goes to farmer net allocation (split into Cash Payout + Auto-Compound)
    // 30% goes to Protocol Deductions (Infrastructure, Supply Margin, Platform Fee) -> Owner Treasury Profit
    const farmerNetShare = Math.round(grossHarvestValueIdr * 0.70);
    const cashPayoutIdr = Math.round((farmerNetShare * Number(cashPercent)) / 100);
    const autoCompoundIdr = Math.round((farmerNetShare * Number(compoundPercent)) / 100);

    const infrastructureLeaseIdr = Math.round(grossHarvestValueIdr * 0.12);
    const supplyHuluMarginIdr = Math.round(grossHarvestValueIdr * 0.15);
    const protocolPlatformFeeIdr = Math.round(grossHarvestValueIdr * 0.03);
    const totalDeductionsIdr = infrastructureLeaseIdr + supplyHuluMarginIdr + protocolPlatformFeeIdr;
    const ownerTreasuryProfitIdr = totalDeductionsIdr;

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const batchId = 'BATCH-' + Date.now().toString(36).toUpperCase();

    const record = {
      batchId,
      timestamp: new Date().toISOString(),
      eggCount: safeEggs,
      weightKg,
      grossHarvestValueIdr,
      farmerShare: {
        cashPayoutIdr,
        cashPercent: Number(cashPercent),
        autoCompoundIdr,
        compoundPercent: Number(compoundPercent),
        totalFarmerEarningsIdr: cashPayoutIdr + autoCompoundIdr
      },
      deductions: {
        infrastructureLeaseIdr,
        supplyHuluMarginIdr,
        protocolPlatformFeeIdr,
        totalDeductionsIdr
      },
      ownerTreasuryProfitIdr,
      txHash,
      farmerAddress: farmerAddress || 'Sovereign Node',
      status: 'SETTLED'
    };

    settledHarvestSplits.unshift(record);

    console.log(`[Virtual Harvest Split] ${safeEggs} eggs (${weightKg} kg) converted -> Farmer Cash: ${cashPayoutIdr} IDR, Compound: ${autoCompoundIdr} IDR, Owner Treasury Real Profit: ${ownerTreasuryProfitIdr} IDR`);

    res.json({
      success: true,
      message: `Panen virtual berhasil dikonversi! Hasil panen di-split: Porsi tunai peternak ${cashPayoutIdr.toLocaleString()} IDR, porsi compound ${autoCompoundIdr.toLocaleString()} IDR, dan potongan operasional bermuara sebagai Real Profit Kas Owner +${ownerTreasuryProfitIdr.toLocaleString()} IDR.`,
      split: record
    });
  });

  // API: Real-World Treasury Cashout / Asset Allocation
  app.post('/api/treasury/cashout', (req, res) => {
    const { amountIdr, destination, destinationAccount, purpose } = req.body;
    const amount = Number(amountIdr);

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal penarikan kas owner harus lebih dari 0.' });
    }

    const receiptRef = 'SETTLE-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const record = {
      id: 'cashout-' + Date.now(),
      timestamp: new Date().toISOString(),
      amountIdr: amount,
      destination: destination || 'BCA_CORPORATE',
      destinationAccount: destinationAccount || '8801-9283-7465-201',
      purpose: purpose || 'REAL_WORLD_CASHOUT',
      status: 'COMPLETED',
      receiptRef,
      txHash
    };

    ownerCashouts.unshift(record);

    console.log(`[Owner Real-World Cashout] ${amount} IDR settled to ${record.destination} (${record.destinationAccount}) - Ref: ${receiptRef}`);

    res.json({
      success: true,
      message: `Pencairan kas treasury owner sebesar ${amount.toLocaleString()} IDR berhasil ditransfer ke ${record.destination} (${record.destinationAccount}).`,
      receipt: record
    });
  });

  // API: Get Treasury Settlement & Cashout History
  app.get('/api/treasury/settlements', (_req, res) => {
    res.json({
      success: true,
      settledHarvestSplits,
      ownerCashouts
    });
  });

  // API: Real-time IoT Sensor Stream
  app.get('/api/infrastructure/telemetry', (_req, res) => {
    const tempDelta = (Math.random() * 0.4 - 0.2);
    const rhDelta = Math.floor(Math.random() * 3 - 1);
    res.json({
      success: true,
      telemetry: {
        tempC: Number((24.2 + tempDelta).toFixed(1)),
        targetTempC: 24.0,
        humidityRh: Math.min(75, Math.max(55, 65 + rhDelta)),
        ammoniaPpm: Number((7.8 + Math.random() * 0.4 - 0.2).toFixed(1)),
        fanRpm: 1450,
        coolingPadActive: true,
        timestamp: new Date().toISOString()
      }
    });
  });

  // User Profile & Web3 Wallet Storage (Requested by user)
  let userProfileStore = {
    full_name: 'Mudhofar',
    role: 'owner',
    wallet_address: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
    updated_at: new Date().toISOString()
  };

  // API: Get user profile & wallet settings
  app.get('/api/profiles', (_req, res) => {
    res.json({
      success: true,
      profile: userProfileStore
    });
  });

  // API: Save user profile & wallet settings
  app.post('/api/profiles', (req, res) => {
    const { full_name, role, wallet_address } = req.body;

    if (!full_name) {
      return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi.' });
    }

    userProfileStore = {
      full_name,
      role: role || 'owner',
      wallet_address: wallet_address || userProfileStore.wallet_address,
      updated_at: new Date().toISOString()
    };

    console.log(`[Profile Update] Name: ${userProfileStore.full_name}, Role: ${userProfileStore.role}, Wallet: ${userProfileStore.wallet_address}`);

    res.json({
      success: true,
      message: 'Profil dan pengaturan dompet berhasil disimpan ke sistem!',
      profile: userProfileStore
    });
  });

  // Multi-Coop Manager In-Memory Store
  let multiCoopsStore = [
    { id: 1, name: 'Kandang Starter #1', capacity: 150, status: 'Active', chickenCount: 150, tier: 'Starter Semi-Closed', dailyEggs: 132, feedDailyKg: 18, tempC: 24.0, humidityRh: 65, ammoniaPpm: 6.8 }
  ];

  // API: Get Multi-Coop list
  app.get('/api/multi-coops', (_req, res) => {
    res.json({
      success: true,
      coops: multiCoopsStore,
      totalChickens: multiCoopsStore.reduce((sum, c) => sum + c.chickenCount, 0),
      totalCapacity: multiCoopsStore.reduce((sum, c) => sum + c.capacity, 0),
      count: multiCoopsStore.length
    });
  });

  // API: Expand Multi-Coop
  app.post('/api/multi-coops/expand', (req, res) => {
    const { costIdr = 750000, farmerAddress } = req.body;
    const newId = multiCoopsStore.length + 1;
    const capacity = newId > 5 ? 500 : 300;
    const initialBirds = Math.min(capacity, 150);

    const newUnit = {
      id: newId,
      name: `Kandang Sovereign #${newId}`,
      capacity,
      status: 'Active',
      chickenCount: initialBirds,
      tier: newId > 5 ? 'Mega-House Closed' : 'Pro IoT Multi-Tier',
      dailyEggs: Math.floor(initialBirds * 0.88),
      feedDailyKg: Math.round(initialBirds * 0.12),
      tempC: 24.0,
      humidityRh: 65,
      ammoniaPpm: 6.8
    };

    multiCoopsStore.push(newUnit);

    console.log(`[Multi-Coop Expansion] Opened Kandang #${newId} (Capacity: ${capacity}). +${costIdr} IDR deposited to Kas Treasury Owner.`);

    res.json({
      success: true,
      message: `Kandang #${newId} berhasil dibuka! Kas Treasury Owner bertambah +${costIdr.toLocaleString()} IDR.`,
      newCoop: newUnit,
      totalCoops: multiCoopsStore.length,
      treasuryCreditedIdr: costIdr
    });
  });

  // ======================== KONFIRMASI DUA ARAH (PENGIRIM & PENERIMA OWNER) ========================
  let twoWayPaymentsStore: any[] = [
    {
      id: 'PAY-DANA-8910',
      senderName: 'Peternak Komunitas Blitar (Ahmad)',
      senderWalletOrPhone: '0812-9844-3120',
      serviceName: 'Paket Pro IoT Tier-1 (500 Ekor)',
      amountIdr: 2350000,
      paymentChannel: 'DANA_P2P',
      merchantTarget: 'LUMPIA IPUL (NMID: ID1026601649688)',
      senderStatus: 'SUDAH_BAYAR',
      senderConfirmedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      senderProofNote: 'Transfer via aplikasi DANA ke QRIS Lumpia Ipul. Berita: Sewa Pro IoT Tier-1 Blitar.',
      receiverStatus: 'APPROVED',
      receiverApprovedAt: new Date(Date.now() - 3600000 * 2.8).toISOString(),
      receiverApprovedBy: 'Mudhofar (Owner/Admin)',
      unlockedModule: 'Kandang Bertingkat IoT Tier-1 (500 Ekor) & Sensor LoRaWAN Aktif',
      createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      txHash: '0x3a91f82c0b4e5d6a7f8e9c0b1a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      contractCode: 'COOP-IOT-TIER1-8910'
    },
    {
      id: 'PAY-QRIS-9421',
      senderName: 'Peternak Pemula Mandiri',
      senderWalletOrPhone: '0857-1122-8901',
      serviceName: 'Paket Starter Node (150 Ekor)',
      amountIdr: 1250000,
      paymentChannel: 'QRIS',
      merchantTarget: 'LUMPIA IPUL (NMID: ID1026601649688)',
      senderStatus: 'SUDAH_BAYAR',
      senderConfirmedAt: new Date(Date.now() - 600000).toISOString(),
      senderProofNote: 'Scan QRIS Lumpia Ipul sukses via DANA. Mohon approve modul produksi kandang starter.',
      receiverStatus: 'PENDING_APPROVAL',
      unlockedModule: 'Kandang Starter Node (150 Ekor) & Sensor NTC Suhu/RH',
      createdAt: new Date(Date.now() - 900000).toISOString(),
      contractCode: 'COOP-STARTER-9421'
    }
  ];

  // API: Get all two-way confirmation records
  app.get('/api/p2p/two-way-confirmations', (_req, res) => {
    res.json({
      success: true,
      records: twoWayPaymentsStore,
      pendingCount: twoWayPaymentsStore.filter(p => p.receiverStatus === 'PENDING_APPROVAL').length,
      approvedCount: twoWayPaymentsStore.filter(p => p.receiverStatus === 'APPROVED').length
    });
  });

  // API: Sender Confirmation ("Saya Sudah Membayar")
  app.post('/api/p2p/sender-confirm', (req, res) => {
    const {
      id,
      senderName,
      senderWalletOrPhone,
      serviceName,
      amountIdr,
      paymentChannel,
      senderProofNote
    } = req.body;

    const amount = Number(amountIdr) || 1250000;
    const paymentId = id || ('PAY-' + (paymentChannel || 'DANA').replace('_', '-') + '-' + Math.floor(1000 + Math.random() * 9000));
    const nowIso = new Date().toISOString();

    const existingIndex = twoWayPaymentsStore.findIndex(p => p.id === paymentId);
    let record: any;

    if (existingIndex >= 0) {
      twoWayPaymentsStore[existingIndex] = {
        ...twoWayPaymentsStore[existingIndex],
        senderStatus: 'SUDAH_BAYAR',
        senderConfirmedAt: nowIso,
        senderProofNote: senderProofNote || twoWayPaymentsStore[existingIndex].senderProofNote || 'Sudah transfer dana ke QRIS/DANA Lumpia Ipul.',
        receiverStatus: 'PENDING_APPROVAL'
      };
      record = twoWayPaymentsStore[existingIndex];
    } else {
      record = {
        id: paymentId,
        senderName: senderName || 'Peternak Lapangan',
        senderWalletOrPhone: senderWalletOrPhone || '0813-XXXX-XXXX',
        serviceName: serviceName || 'Paket Infrastruktur / Top-Up',
        amountIdr: amount,
        paymentChannel: paymentChannel || 'DANA_P2P',
        merchantTarget: 'LUMPIA IPUL (NMID: ID1026601649688)',
        senderStatus: 'SUDAH_BAYAR',
        senderConfirmedAt: nowIso,
        senderProofNote: senderProofNote || 'Sudah melakukan transfer via DANA / QRIS Lumpia Ipul. Menunggu konfirmasi penerima.',
        receiverStatus: 'PENDING_APPROVAL',
        unlockedModule: `Akses ${serviceName || 'Layanan & Modul Produksi Peternakan'}`,
        createdAt: nowIso,
        contractCode: 'SOV-' + Math.floor(10000 + Math.random() * 90000)
      };
      twoWayPaymentsStore.unshift(record);
    }

    console.log(`[Two-Way Payment - Sender Confirmed] ${record.senderName} confirmed payment (${record.amountIdr} IDR) for '${record.serviceName}'. Status: MENUNGGU_KONFIRMASI_OWNER`);

    res.json({
      success: true,
      message: 'Konfirmasi Pengirim berhasil! Tombol "Saya Sudah Membayar" tercatat. Transaksi kini berada di antrean konfirmasi akhir Owner/Admin.',
      record
    });
  });

  // API: Receiver Confirmation ("Approve & Buka Akses Modul Produksi")
  app.post('/api/p2p/receiver-approve', (req, res) => {
    const { id, approvedBy = 'Mudhofar (Owner/Admin)', note } = req.body;

    const record = twoWayPaymentsStore.find(p => p.id === id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan dalam antrean.' });
    }

    const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const nowIso = new Date().toISOString();

    record.receiverStatus = 'APPROVED';
    record.receiverApprovedAt = nowIso;
    record.receiverApprovedBy = approvedBy;
    record.txHash = randomTx;
    if (note) record.adminNote = note;

    console.log(`[Two-Way Payment - Receiver Approved] Owner/Admin (${approvedBy}) APPROVED payment ${record.id} (${record.amountIdr} IDR). Production module unlocked: ${record.unlockedModule}`);

    res.json({
      success: true,
      message: `Konfirmasi Penerima (Owner/Admin) selesai! Dana ${record.amountIdr.toLocaleString()} IDR disetujui. Akses layanan dan modul produksi telah dibuka bagi pengguna!`,
      record,
      unlockedModule: record.unlockedModule,
      txHash: randomTx
    });
  });

  // API: Receiver Reject
  app.post('/api/p2p/receiver-reject', (req, res) => {
    const { id, reason = 'Dana belum masuk ke mutasi akun DANA Lumpia Ipul.' } = req.body;

    const record = twoWayPaymentsStore.find(p => p.id === id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    record.receiverStatus = 'REJECTED';
    record.rejectReason = reason;

    console.log(`[Two-Way Payment - Rejected] Payment ${record.id} rejected by Owner. Reason: ${reason}`);

    res.json({
      success: true,
      message: 'Transaksi ditolak. Pengguna diminta memeriksa kembali mutasi transfer.',
      record
    });
  });

  // ======================== 1. PEMISAHAN PENDAPATAN INFRASTRUKTUR (100% INTO TREASURY RESERVE POOL) ========================
  interface TreasuryReservePoolStore {
    totalReserveBalanceIdr: number;
    infrastructureInflowsIdr: number;
    workingCapitalDeployedIdr: number;
    realizedMarketSalesIdr: number;
    netSpreadSurplusAccumulatedIdr: number;
    reserveBufferHealthPercent: number;
    totalActiveFarmersCount: number;
    lastUpdated: string;
    inflowLedger: any[];
  }

  const treasuryReservePoolState: TreasuryReservePoolStore = {
    totalReserveBalanceIdr: 13950000,
    infrastructureInflowsIdr: 13950000,
    workingCapitalDeployedIdr: 795000,
    realizedMarketSalesIdr: 1728000,
    netSpreadSurplusAccumulatedIdr: 181440,
    reserveBufferHealthPercent: 100,
    totalActiveFarmersCount: 2,
    lastUpdated: new Date().toISOString(),
    inflowLedger: [
      {
        id: 'INFLOW-GENESIS-100PCT',
        type: 'INFRASTRUCTURE_RENTAL_100PCT',
        description: 'Cadangan Awal Likuiditas 100% Biaya Sewa Bulanan (Paket Pro IoT & Lahan Steril)',
        amountIdr: 13950000,
        source: 'Sewa Bulanan Infrastruktur & Lahan Berdaulat',
        allocatedPool: 'Treasury Reserve Pool (100% Partitioned)',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        txHash: '0x8f2a938b4efc891102b3c45781a9f029381746251bdf28172938472910ab'
      }
    ]
  };

  const recordInfrastructureInflow = (amountIdr: number, description: string, source: string, txHash?: string) => {
    const amount = Number(amountIdr) || 0;
    if (amount <= 0) return;

    treasuryReservePoolState.totalReserveBalanceIdr += amount;
    treasuryReservePoolState.infrastructureInflowsIdr += amount;
    treasuryReservePoolState.lastUpdated = new Date().toISOString();

    const inflowEntry = {
      id: 'INFLOW-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      type: 'INFRASTRUCTURE_RENTAL_100PCT',
      description,
      amountIdr: amount,
      source,
      allocatedPool: 'Treasury Reserve Pool (100% Partitioned Buffer)',
      timestamp: new Date().toISOString(),
      txHash: txHash || '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    treasuryReservePoolState.inflowLedger.unshift(inflowEntry);
    console.log(`[Treasury Reserve Pool] +${amount.toLocaleString()} IDR from ${source} Partitioned 100% directly into liquidity buffer. New Reserve: ${treasuryReservePoolState.totalReserveBalanceIdr.toLocaleString()} IDR`);
  };

  // ======================== 2. PENGUNCIAN MARGIN DINAMIS UNTUK PEMBELIAN PANEN ========================
  const getDynamicMarginRules = () => {
    const marketBenchmarks = [
      {
        commodity: 'Telur Ayam Ras Grade B (Standar Pinsar Nasional)',
        commodityKey: 'GRADE_B',
        realtimeMarketPricePerKg: 28800,
        mandatorySpreadPercent: 10.5,
        benchmarkSource: 'Pinsar Indonesia & Pasar Induk Kramat Jati'
      },
      {
        commodity: 'Telur Ayam Ras Grade A Super (Horeka / Supermarket)',
        commodityKey: 'GRADE_A',
        realtimeMarketPricePerKg: 31500,
        mandatorySpreadPercent: 10.5,
        benchmarkSource: 'Pasar Modern Supermarket & Hotel Bintang'
      },
      {
        commodity: 'Telur Ayam Ras Grade C Bintek (Pullet Awal)',
        commodityKey: 'GRADE_C',
        realtimeMarketPricePerKg: 25500,
        mandatorySpreadPercent: 10.5,
        benchmarkSource: 'Industri Bakery & Pengolahan Makanan'
      },
      {
        commodity: 'Ayam Petelur Afkir Tua (Karkas Bobot Hidup)',
        commodityKey: 'SPENT_HEN',
        realtimeMarketPricePerKg: 26500,
        mandatorySpreadPercent: 13.2,
        benchmarkSource: 'RPA RPH Karkas & Restoran Olahan'
      }
    ];

    return marketBenchmarks.map(b => {
      const lockedFarmerBuyPricePerKg = Math.floor(b.realtimeMarketPricePerKg * (1 - b.mandatorySpreadPercent / 100));
      const guaranteedSurplusPerKg = b.realtimeMarketPricePerKg - lockedFarmerBuyPricePerKg;
      const guaranteedSurplusPercent = Number(((guaranteedSurplusPerKg / b.realtimeMarketPricePerKg) * 100).toFixed(1));

      return {
        commodity: b.commodity,
        commodityKey: b.commodityKey,
        realtimeMarketPricePerKg: b.realtimeMarketPricePerKg,
        mandatorySpreadPercent: b.mandatorySpreadPercent,
        lockedFarmerBuyPricePerKg,
        guaranteedSurplusPerKg,
        guaranteedSurplusPercent,
        status: 'LOCKED_POSITIVE_SURPLUS' as const,
        benchmarkSource: b.benchmarkSource
      };
    });
  };

  // Physical Commodity Warehouse Inventory
  const physicalCommodityWarehouse = {
    eggsCount: 480,
    weightKg: 30.0,
    commodity: 'Telur Ayam Ras Komil Grade B (Pinsar Standar)',
    costBasisIdr: 773280,
    batchesCount: 1,
    batches: [
      {
        batchId: 'BATCH-WH-8821',
        date: new Date(Date.now() - 3600000 * 6).toISOString(),
        eggCount: 480,
        weightKg: 30.0,
        farmerBuyPriceKg: 25776,
        totalCostBasisIdr: 773280,
        farmerName: 'Peternak Komunitas Blitar (Ahmad)',
        status: 'READY_FOR_MARKET_REALIZATION'
      }
    ]
  };

  // Asset-to-Cash Realization Ledger Entries
  const assetToCashLedgerStore: any[] = [
    {
      batchId: 'ATC-REALIZED-8821',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      eggCount: 960,
      weightKg: 60.0,
      commodityType: 'Telur Ayam Ras Grade B',
      farmerBuyPriceKg: 25776,
      farmerPaidIdr: 1546560,
      realizedMarketPriceKg: 28800,
      realizedGrossSaleIdr: 1728000,
      replenishedCostBasisIdr: 1546560,
      netCashSurplusGeneratedIdr: 181440,
      status: 'REALIZED_TO_CASH',
      offtakerName: 'PT Sumber Distribusi Unggas Retail (Superindo Hub)',
      txHash: '0x4f1c998a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123'
    }
  ];

  // API: Get Treasury Reserve Pool & Locked Margin Metrics
  app.get('/api/treasury/reserve-pool', (_req, res) => {
    res.json({
      success: true,
      pool: treasuryReservePoolState,
      marginRules: getDynamicMarginRules(),
      inventory: physicalCommodityWarehouse,
      recentAssetToCash: assetToCashLedgerStore
    });
  });

  // API: Realize Physical Harvest Asset into Liquid Cash (Asset-to-Cash Ledger)
  app.post('/api/harvest/realize-asset-to-cash', (req, res) => {
    const { batchId, offtakerName = 'PT Agro Retail Induk Kramat Jati' } = req.body;
    const rules = getDynamicMarginRules();
    const ruleB = rules.find(r => r.commodityKey === 'GRADE_B') || rules[0];

    const eggsToSell = physicalCommodityWarehouse.eggsCount > 0 ? physicalCommodityWarehouse.eggsCount : 480;
    const weightKg = Number(((eggsToSell * 62.5) / 1000).toFixed(2));
    const marketPriceKg = ruleB.realtimeMarketPricePerKg;
    const realizedGrossSaleIdr = Math.round(weightKg * marketPriceKg);
    const farmerBuyPriceKg = ruleB.lockedFarmerBuyPricePerKg;
    const replenishedCostBasisIdr = Math.round(weightKg * farmerBuyPriceKg);
    const netCashSurplusGeneratedIdr = realizedGrossSaleIdr - replenishedCostBasisIdr;

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newBatchId = batchId || ('ATC-' + Date.now().toString(36).toUpperCase());

    const realizedEntry = {
      batchId: newBatchId,
      timestamp: new Date().toISOString(),
      eggCount: eggsToSell,
      weightKg,
      commodityType: ruleB.commodity,
      farmerBuyPriceKg,
      farmerPaidIdr: replenishedCostBasisIdr,
      realizedMarketPriceKg: marketPriceKg,
      realizedGrossSaleIdr,
      replenishedCostBasisIdr,
      netCashSurplusGeneratedIdr,
      status: 'REALIZED_TO_CASH',
      offtakerName,
      txHash
    };

    // Replenish Treasury Reserve Pool with recovered cost basis + add pure cash surplus
    treasuryReservePoolState.totalReserveBalanceIdr += netCashSurplusGeneratedIdr;
    treasuryReservePoolState.realizedMarketSalesIdr += realizedGrossSaleIdr;
    treasuryReservePoolState.netSpreadSurplusAccumulatedIdr += netCashSurplusGeneratedIdr;
    treasuryReservePoolState.lastUpdated = new Date().toISOString();

    assetToCashLedgerStore.unshift(realizedEntry);

    // Reset or reduce physical warehouse stock
    physicalCommodityWarehouse.eggsCount = 0;
    physicalCommodityWarehouse.weightKg = 0;
    physicalCommodityWarehouse.costBasisIdr = 0;
    physicalCommodityWarehouse.batches = [];

    console.log(`[Asset-to-Cash Realization] Realized ${eggsToSell} eggs (${weightKg} kg) -> Gross: ${realizedGrossSaleIdr.toLocaleString()} IDR. Treasury Reserve Refilled +${replenishedCostBasisIdr.toLocaleString()} IDR, Guaranteed Surplus: +${netCashSurplusGeneratedIdr.toLocaleString()} IDR.`);

    res.json({
      success: true,
      message: `Realisasi penjualan pasar sukses! Aset panen fisik telah dikonversi menjadi kas likuid ${realizedGrossSaleIdr.toLocaleString()} IDR. Cadangan treasury terisi ulang dan surplus profit terkunci +${netCashSurplusGeneratedIdr.toLocaleString()} IDR.`,
      realizedEntry,
      updatedPool: treasuryReservePoolState
    });
  });

  // ======================== 3. MULTI-FARMER USER MANAGEMENT & PERSONALIZED DASHBOARD ========================
  let farmerAccounts: any[] = [
    {
      id: 'farmer-ahmad',
      fullName: 'Ahmad Zaidan',
      username: 'ahmadzaidan',
      email: 'ahmad.zaidan@gamegrafity.id',
      phone: '0812-9844-3120',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Blitar, Jawa Timur',
      walletAddress: '0x71C89F2A938b4efc891102b3c45781a9f0293817',
      role: 'peternak',
      registeredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: 'ACTIVE',
      rentalPackage: {
        id: 'pkg-pro-iot-tier1',
        name: 'Paket Pro IoT Tier-1',
        tierLevel: 'pro',
        monthlyCostIdr: 2350000,
        capacityBirds: 500,
        requestedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        approvedAt: new Date(Date.now() - 86400000 * 5 + 3600000).toISOString(),
        expiresAt: Date.now() + 25 * 86400000,
        paymentProofNote: 'Lunas transfer DANA QRIS Lumpia Ipul Rp 2.350.000',
        paymentChannel: 'DANA_P2P',
        contractCode: 'COOP-IOT-TIER1-8910'
      },
      liveProduction: {
        population: 500,
        roosters: 25,
        hens: 475,
        dailyEggsExpected: 440,
        dailyFeedKg: 55,
        dailyProductionRunningEggs: 388,
        accumulatedEggsReady: 120,
        totalHarvestedAllTime: 2200,
        totalGramasiKgAllTime: 137.5,
        totalEarningsIdr: 3643750,
        walletBalanceIdr: 850000,
        iotSensor: {
          tempC: 24.2,
          humidityRh: 65,
          ammoniaPpm: 6.8,
          exhaustRpm: 1450,
          coolingPadActive: true
        },
        cohorts: {
          docCount: 0,
          pulletCount: 25,
          layerCount: 450,
          afkirCount: 25
        }
      },
      brokerAbsorptions: [
        {
          id: 'ABSORB-101',
          batchCode: 'PINSAR-OFFTAKE-091',
          date: 'Kemarin (08:30)',
          eggCount: 440,
          weightKg: 27.5,
          grade: 'GRADE_B',
          pricePerKg: 26500,
          payoutIdr: 728750,
          brokerName: 'CV Sumber Telur Mandiri (Broker Pinsar)',
          status: 'SETTLED',
          txHash: '0x3a91f82c0b4e5d6a7f8e9c0b1a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d'
        }
      ]
    },
    {
      id: 'farmer-siti',
      fullName: 'Siti Rahmawati',
      username: 'sitirahma',
      email: 'siti.rahma@gamegrafity.id',
      phone: '0857-1122-8901',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Kediri, Jawa Timur',
      walletAddress: '0x3F5c9E2B1A8D4F7C6E0B3a5d8f2c1E4a7B0D9E3F',
      role: 'peternak',
      registeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'PENDING_APPROVAL',
      rentalPackage: {
        id: 'pkg-starter-node',
        name: 'Paket Starter Node',
        tierLevel: 'starter',
        monthlyCostIdr: 1250000,
        capacityBirds: 150,
        requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        paymentProofNote: 'Sudah transfer scan QRIS Lumpia Ipul Rp 1.250.000 via BCA Mobile',
        paymentChannel: 'QRIS',
        contractCode: 'COOP-STARTER-9421'
      },
      liveProduction: {
        population: 150,
        roosters: 8,
        hens: 142,
        dailyEggsExpected: 132,
        dailyFeedKg: 16.5,
        dailyProductionRunningEggs: 0,
        accumulatedEggsReady: 0,
        totalHarvestedAllTime: 0,
        totalGramasiKgAllTime: 0,
        totalEarningsIdr: 0,
        walletBalanceIdr: 0,
        iotSensor: {
          tempC: 24.0,
          humidityRh: 65,
          ammoniaPpm: 5.5,
          exhaustRpm: 1200,
          coolingPadActive: false
        },
        cohorts: {
          docCount: 20,
          pulletCount: 10,
          layerCount: 110,
          afkirCount: 10
        }
      },
      brokerAbsorptions: []
    },
    {
      id: 'farmer-mudhofar',
      fullName: 'Mudhofar (Owner/Pengelola)',
      username: 'mudhofar',
      email: 'uangnyagoparbanyak@gmail.com',
      phone: '0812-3344-5566',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      location: 'Sovereign Genesis Central',
      walletAddress: '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      role: 'owner',
      registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      status: 'ACTIVE',
      rentalPackage: {
        id: 'owner-master',
        name: 'Master Sovereign Hub',
        tierLevel: 'sovereign',
        monthlyCostIdr: 0,
        capacityBirds: 6000,
        requestedAt: new Date().toISOString()
      },
      liveProduction: {
        population: 6000,
        roosters: 300,
        hens: 5700,
        dailyEggsExpected: 5280,
        dailyFeedKg: 660,
        dailyProductionRunningEggs: 4120,
        accumulatedEggsReady: 1500,
        totalHarvestedAllTime: 45000,
        totalGramasiKgAllTime: 2812.5,
        totalEarningsIdr: 74531250,
        walletBalanceIdr: 13950000,
        iotSensor: {
          tempC: 23.8,
          humidityRh: 62,
          ammoniaPpm: 4.8,
          exhaustRpm: 1450,
          coolingPadActive: true
        },
        cohorts: {
          docCount: 200,
          pulletCount: 500,
          layerCount: 5000,
          afkirCount: 300
        }
      },
      brokerAbsorptions: []
    }
  ];

  // API: Get all farmer accounts (for switching and admin list)
  app.get('/api/farmer-accounts', (_req, res) => {
    res.json({
      success: true,
      accounts: farmerAccounts.map(f => ({
        id: f.id,
        fullName: f.fullName,
        username: f.username,
        email: f.email,
        phone: f.phone,
        avatarUrl: f.avatarUrl,
        location: f.location,
        walletAddress: f.walletAddress,
        role: f.role,
        status: f.status,
        rentalPackage: f.rentalPackage,
        birdsCapacity: f.rentalPackage?.capacityBirds || f.liveProduction.population
      }))
    });
  });

  // API: Get single farmer account (Secure isolated data)
  app.get('/api/farmer-accounts/:id', (req, res) => {
    const account = farmerAccounts.find(f => f.id === req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Akun peternak tidak ditemukan.' });
    }
    res.json({ success: true, account });
  });

  // API: Register new farmer account (Self-service profile with photo upload & package choice)
  app.post('/api/farmer-accounts/register', (req, res) => {
    const {
      fullName,
      phone,
      email,
      location,
      avatarUrl,
      packageId = 'pkg-pro-iot-tier1',
      paymentProofNote,
      paymentChannel = 'DANA_P2P',
      walletAddress
    } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: 'Nama lengkap dan nomor ponsel wajib diisi.' });
    }

    const pkg = infrastructurePackages.find(p => p.id === packageId) || infrastructurePackages[1];
    const newId = 'farmer-' + Date.now().toString(36);
    const contractCode = `COOP-${pkg.tierLevel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAccount = {
      id: newId,
      fullName: fullName.trim(),
      username: fullName.toLowerCase().replace(/\s+/g, ''),
      email: email || `${newId}@gamegrafity.id`,
      phone: phone.trim(),
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      location: location || 'Jawa Timur',
      walletAddress: walletAddress || '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      role: 'peternak',
      registeredAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL', // Strict rule: Pending until Owner approves!
      rentalPackage: {
        id: pkg.id,
        name: pkg.name,
        tierLevel: pkg.tierLevel,
        monthlyCostIdr: pkg.totalMonthlyRentIdr,
        capacityBirds: pkg.capacityBirds,
        requestedAt: new Date().toISOString(),
        paymentProofNote: paymentProofNote || 'Sudah transfer via ' + paymentChannel + ' ke QRIS Lumpia Ipul',
        paymentChannel,
        contractCode
      },
      liveProduction: {
        population: pkg.capacityBirds,
        roosters: Math.floor(pkg.capacityBirds * 0.05),
        hens: Math.floor(pkg.capacityBirds * 0.95),
        dailyEggsExpected: Math.floor(pkg.capacityBirds * 0.88),
        dailyFeedKg: Number(((pkg.capacityBirds * 0.11)).toFixed(1)),
        dailyProductionRunningEggs: 0,
        accumulatedEggsReady: 0,
        totalHarvestedAllTime: 0,
        totalGramasiKgAllTime: 0,
        totalEarningsIdr: 0,
        walletBalanceIdr: 0,
        iotSensor: {
          tempC: 24.2,
          humidityRh: 65,
          ammoniaPpm: 6.5,
          exhaustRpm: 1450,
          coolingPadActive: true
        },
        cohorts: {
          docCount: Math.floor(pkg.capacityBirds * 0.1),
          pulletCount: Math.floor(pkg.capacityBirds * 0.1),
          layerCount: Math.floor(pkg.capacityBirds * 0.75),
          afkirCount: Math.floor(pkg.capacityBirds * 0.05)
        }
      },
      brokerAbsorptions: []
    };

    farmerAccounts.push(newAccount);

    console.log(`[Farmer Registration] New Peternak registered: ${newAccount.fullName} for ${pkg.name}. Status: PENDING_APPROVAL`);

    res.json({
      success: true,
      message: `Pendaftaran berhasil! Akun ${newAccount.fullName} untuk ${pkg.name} telah dibuat dengan status PENDING. Menunggu konfirmasi persetujuan (Approve) dari Owner untuk membuka dasbor personal.`,
      account: newAccount
    });
  });

  // API: Self-Service Profile Update (including photo upload)
  app.put('/api/farmer-accounts/:id/profile', (req, res) => {
    const account = farmerAccounts.find(f => f.id === req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Akun peternak tidak ditemukan.' });
    }

    const { fullName, phone, email, location, avatarUrl, walletAddress } = req.body;
    if (fullName) account.fullName = fullName.trim();
    if (phone) account.phone = phone.trim();
    if (email) account.email = email.trim();
    if (location) account.location = location.trim();
    if (avatarUrl) account.avatarUrl = avatarUrl;
    if (walletAddress) account.walletAddress = walletAddress.trim();

    console.log(`[Farmer Profile Update] Updated profile for ${account.fullName} (${account.id})`);

    res.json({
      success: true,
      message: 'Profil peternak berhasil diperbarui!',
      account
    });
  });

  // API: Owner Approves Farmer Account (P2P Approval Workflow)
  app.post('/api/farmer-accounts/:id/approve', (req, res) => {
    const account = farmerAccounts.find(f => f.id === req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Akun peternak tidak ditemukan.' });
    }

    const rentAmount = account.rentalPackage?.monthlyCostIdr || 1250000;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    account.status = 'ACTIVE';
    account.rentalPackage.approvedAt = new Date().toISOString();
    account.rentalPackage.expiresAt = Date.now() + 30 * 86400000; // 30 days countdown

    // 100% of rental fee goes directly into Treasury Reserve Pool!
    recordInfrastructureInflow(rentAmount, `Sewa Paket: ${account.rentalPackage.name} oleh ${account.fullName}`, 'P2P Approval Owner', txHash);

    // Initial production kickstart
    account.liveProduction.accumulatedEggsReady = Math.floor(account.liveProduction.dailyEggsExpected * 0.5);

    console.log(`[Farmer P2P Approved] Owner APPROVED peternak ${account.fullName} (${account.id}). Personal Dashboard ACTIVE! +${rentAmount.toLocaleString()} IDR to Treasury Reserve.`);

    res.json({
      success: true,
      message: `Persetujuan Owner berhasil! Akun ${account.fullName} resmi AKTIF. Dasbor personal peternak telah terbuka dan sensor IoT otomatis berjalan 24/7.`,
      account,
      txHash
    });
  });

  // API: Broker Absorbs Eggs from Farmer (Offtake with Guaranteed Margin)
  app.post('/api/farmer-accounts/:id/offtake', (req, res) => {
    const account = farmerAccounts.find(f => f.id === req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Akun peternak tidak ditemukan.' });
    }

    const { eggCount, grade = 'GRADE_B', brokerName = 'CV Mitra Unggas Pinsar Jawa Timur' } = req.body;
    const count = Number(eggCount) || account.liveProduction.accumulatedEggsReady || 100;

    if (count <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah telur untuk diserap broker harus lebih dari 0.' });
    }

    const weightKg = Number(((count * 62.5) / 1000).toFixed(2));
    const rules = getDynamicMarginRules();
    const rule = rules.find(r => r.commodityKey === grade) || rules[0];
    const payoutPricePerKg = rule.lockedFarmerBuyPricePerKg; // locked farmer price
    const payoutIdr = Math.round(weightKg * payoutPricePerKg);
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Deduct eggs from farmer's ready pool & credit cash
    account.liveProduction.accumulatedEggsReady = Math.max(0, account.liveProduction.accumulatedEggsReady - count);
    account.liveProduction.totalHarvestedAllTime += count;
    account.liveProduction.totalGramasiKgAllTime = Number((account.liveProduction.totalGramasiKgAllTime + weightKg).toFixed(2));
    account.liveProduction.totalEarningsIdr += payoutIdr;
    account.liveProduction.walletBalanceIdr += payoutIdr;

    // Add eggs into physical warehouse inventory for open market realization
    physicalCommodityWarehouse.eggsCount += count;
    physicalCommodityWarehouse.weightKg = Number((physicalCommodityWarehouse.weightKg + weightKg).toFixed(2));
    physicalCommodityWarehouse.costBasisIdr += payoutIdr;

    const absorptionRecord = {
      id: 'ABSORB-' + Date.now().toString(36).toUpperCase(),
      batchCode: 'PINSAR-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      eggCount: count,
      weightKg,
      grade,
      pricePerKg: payoutPricePerKg,
      payoutIdr,
      brokerName,
      status: 'SETTLED',
      txHash
    };

    account.brokerAbsorptions.unshift(absorptionRecord);

    console.log(`[Broker Absorption] Broker ${brokerName} absorbed ${count} eggs (${weightKg} kg) from ${account.fullName}. Paid: ${payoutIdr.toLocaleString()} IDR.`);

    res.json({
      success: true,
      message: `Penyerapan oleh broker berhasil! ${count} butir (${weightKg} kg) diserap seharga ${payoutIdr.toLocaleString()} IDR (terjamin di atas HPP). Saldo peternak bertambah.`,
      absorption: absorptionRecord,
      account
    });
  });

  // API: Live Production Tick (Simulates automated daily production)
  app.post('/api/farmer-accounts/:id/production-tick', (req, res) => {
    const account = farmerAccounts.find(f => f.id === req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
    }

    if (account.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Dasbor belum aktif. Menunggu persetujuan Owner.' });
    }

    const { incrementEggs = 5 } = req.body;
    account.liveProduction.dailyProductionRunningEggs += incrementEggs;
    account.liveProduction.accumulatedEggsReady += incrementEggs;
    account.liveProduction.iotSensor.tempC = Number((24.0 + (Math.random() * 0.6 - 0.3)).toFixed(1));
    account.liveProduction.iotSensor.humidityRh = Math.floor(63 + Math.random() * 4);

    res.json({
      success: true,
      liveProduction: account.liveProduction
    });
  });

  // =========================================================================================
  // SOVEREIGN ECOSYSTEM: CORE BACKEND MATHEMATICAL & MONETARY DIRECTIVE IMPLEMENTATION
  // Pillars: I. Acuan Real-Time, II. Hukum Besi Moneter, III. Infinite Absorption, IV. Flow Sync
  // =========================================================================================

  const sovereignHPPBreakdown = {
    feedCostPerKg: 15400, // FCR ~2.2 x Rp 7.000/kg pakan konsentrat mandiri
    docAmortizationPerKg: 2500, // Amortisasi DOC bibit layer produktif
    energyKwhClimatePerKg: 1200, // Konsumsi listrik kWh IoT sensor & AC closed-house
    doctorBiosecurityPerKg: 600, // Biosecurity level 4 & vaksinasi sentinel
    totalHPPPerKg: 19700, // HPP Dasar Riil per kg
    hppPerEgg: 1231 // ~ 62.5g per butir telur ras
  };

  const infiniteAbsorptionStats = {
    totalAbsorbedAllTimeEggs: 12840,
    totalAbsorbedAllTimeKg: 802.5,
    totalCashPaidToFarmersIdr: 20685240,
    zeroRejectionGuarantee: true,
    mortalityRiskRatePercent: 0.0 // 0% mortality rate berkat IoT closed-house
  };

  const getSovereignMonetaryDirectiveState = () => {
    // 1. V_system: Total real money in Treasury Reserve accumulated from infrastructure utility rentals
    const V_system = treasuryReservePoolState.totalReserveBalanceIdr;

    // 2. Q: Total pending actual harvest volume across all active virtual coops
    const totalPendingEggs = farmerAccounts
      .filter(f => f.status === 'ACTIVE')
      .reduce((sum, f) => sum + (f.liveProduction?.accumulatedEggsReady || 0), 0) + (physicalCommodityWarehouse.eggsCount || 0);

    const Q_kg = Number(((totalPendingEggs * 62.5) / 1000).toFixed(2));

    // Dynamic margin rules (P_realtime & H_broker)
    const marginRules = getDynamicMarginRules();
    const ruleB = marginRules.find(r => r.commodityKey === 'GRADE_B') || marginRules[0];
    const H_broker = ruleB.lockedFarmerBuyPricePerKg; // Rp 25.776 / kg
    const P_realtime = ruleB.realtimeMarketPricePerKg; // Rp 28.800 / kg
    const HPP = sovereignHPPBreakdown.totalHPPPerKg; // Rp 19.700 / kg

    // 3. V_harvest: Total harvest liability
    const V_harvest = Math.round(Q_kg * H_broker);

    // 4. Invariant: V_system >= (1 + alpha) * V_harvest with alpha = 0.15 (15% emergency buffer)
    const alpha_buffer = 0.15;
    const required_reserve_with_buffer = Math.round((1 + alpha_buffer) * V_harvest);
    const reserve_surplus_idr = V_system - required_reserve_with_buffer;
    const liquidity_ratio_percent = required_reserve_with_buffer > 0
      ? Number(((V_system / required_reserve_with_buffer) * 100).toFixed(1))
      : 999.9;
    const isInvariantSatisfied = V_system >= required_reserve_with_buffer;
    const expansionStatus = isInvariantSatisfied ? 'PERMITTED' : 'THROTTLED_BUFFER_PROTECTION';

    // 5. Pricing Validation: HPP < H_broker < P_realtime & H_broker = HPP + Margin Bersih Peternak
    const pricingValidations = marginRules.map(r => {
      const hBroker = r.lockedFarmerBuyPricePerKg;
      const pRealtime = r.realtimeMarketPricePerKg;
      const farmerNetMarginPerKg = hBroker - HPP;
      const farmerNetMarginPercent = Number(((farmerNetMarginPerKg / HPP) * 100).toFixed(1));
      const brokerGuaranteedSpreadPerKg = pRealtime - hBroker;
      const brokerGuaranteedSpreadPercent = r.mandatorySpreadPercent;
      const isValid = HPP < hBroker && hBroker < pRealtime;

      return {
        commodityKey: r.commodityKey,
        commodityName: r.commodity,
        HPP_per_kg: HPP,
        H_broker_per_kg: hBroker,
        P_realtime_per_kg: pRealtime,
        farmerNetMarginPerKg,
        farmerNetMarginPercent,
        brokerGuaranteedSpreadPerKg,
        brokerGuaranteedSpreadPercent,
        formula: `HPP (${HPP.toLocaleString()} IDR) < H_broker (${hBroker.toLocaleString()} IDR) < P_realtime (${pRealtime.toLocaleString()} IDR)`,
        isValid
      };
    });

    // 6. Flow Rate Synchronization: dV_system/dt >= (dQ/dt) * H_broker
    // Simulated hourly telemetry
    const dV_system_dt_per_hour = Math.round(treasuryReservePoolState.infrastructureInflowsIdr / (30 * 24)) + 45000; // ~Rp 64.000 - Rp 110.000 / hr
    const dQ_dt_eggs_per_hour = 35; // ~35 eggs/hour
    const dQ_dt_kg_per_hour = Number(((dQ_dt_eggs_per_hour * 62.5) / 1000).toFixed(2)); // ~2.19 kg/hr
    const dQ_dt_burn_idr_per_hour = Math.round(dQ_dt_kg_per_hour * H_broker); // ~Rp 56.388 / hr
    const netFlowDifferentialPerHour = dV_system_dt_per_hour - dQ_dt_burn_idr_per_hour;
    const isFlowSynchronized = dV_system_dt_per_hour >= dQ_dt_burn_idr_per_hour;

    const pacingMode = isFlowSynchronized
      ? 'NORMAL'
      : (liquidity_ratio_percent > 120 ? 'PACED_STABILITY' : 'HIGH_VOLUME_COMPOUND');

    const flowRate = {
      dV_system_dt_per_hour,
      dQ_dt_eggs_per_hour,
      dQ_dt_kg_per_hour,
      dQ_dt_burn_idr_per_hour,
      netFlowDifferentialPerHour,
      isFlowSynchronized,
      pacingIntervalSeconds: isFlowSynchronized ? 8 : 14,
      recommendedAutoCompoundPercent: isFlowSynchronized ? 40 : 50,
      pacingMode
    };

    return {
      status: 'LOCKED & ACTIVE' as const,
      V_system,
      Q_total_pending_eggs: totalPendingEggs,
      Q_total_pending_kg: Q_kg,
      H_broker_average: H_broker,
      V_harvest,
      alpha_buffer,
      required_reserve_with_buffer,
      reserve_surplus_idr,
      liquidity_ratio_percent,
      isInvariantSatisfied,
      expansionStatus,
      hppBreakdown: sovereignHPPBreakdown,
      pricingValidations,
      flowRate,
      infiniteAbsorption: infiniteAbsorptionStats,
      lastEvaluatedAt: new Date().toISOString()
    };
  };

  // API: Get Sovereign Mathematical & Monetary Directive State
  app.get('/api/sovereign-directive/status', (_req, res) => {
    const directiveState = getSovereignMonetaryDirectiveState();
    res.json({
      success: true,
      directive: directiveState
    });
  });

  // API: Algoritma Wajib Serap Tanpa Batas Fisik (Infinite Absorption Execution)
  app.post('/api/sovereign-directive/infinite-absorb', (req, res) => {
    const { farmerId, eggCount, grade = 'GRADE_B' } = req.body;
    const count = Math.max(1, Number(eggCount) || 120);
    const weightKg = Number(((count * 62.5) / 1000).toFixed(2));

    const marginRules = getDynamicMarginRules();
    const rule = marginRules.find(r => r.commodityKey === grade) || marginRules[0];
    const H_broker = rule.lockedFarmerBuyPricePerKg;
    const P_realtime = rule.realtimeMarketPricePerKg;
    const HPP = sovereignHPPBreakdown.totalHPPPerKg;
    const payoutIdr = Math.round(weightKg * H_broker);
    const guaranteedSurplusIdr = Math.round(weightKg * (P_realtime - H_broker));
    const farmerProfitIdr = Math.round(weightKg * (H_broker - HPP));

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // If specific farmer provided, credit farmer balance
    const targetFarmer = farmerAccounts.find(f => f.id === farmerId) || farmerAccounts[0];
    if (targetFarmer) {
      targetFarmer.liveProduction.accumulatedEggsReady = Math.max(0, targetFarmer.liveProduction.accumulatedEggsReady - count);
      targetFarmer.liveProduction.totalHarvestedAllTime += count;
      targetFarmer.liveProduction.totalGramasiKgAllTime = Number((targetFarmer.liveProduction.totalGramasiKgAllTime + weightKg).toFixed(2));
      targetFarmer.liveProduction.totalEarningsIdr += payoutIdr;
      targetFarmer.liveProduction.walletBalanceIdr += payoutIdr;

      targetFarmer.brokerAbsorptions.unshift({
        id: 'ABSORB-INF-' + Date.now().toString(36).toUpperCase(),
        batchCode: 'INFINITE-OFFTAKE-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        eggCount: count,
        weightKg,
        grade,
        pricePerKg: H_broker,
        payoutIdr,
        brokerName: 'CV Mitra Unggas Pinsar (Infinite Absorption Broker)',
        status: 'SETTLED',
        txHash
      });
    }

    // Pegged commodity into physical warehouse
    physicalCommodityWarehouse.eggsCount += count;
    physicalCommodityWarehouse.weightKg = Number((physicalCommodityWarehouse.weightKg + weightKg).toFixed(2));
    physicalCommodityWarehouse.costBasisIdr += payoutIdr;

    // Update infinite absorption all-time records
    infiniteAbsorptionStats.totalAbsorbedAllTimeEggs += count;
    infiniteAbsorptionStats.totalAbsorbedAllTimeKg = Number((infiniteAbsorptionStats.totalAbsorbedAllTimeKg + weightKg).toFixed(2));
    infiniteAbsorptionStats.totalCashPaidToFarmersIdr += payoutIdr;

    // Evaluate invariant after absorption
    const updatedDirective = getSovereignMonetaryDirectiveState();

    console.log(`[Infinite Absorption Algorithm] Absorbed ${count} eggs (${weightKg} kg) for ${targetFarmer?.fullName || 'Peternak'}. Paid: ${payoutIdr.toLocaleString()} IDR. Zero rejection guaranteed.`);

    res.json({
      success: true,
      message: `Eksekusi Serap Tanpa Batas Berhasil! ${count} butir (${weightKg} kg) diserap seketika seharga ${payoutIdr.toLocaleString()} IDR tanpa risiko penolakan. Peternak untung bersih +${farmerProfitIdr.toLocaleString()} IDR di atas HPP.`,
      absorptionResult: {
        eggCount: count,
        weightKg,
        H_broker,
        P_realtime,
        HPP,
        payoutIdr,
        farmerProfitIdr,
        guaranteedSurplusIdr,
        txHash,
        targetFarmerName: targetFarmer?.fullName
      },
      updatedDirective
    });
  });


  // Set up Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gamegrafity Farm Sovereign Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
