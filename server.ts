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

  app.use(express.json());

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
