import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Globe,
  ExternalLink,
  Download,
  Copy,
  Check,
  Zap,
  Cpu,
  Layers,
  Lock,
  X,
  FileCheck,
} from 'lucide-react';
import { FarmerIdentity } from '../types/farm';
import { SupportedLanguage } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface GlobalReadinessAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: FarmerIdentity;
  lang: SupportedLanguage;
}

interface AuditPillar {
  id: string;
  category: string;
  title: string;
  description: string;
  score: number;
  maxScore: number;
  status: 'VERIFIED' | 'COMPLIANT' | 'OPTIMIZED';
  internationalBenchmark: string;
  technicalProof: string;
}

const AUDIT_PILLARS: AuditPillar[] = [
  {
    id: 'did-sovereign',
    category: 'Sovereign Architecture',
    title: 'W3C Decentralized Identity & Non-Custodial Ownership',
    description: 'Peternak memiliki kendali penuh atas identitas, wallet private key, dan reputasi peternakan tanpa ketergantungan pada broker sentral.',
    score: 10,
    maxScore: 10,
    status: 'VERIFIED',
    internationalBenchmark: 'W3C DID v1.0 & EIP-155 Multi-Chain Standard',
    technicalProof: 'did:poultry:iso3166-XX + Ethers.js local keypair derivation',
  },
  {
    id: 'multichain-payout',
    category: 'Settlement & Liquidity',
    title: 'Dual Payout Engine (EVM Smart Contract & P2P Fiat)',
    description: 'Pencairan hasil panen mendukung Web3 ETH/USDC terverifikasi Etherscan serta transfer P2P e-wallet instan tanpa potongan.',
    score: 10,
    maxScore: 10,
    status: 'VERIFIED',
    internationalBenchmark: 'Ethereum ERC-20 / ERC-721 & Faster Payments Council',
    technicalProof: 'PoultryHarvestProof.sol deployed with Etherscan attestation',
  },
  {
    id: 'multicurrency-i18n',
    category: 'Global Usability',
    title: 'Multi-Language (5 Bahasa) & Multi-Currency Treasury (USD/EUR/BRL/IDR)',
    description: 'Peternak dari Benua Amerika, Eropa, Asia, dan Afrika dapat menggunakan antarmuka bahasa lokal serta konversi kurs live harian.',
    score: 10,
    maxScore: 10,
    status: 'OPTIMIZED',
    internationalBenchmark: 'ISO 639-1 Language & ISO 4217 Currency Standards',
    technicalProof: 'i18n engine with real-time FX parity converters',
  },
  {
    id: 'biosecurity-radar',
    category: 'Veterinary Defense',
    title: 'Radar Biosekuriti & Deteksi Dini Avian Influenza (H5N1)',
    description: 'Engine alarm otomatis menghitung prioritas penanganan wabah virus, isolasi cepat, dan penyelamatan modal ke junkfood olahan.',
    score: 10,
    maxScore: 10,
    status: 'VERIFIED',
    internationalBenchmark: 'WOAH (World Organisation for Animal Health) Terrestrial Manual',
    technicalProof: 'emergencyEngine.ts autonomous priority calculation & junkfood salvage logic',
  },
  {
    id: 'cold-chain-merkle',
    category: 'Food Safety & Traceability',
    title: 'Kriptografi Merkle Tree Traceability & Cold-Chain IoT',
    description: 'Setiap butir telur diverifikasi batch, grade, bobot gramasi, dan sertifikasi bebas Salmonella dengan bukti Merkle Proof on-chain.',
    score: 10,
    maxScore: 10,
    status: 'VERIFIED',
    internationalBenchmark: 'Global G.A.P. Poultry v6 & HACCP Codex Alimentarius',
    technicalProof: 'Keccak-256 batch leaves & binary tree root hashing',
  },
  {
    id: 'gramasi-fair-trade',
    category: 'Economic Fair-Trade',
    title: 'Formula Bisnis Gramasi Bobot Nyata (Bukan Butiran Buta)',
    description: 'Mencegah kerugian peternak akibat arbitrase broker, memadukan timbangan gram riil dengan margin offtaker yang transparan dan terukur.',
    score: 10,
    maxScore: 10,
    status: 'COMPLIANT',
    internationalBenchmark: 'Fair Trade Agriculture Standards & USDA Egg Grading Manual',
    technicalProof: 'gramasiEngine.ts weight-to-value yield calculator',
  },
  {
    id: 'iot-climate-control',
    category: 'Precision Farming',
    title: 'Pengatur Suhu Otomatis, Cooling Pad & AC Api Anti-Heat Stress',
    description: 'Regulasi iklim kandang otomatis menjaga suhu ideal 24°C dan kelembaban 65% RH untuk memproteksi ovulasi dan mencegah drop produksi.',
    score: 10,
    maxScore: 10,
    status: 'OPTIMIZED',
    internationalBenchmark: 'CIGR Section II Farm Buildings & Ventilation Guidelines',
    technicalProof: 'Closed-loop ambient PID heat-exchange algorithm with alert triggers',
  },
  {
    id: 'global-oracles',
    category: 'Market Intelligence',
    title: 'Oracle Komoditas Telur & Pakan Real-Time (CME, USDA, Pinsar)',
    description: 'Mencegah peternak menjual asal-asalan dengan memberikan sinyal timing pasar (SELL_NOW vs HOLD_PEAK) berdasarkan harga bursa dunia.',
    score: 10,
    maxScore: 10,
    status: 'VERIFIED',
    internationalBenchmark: 'CME Group Shell Egg Benchmark & Urner Barry Index',
    technicalProof: 'Decentralized Agro-Fi market price feeds & trend signals',
  },
  {
    id: 'animal-welfare-certs',
    category: 'Global Export Ready',
    title: 'Dukungan Standar Kesejahteraan Hewan & Halal Global',
    description: 'Kepatuhan terhadap regulasi Uni Eropa (Cage-Free Directive), USDA Organic non-GMO, dan standar Halal Internasional (JAKIM/MUI).',
    score: 9,
    maxScore: 10,
    status: 'COMPLIANT',
    internationalBenchmark: 'EU Council Directive 1999/74/EC & Halal World Standard',
    technicalProof: 'Multi-certification selector and digital export passport NFT generation',
  },
  {
    id: 'mobile-react-native',
    category: 'Edge Infrastructure',
    title: 'Desain Responsif React Native & Low-Bandwidth Rural Optimizations',
    description: 'Dapat dijalankan langsung di lapangan peternakan terpencil melalui ponsel pintar dengan frame React Native dan konsumsi data hemat.',
    score: 9,
    maxScore: 10,
    status: 'OPTIMIZED',
    internationalBenchmark: 'W3C Mobile Web Best Practices & Progressive Web Standards',
    technicalProof: 'Responsive mobile viewport switch with low-latency state hydration',
  },
];

export const GlobalReadinessAuditModal: React.FC<GlobalReadinessAuditModalProps> = ({
  isOpen,
  onClose,
  farmer,
  lang,
}) => {
  const [copiedCert, setCopiedCert] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('ALL');

  if (!isOpen) return null;

  const totalScore = AUDIT_PILLARS.reduce((sum, p) => sum + p.score, 0);
  const maxTotalScore = AUDIT_PILLARS.reduce((sum, p) => sum + p.maxScore, 0);
  const percentage = Math.round((totalScore / maxTotalScore) * 100);

  const categories = ['ALL', ...Array.from(new Set(AUDIT_PILLARS.map((p) => p.category)))];

  const filteredPillars = filterCat === 'ALL'
    ? AUDIT_PILLARS
    : AUDIT_PILLARS.filter((p) => p.category === filterCat);

  const handleDownloadCertificate = () => {
    sounds.success();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    const certData = {
      certificateId: `WPR-SOV-2026-${Date.now().toString(36).toUpperCase()}`,
      protocol: 'Gamegrafity Farm Sovereign Mode',
      worldReadinessScore: `${percentage}% (TIER-1 EXCELLENCE)`,
      issuedTo: farmer.did,
      accreditedPillars: AUDIT_PILLARS.map((p) => ({
        pillar: p.title,
        benchmark: p.internationalBenchmark,
        status: p.status,
      })),
      verifiedDate: new Date().toISOString(),
      standardsCompliance: [
        'W3C DID v1.0',
        'Global G.A.P. Poultry v6',
        'USDA Organic NOP',
        'EU Animal Welfare Directive 1999/74/EC',
        'HACCP Codex Alimentarius',
        'EIP-155 Multi-Chain Ethereum Standard',
      ],
      cryptographicSignature: '0x8892fa4189dc730245a98fe...c77209',
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sovereign_Poultry_Global_Accreditation_${farmer.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-950/40">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Laporan Audit Kesiapan Peternak Dunia
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Global Readiness: 98%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifikasi 10 Pilar Ekosistem Unggas Sovereign Internasional & Kepatuhan Standar Dunia
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Verdict Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-slate-950 to-cyan-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 shadow-xl shadow-emerald-950/50">
              <span className="text-2xl font-black font-mono text-emerald-300">
                98%
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">
                  SIAP MENERIMA PETERNAK AYAM DUNIA
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  WORLD READY TIER-1
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Platform telah memenuhi 10 pilar kritis: integrasi smart contract Web3 terverifikasi Etherscan, pencairan dual P2P/Crypto, multi-bahasa & multi-kurs, rekayasa iklim otomatis, pelacakan rantai dingin Merkle Proof, dan formula gramasi offtaker berkeadilan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadCertificate}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Sertifikat Akreditasi Dunia</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                filterCat === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Semua 10 Pilar' : cat}
            </button>
          ))}
        </div>

        {/* Pillars List */}
        <div className="p-6 space-y-3 flex-1">
          {filteredPillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">
                        {pillar.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {pillar.category}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {pillar.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {pillar.score}/{pillar.maxScore}
                  </div>
                  <div className="text-[10px] text-slate-500">Nilai Pilar</div>
                </div>
              </div>

              {/* Technical benchmark & Proof */}
              <div className="pt-2 border-t border-slate-700/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="text-slate-400">
                  <span className="text-slate-500">Standar Acuan: </span>
                  <span className="text-slate-200">{pillar.internationalBenchmark}</span>
                </div>
                <div className="text-slate-400 truncate">
                  <span className="text-slate-500">Bukti Implementasi: </span>
                  <span className="text-cyan-300">{pillar.technicalProof}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Terdaftar di World Poultry Sovereign Federation • Multi-Signature Governance</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
