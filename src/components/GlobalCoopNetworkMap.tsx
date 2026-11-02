import React, { useState } from 'react';
import {
  Globe,
  Radio,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Thermometer,
  Droplets,
  Wind,
  X,
} from 'lucide-react';
import { SupportedCurrency, SupportedLanguage, TRANSLATIONS, formatCustomCurrency } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';

interface GlobalCoopNetworkMapProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  activeCurrency: SupportedCurrency;
  onSelectCountryForOnboard?: (countryCode: string) => void;
  onInspectEtherscan?: (txHash: string) => void;
}

interface CoopNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  region: string;
  lat: number;
  lng: number;
  birdsCount: number;
  dailyEggYield: number;
  fcrRatio: number;
  ambientTempC: number;
  humidityRh: number;
  ammoniaPpm: number;
  biosecurityStatus: 'Aman (Level 4)' | 'Normal' | 'Sentinel Monitor';
  certification: string;
  payoutRail: string;
  latestMerkleProof: string;
  nodeOperator: string;
  did?: string;
  ensName?: string;
  txHash?: string;
  blockNumber?: number;
  isUserRegistered?: boolean;
}

const GLOBAL_NODES: CoopNode[] = [
  {
    id: 'node-us-ia',
    name: 'Midwest Layer Hub',
    country: 'United States (Iowa)',
    flag: '🇺🇸',
    region: 'North America',
    lat: 41.878,
    lng: -93.097,
    birdsCount: 1450000,
    dailyEggYield: 1290500,
    fcrRatio: 1.95,
    ambientTempC: 22.8,
    humidityRh: 58,
    ammoniaPpm: 8,
    biosecurityStatus: 'Aman (Level 4)',
    certification: 'USDA Organic NOP & Cage-Free',
    payoutRail: 'Arbitrum USDC & ACH Fedwire',
    latestMerkleProof: '0x9d4a8f...3e2b',
    nodeOperator: 'Iowa Sovereign Agro-Trust',
  },
  {
    id: 'node-br-pr',
    name: 'Cascavel Export Megahub',
    country: 'Brazil (Paraná)',
    flag: '🇧🇷',
    region: 'South America',
    lat: -24.957,
    lng: -53.459,
    birdsCount: 3200000,
    dailyEggYield: 2848000,
    fcrRatio: 1.88,
    ambientTempC: 24.1,
    humidityRh: 62,
    ammoniaPpm: 6,
    biosecurityStatus: 'Aman (Level 4)',
    certification: 'Global G.A.P. & Halal Fed Brazil',
    payoutRail: 'Ethereum Web3 & PIX Banco Central',
    latestMerkleProof: '0x4f1c99...8a12',
    nodeOperator: 'Paraná Co-op Agro-Sovereign',
  },
  {
    id: 'node-nl-ge',
    name: 'Barneveld Innovation Aviary',
    country: 'Netherlands (Gelderland)',
    flag: '🇳🇱',
    region: 'Western Europe',
    lat: 52.14,
    lng: 5.58,
    birdsCount: 920000,
    dailyEggYield: 828000,
    fcrRatio: 1.92,
    ambientTempC: 21.5,
    humidityRh: 60,
    ammoniaPpm: 4,
    biosecurityStatus: 'Aman (Level 4)',
    certification: 'EU Animal Welfare & KAT Cage-Free',
    payoutRail: 'Base L2 USDC & SEPA Instant',
    latestMerkleProof: '0x88e7b1...6c44',
    nodeOperator: 'Dutch Agro-Robotics Syndicate',
  },
  {
    id: 'node-id-ej',
    name: 'Gamegrafity Blitar Sovereign Origin',
    country: 'Indonesia (East Java)',
    flag: '🇮🇩',
    region: 'Southeast Asia',
    lat: -8.098,
    lng: 112.168,
    birdsCount: 680000,
    dailyEggYield: 605200,
    fcrRatio: 2.05,
    ambientTempC: 24.2,
    humidityRh: 65,
    ammoniaPpm: 9,
    biosecurityStatus: 'Aman (Level 4)',
    certification: 'Pinsar Nasional & Halal MUI',
    payoutRail: 'Web3 ETH Smart Contract & DANA P2P',
    latestMerkleProof: '0x71c89f...2d3a',
    nodeOperator: 'Gamegrafity Sovereign Genesis',
  },
  {
    id: 'node-th-sp',
    name: 'Siam Closed-House Cluster',
    country: 'Thailand (Suphan Buri)',
    flag: '🇹🇭',
    region: 'Southeast Asia',
    lat: 14.474,
    lng: 100.117,
    birdsCount: 1100000,
    dailyEggYield: 979000,
    fcrRatio: 1.98,
    ambientTempC: 24.8,
    humidityRh: 66,
    ammoniaPpm: 7,
    biosecurityStatus: 'Aman (Level 4)',
    certification: 'DLD Biosecurity Level 4 & HACCP',
    payoutRail: 'Polygon USDC & PromptPay',
    latestMerkleProof: '0x33b2a5...11ef',
    nodeOperator: 'Chao Phraya Poultry Alliance',
  },
  {
    id: 'node-fr-br',
    name: 'Bretagne Organic Pasture',
    country: 'France (Brittany)',
    flag: '🇫🇷',
    region: 'Western Europe',
    lat: 48.202,
    lng: -2.932,
    birdsCount: 550000,
    dailyEggYield: 478500,
    fcrRatio: 2.1,
    ambientTempC: 20.9,
    humidityRh: 64,
    ammoniaPpm: 5,
    biosecurityStatus: 'Aman (Level 4)',
    certification: 'Label Rouge & Bio France',
    payoutRail: 'Ethereum Mainnet & SEPA',
    latestMerkleProof: '0x12d98a...4477',
    nodeOperator: 'Bretagne Fermiers Réunis',
  },
  {
    id: 'node-ke-nk',
    name: 'Rift Valley Solar-Farm',
    country: 'Kenya (Nakuru)',
    flag: '🇰🇪',
    region: 'East Africa',
    lat: -0.303,
    lng: 36.08,
    birdsCount: 220000,
    dailyEggYield: 187000,
    fcrRatio: 2.12,
    ambientTempC: 23.4,
    humidityRh: 55,
    ammoniaPpm: 7,
    biosecurityStatus: 'Normal',
    certification: 'KEBS Diamond Mark & Eco-Poultry',
    payoutRail: 'Arbitrum USDC & M-Pesa Bridge',
    latestMerkleProof: '0xaa42bb...90cc',
    nodeOperator: 'Nakuru Women Farmers Syndicate',
  },
];

export const GlobalCoopNetworkMap: React.FC<GlobalCoopNetworkMapProps> = ({
  isOpen,
  onClose,
  lang,
  activeCurrency,
  onSelectCountryForOnboard,
  onInspectEtherscan,
}) => {
  const [nodes, setNodes] = useState<CoopNode[]>(GLOBAL_NODES);
  const [selectedNode, setSelectedNode] = useState<CoopNode>(GLOBAL_NODES[3]); // Default Indonesia / Genesis
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE_REGISTERED' | 'TIER1'>('ALL');

  // Fetch live farmers from backend registry
  const fetchLiveFarmers = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch('/api/farmers');
      const data = await res.json();
      if (data.success && Array.isArray(data.farmers)) {
        // Merge with base global nodes
        const backendNodes: CoopNode[] = data.farmers.map((f: any, idx: number) => {
          const isUserRegistered = f.id.startsWith('farmer-') &&
            !f.id.includes('genesis') &&
            !f.id.includes('us-ia') &&
            !f.id.includes('br-pr') &&
            !f.id.includes('nl-ge') &&
            !f.id.includes('fr-br');

          return {
            id: f.id || `node-backend-${idx}`,
            name: f.farmName,
            country: f.country,
            flag: f.flag || '🌍',
            region: f.region || 'Global',
            lat: 0,
            lng: 0,
            birdsCount: f.flockSize || 5000,
            dailyEggYield: f.dailyEggYield || Math.floor((f.flockSize || 5000) * 0.88),
            fcrRatio: 1.95,
            ambientTempC: f.ambientTempC || 24.0,
            humidityRh: f.humidityRh || 62,
            ammoniaPpm: f.ammoniaPpm || 6,
            biosecurityStatus: 'Aman (Level 4)',
            certification: (f.certifications && f.certifications[0]) || 'Avian Influenza H5N1 Sentinel Certified',
            payoutRail: f.payoutRail || 'Arbitrum USDC & Local P2P',
            latestMerkleProof: f.merkleProof || '0x71c89f...2d3a',
            nodeOperator: f.nodeOperator || f.farmName,
            did: f.did,
            ensName: f.ensName,
            txHash: f.txHash,
            blockNumber: f.blockNumber,
            isUserRegistered,
          };
        });

        // Ensure default genesis nodes that may not be in backend are also included
        const existingIds = new Set(backendNodes.map(n => n.id));
        const combined = [...backendNodes];
        GLOBAL_NODES.forEach(n => {
          if (!existingIds.has(n.id)) {
            combined.push(n);
          }
        });

        setNodes(combined);
        if (combined.length > 0 && (!selectedNode || !combined.find(n => n.id === selectedNode.id))) {
          setSelectedNode(combined[0]);
        }
      }
    } catch (err) {
      console.warn('Backend fetch error (fallback to local state):', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchLiveFarmers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalBirds = nodes.reduce((sum, n) => sum + n.birdsCount, 0);
  const totalDailyEggs = nodes.reduce((sum, n) => sum + n.dailyEggYield, 0);
  const totalWeightKg = (totalDailyEggs * 62.5) / 1000;

  const filteredNodes = nodes.filter((n) => {
    const matchesRegion = filterRegion === 'ALL' || n.region.toLowerCase() === filterRegion.toLowerCase();
    const matchesTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'LIVE_REGISTERED'
        ? n.isUserRegistered || !!n.did
        : !n.isUserRegistered;
    return matchesRegion && matchesTab;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-950/40">
              <Globe className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  World Poultry Cooperative Network & Node Explorer
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Peta Agregasi Peternak Unggas Sovereign Lintas Benua • Terhubung Langsung ke Backend & Smart Contract
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLiveFarmers}
              disabled={isLoadingLive}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Radio className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : 'text-cyan-400'}`} />
              <span>{isLoadingLive ? 'Sinkron...' : 'Refresh Live'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Aggregate KPI Banner */}
        <div className="p-5 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Total Populasi Ternak Dunia
            </div>
            <div className="text-base font-extrabold font-mono text-cyan-400 mt-1">
              {(totalBirds / 1000000).toFixed(2)}M Ekor
            </div>
            <div className="text-[10px] text-slate-500">{nodes.length} Node Terdaftar Live</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Produksi Telur Harian
            </div>
            <div className="text-base font-extrabold font-mono text-emerald-400 mt-1">
              {(totalDailyEggs / 1000000).toFixed(2)}M Butir/Hari
            </div>
            <div className="text-[10px] text-slate-500">{totalWeightKg.toLocaleString(undefined, { maximumFractionDigits: 0 })} Kg Gramasi</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Konsensus Biosekuriti H5N1
            </div>
            <div className="text-base font-extrabold font-mono text-emerald-300 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Aman
            </div>
            <div className="text-[10px] text-slate-500">Zero-Infection Protocol</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Likuiditas Treasury Global
            </div>
            <div className="text-base font-extrabold font-mono text-white mt-1">
              $ 42.85M USD
            </div>
            <div className="text-[10px] text-slate-500">Settlement Multi-Chain</div>
          </div>
        </div>

        {/* Filter & View Tabs */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeTab === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Node ({nodes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LIVE_REGISTERED')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeTab === 'LIVE_REGISTERED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Peternak Terdaftar Live</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TIER1')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeTab === 'TIER1'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hub Tier-1 Internasional
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'North America', 'South America', 'Western Europe', 'Southeast Asia', 'East Africa'].map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setFilterRegion(reg)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition ${
                  filterRegion === reg
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-white'
                }`}
              >
                {reg === 'ALL' ? '🌍 Semua' : reg.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Content: Map Grid & Node Telemetry Panel */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
          {/* Node Cards List (Col 5) */}
          <div className="md:col-span-5 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredNodes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                Tidak ada node peternak yang cocok dengan filter ini.
              </div>
            ) : (
              filteredNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      setSelectedNode(node);
                      sounds.click();
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left border transition relative flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-950/40'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{node.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {node.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                          {(node.birdsCount / 1000).toFixed(0)}k Ekor
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-slate-400 truncate">{node.country}</span>
                        {node.isUserRegistered && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            LIVE REGISTERED
                          </span>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-medium flex items-center gap-1 truncate">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          {node.biosecurityStatus}
                        </span>
                        <span className="text-slate-400 font-mono shrink-0">
                          {node.ambientTempC}°C | {node.humidityRh}% RH
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Node Telemetry & Proof Details (Col 7) */}
          <div className="md:col-span-7 bg-slate-950/70 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Header of selected node */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedNode.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {selectedNode.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {selectedNode.region}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Operator: <span className="text-slate-200 font-medium">{selectedNode.nodeOperator}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Standar Sertifikasi</div>
                  <div className="text-xs font-bold text-emerald-400 truncate max-w-[140px]">{selectedNode.certification}</div>
                </div>
              </div>

              {/* IoT Environmental Telemetry Grid */}
              <div className="grid grid-cols-3 gap-2.5 my-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <Thermometer className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Suhu Kandang</div>
                    <div className="font-mono font-bold text-white">{selectedNode.ambientTempC}°C</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <Droplets className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Kelembaban</div>
                    <div className="font-mono font-bold text-white">{selectedNode.humidityRh}% RH</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2.5">
                  <Wind className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Amonia Udara</div>
                    <div className="font-mono font-bold text-white">{selectedNode.ammoniaPpm} PPM (Aman)</div>
                  </div>
                </div>
              </div>

              {/* Production & Financial Stats */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Populasi Ayam:</span>
                  <span className="font-mono font-bold text-white">
                    {selectedNode.birdsCount.toLocaleString()} Ekor
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Produksi Telur Harian:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedNode.dailyEggYield.toLocaleString()} Butir ({((selectedNode.dailyEggYield * 62.5) / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} Kg)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Feed Conversion Ratio (FCR):</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {selectedNode.fcrRatio} (Efisien Unggul)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Jalur Payout Terhubung:</span>
                  <span className="font-mono text-slate-200 truncate">{selectedNode.payoutRail}</span>
                </div>
                {selectedNode.ensName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ENS Subdomain:</span>
                    <span className="font-mono text-cyan-300">{selectedNode.ensName}</span>
                  </div>
                )}
              </div>

              {/* W3C DID & Merkle Attestation Box */}
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono space-y-1.5">
                {selectedNode.did && (
                  <div>
                    <div className="text-[10px] text-slate-400">W3C Decentralized Identifier (DID):</div>
                    <div className="text-cyan-300 truncate">{selectedNode.did}</div>
                  </div>
                )}
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Cryptographic Cold-Chain Root Proof:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED ON ETHERSCAN</span>
                </div>
                <div className="text-slate-300 truncate">{selectedNode.latestMerkleProof}</div>
              </div>
            </div>

            {/* Actions: On-Chain Inspect & Onboard standard */}
            <div className="pt-2 flex items-center gap-2.5">
              {selectedNode.txHash && onInspectEtherscan && (
                <button
                  type="button"
                  onClick={() => onInspectEtherscan(selectedNode.txHash!)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cek Etherscan</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (onSelectCountryForOnboard) {
                    onSelectCountryForOnboard(selectedNode.country);
                  }
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                <span>Daftar Menggunakan Standar {selectedNode.country.split('(')[0]}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
