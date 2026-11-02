import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Code2,
  FileText,
  Layers,
  ShieldCheck,
  Database,
  Terminal,
  Award,
  Search,
  Key,
  Flame,
  ArrowRight,
  Fingerprint,
  Cpu,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { Web3TransactionReceipt, HarvestAttestationRecord } from '../types/farm';
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  SOLIDITY_SOURCE_CODE,
  CONTRACT_ABI,
  IDR_PER_ETH,
  IDR_PER_EGG
} from '../services/web3Service';
import { formatRupiah, shortenAddress } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';

interface EtherscanModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Web3TransactionReceipt | null;
  sovereignAddress?: string;
  onWriteHarvest?: (eggCount: number) => void;
}

type TabType =
  | 'OVERVIEW'
  | 'LOGS'
  | 'READ_CONTRACT'
  | 'WRITE_CONTRACT'
  | 'RWA_PASSPORT'
  | 'CONTRACT'
  | 'ABI'
  | 'CLI_VERIFY';

export const EtherscanModal: React.FC<EtherscanModalProps> = ({
  isOpen,
  onClose,
  receipt,
  sovereignAddress,
  onWriteHarvest,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Read Contract interactive states
  const [queryAddress, setQueryAddress] = useState<string>(sovereignAddress || '');
  const [queriedFarmerResult, setQueriedFarmerResult] = useState<{
    sovereignDid: string;
    totalHarvestCount: number;
    totalClaimedWei: string;
    isRegistered: boolean;
  } | null>(null);

  // Write Contract interactive states
  const [writeBatchCount, setWriteBatchCount] = useState<number>(120);
  const [writeRecipient, setWriteRecipient] = useState<string>(sovereignAddress || '');
  const [writeStatusMsg, setWriteStatusMsg] = useState<string | null>(null);
  const [isExecutingWrite, setIsExecutingWrite] = useState<boolean>(false);

  if (!isOpen) return null;

  // Fallback receipt if opened directly from contract viewer button
  const displayReceipt: Web3TransactionReceipt = receipt || {
    txHash: '0x8a92f1b4028ce372a08901fbc654e99a12c8b0933ff21049300649172834b6e2',
    blockNumber: 21049342,
    timestamp: new Date().toLocaleTimeString('id-ID'),
    from: sovereignAddress || '0x71C8364f3B821A8598711674488b03FfB61b8D01',
    to: CONTRACT_ADDRESS,
    valueEth: '0.006667',
    gasUsed: '84,320',
    gasPriceGwei: '14.5',
    confirmations: 24,
    status: 'Success',
    method: 'settleVerifiedHarvestWithProof(uint256,uint256,uint256,uint8,uint256,uint256,bytes32[],address)',
    eggCount: 120,
    fiatValueIdr: 300000,
    contractAddress: CONTRACT_ADDRESS,
    gramasiWeightKg: 7.2,
    attestation: {
      batchId: 914,
      batchCode: 'RWA-EGG-2026-914',
      eggCount: 120,
      weightGrams: 7200,
      weightKg: 7.2,
      grade: 'GRADE_B',
      gradeIndex: 1,
      ambientTempC: 24.0,
      biosecurityScore: 100,
      farmerAddress: sovereignAddress || '0x71C8364f3B821A8598711674488b03FfB61b8D01',
      leafHash: '0x3f5b7a92c48102d8f9b6e417932c0f2a74c102948bbef8013e847120bc94f092',
      merkleProof: [
        '0xd8294ca810f2495b2149b01e389204bf89320149bb892014efbc83920149bb89',
        '0xfa491820491823901bca89210498bca74e892c900e5720491823a019efbc912',
      ],
      merkleRoot: '0x7c8a14d5e12f6b8c9a341b80d0e65c9284a123f05b90e1c2479f6e80b1593c21',
      tokenId: 1014,
      salmonellaFreeCertified: true,
      coldChainCompliant: true,
      timestamp: new Date().toLocaleString('id-ID'),
    },
  };

  const attestation: HarvestAttestationRecord | undefined = displayReceipt.attestation;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQueryFarmer = () => {
    sounds.playClick();
    const addr = queryAddress.trim() || sovereignAddress || '0x71C8364f3B821A8598711674488b03FfB61b8D01';
    setQueriedFarmerResult({
      sovereignDid: `did:pkh:eip155:1:${addr}`,
      totalHarvestCount: 420,
      totalClaimedWei: '0.023333 ETH (~Rp 1.050.000)',
      isRegistered: true,
    });
  };

  const handleExecuteWrite = () => {
    sounds.playClick();
    setIsExecutingWrite(true);
    setWriteStatusMsg('Membuat tanda tangan EIP-712 & Broadcast txn ke EVM Mempool...');

    setTimeout(() => {
      setIsExecutingWrite(false);
      setWriteStatusMsg(`Sukses! Transaksi telah di-mine di Block #${displayReceipt.blockNumber + 1}. Event: EggHarvestSettledWithProof terpancarkan.`);
      sounds.playWeb3Success();
      if (onWriteHarvest) {
        onWriteHarvest(writeBatchCount);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#111927] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Etherscan Brand Header */}
        <div className="px-5 py-3.5 bg-[#0d131f] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md text-sm">
              Ξ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base font-sans">Etherscan</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Agro-Fi Verification L2 / Ethereum
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 hidden sm:inline-block">
                  RWA Oracle Attested
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Contract: <span className="text-blue-400">{shortenAddress(CONTRACT_ADDRESS)}</span> • {CONTRACT_NAME}.sol
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono hidden md:flex"
            >
              Public Network <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-[#0f172a] border-b border-slate-800 flex gap-1 sm:gap-2 overflow-x-auto scrollbar-thin">
          {[
            { id: 'OVERVIEW', label: 'Overview', icon: FileText },
            { id: 'LOGS', label: 'Logs & Events', icon: Layers },
            { id: 'READ_CONTRACT', label: 'Read Contract', icon: Search },
            { id: 'WRITE_CONTRACT', label: 'Write Contract', icon: Wallet },
            { id: 'RWA_PASSPORT', label: 'RWA NFT Passport', icon: Award },
            { id: 'CONTRACT', label: 'Contract Code', icon: Code2 },
            { id: 'ABI', label: 'ABI', icon: Database },
            { id: 'CLI_VERIFY', label: 'CLI Verify', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  sounds.playClick();
                }}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-sans text-xs">
          {/* ============= TAB 1: OVERVIEW ============= */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Highlight Status Bar */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm">Transaction Status: Success</span>
                    <span className="block text-[11px] text-emerald-300/80 font-mono">
                      Confirmed in Block #{displayReceipt.blockNumber} • Cryptographic Merkle Root Validated
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                  0x1 (Success)
                </span>
              </div>

              {/* Transaction Key Metrics Grid */}
              <div className="bg-[#0b101b] rounded-xl border border-slate-800 p-4 space-y-3 font-mono">
                {/* Hash */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">Transaction Hash:</span>
                  <div className="md:col-span-3 flex items-center gap-2">
                    <span className="text-blue-400 break-all select-all font-mono">{displayReceipt.txHash}</span>
                    <button
                      onClick={() => handleCopy(displayReceipt.txHash, 'txHash')}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Salin Tx Hash"
                    >
                      {copiedKey === 'txHash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Block */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">Block:</span>
                  <div className="md:col-span-3 text-slate-200">
                    <span className="text-blue-400 font-bold">{displayReceipt.blockNumber}</span>
                    <span className="ml-2 text-slate-400 text-[11px]">({displayReceipt.confirmations} block confirmations)</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">Timestamp:</span>
                  <div className="md:col-span-3 text-slate-200">
                    {displayReceipt.timestamp} (Verifikasi Real-Time)
                  </div>
                </div>

                {/* From */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">From (Sovereign Node):</span>
                  <div className="md:col-span-3 flex items-center gap-2 text-blue-400 flex-wrap">
                    <span className="break-all">{displayReceipt.from}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Sovereign DID
                    </span>
                  </div>
                </div>

                {/* Interacted With (To) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">Interacted With (To):</span>
                  <div className="md:col-span-3 flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400">Contract</span>
                    <span className="text-blue-400 break-all">{displayReceipt.to}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {CONTRACT_NAME}
                    </span>
                  </div>
                </div>

                {/* Value */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">Value (Panen Telur):</span>
                  <div className="md:col-span-3">
                    <span className="text-white font-bold text-sm">{displayReceipt.valueEth} ETH</span>
                    <span className="ml-2 text-slate-400">({formatRupiah(displayReceipt.fiatValueIdr)} IDR)</span>
                  </div>
                </div>

                {/* Gramasi */}
                {displayReceipt.gramasiWeightKg && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                    <span className="text-slate-400">Gramasi Panen:</span>
                    <div className="md:col-span-3 text-amber-300 font-semibold">
                      {displayReceipt.gramasiWeightKg} Kg ({displayReceipt.eggCount} Butir)
                    </div>
                  </div>
                )}

                {/* Method */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 border-b border-slate-800/80 items-center">
                  <span className="text-slate-400">Method Called:</span>
                  <div className="md:col-span-3 text-amber-400 font-bold break-all">
                    {displayReceipt.method}
                  </div>
                </div>

                {/* Gas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1.5 items-center">
                  <span className="text-slate-400">Gas Used by Txn:</span>
                  <div className="md:col-span-3 text-slate-300">
                    {displayReceipt.gasUsed} ({displayReceipt.gasPriceGwei} Gwei)
                  </div>
                </div>
              </div>

              {/* Merkle Attestation Seal in Overview */}
              {attestation && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-purple-200">Cryptographic IoT Cold-Chain Oracle Attestation</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Merkle Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                    <div className="bg-slate-950/70 p-2 rounded">
                      <span className="text-slate-500 block text-[10px]">Leaf Hash:</span>
                      <span className="text-purple-300 break-all text-[11px]">{attestation.leafHash}</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded">
                      <span className="text-slate-500 block text-[10px]">Merkle Root:</span>
                      <span className="text-emerald-300 break-all text-[11px]">{attestation.merkleRoot}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============= TAB 2: LOGS ============= */}
          {activeTab === 'LOGS' && (
            <div className="space-y-4">
              {/* Event 1 */}
              <div className="bg-[#0b101b] rounded-xl border border-slate-800 p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Event: EggHarvestSettledWithProof
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Log Index: [0]
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Address: </span>
                    <span className="text-blue-400">{CONTRACT_ADDRESS}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Topic 0 (Event Signature): </span>
                    <span className="text-slate-300 break-all">
                      0x8c792b012903fe92b1a0398ef9204bca789230491823a019efbc912304981290
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Topic 1 (farmerAddress): </span>
                    <span className="text-purple-400 break-all">{displayReceipt.from}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Topic 2 (batchId): </span>
                    <span className="text-amber-400 font-mono">
                      {attestation ? attestation.batchId : displayReceipt.blockNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Data (eggBatchCount, payoutWei, leafHash, tokenId):</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg text-slate-300 mt-1 space-y-1">
                      <div>eggBatchCount: <span className="text-emerald-400">{displayReceipt.eggCount} Butir</span></div>
                      <div>payoutWei: <span className="text-amber-400">{displayReceipt.valueEth} ETH</span></div>
                      <div>leafHash: <span className="text-purple-300">{attestation?.leafHash || '0x4f...'}</span></div>
                      <div>passportTokenId: <span className="text-blue-400">#{attestation?.tokenId || 1014}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event 2: Provenance NFT */}
              <div className="bg-[#0b101b] rounded-xl border border-slate-800 p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Event: ProvenancePassportMinted (ERC-721 RWA)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Log Index: [1]
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <div>Topic 1 (tokenId): <span className="text-blue-400">#{attestation?.tokenId || 1014}</span></div>
                  <div>Topic 2 (owner): <span className="text-purple-400">{displayReceipt.from}</span></div>
                  <div className="bg-slate-950 p-2 rounded text-slate-400">
                    Data: eggCount={displayReceipt.eggCount}, weight={displayReceipt.gramasiWeightKg}kg, grade=Grade B
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============= TAB 3: READ CONTRACT ============= */}
          {activeTab === 'READ_CONTRACT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-950/20 border border-blue-800/40 p-3.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-200 font-semibold">
                    Live EVM State Queries (Read-only functions via Ethers.js)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Target: {CONTRACT_NAME}</span>
              </div>

              {/* Query 1: VERSION */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono space-y-2">
                <div className="text-xs text-slate-400 font-bold">1. VERSION() <span className="text-slate-600">view returns (string)</span></div>
                <div className="bg-slate-950 p-2.5 rounded-lg text-emerald-400 text-xs">
                  "3.2.0-SOVEREIGN-RWA"
                </div>
              </div>

              {/* Query 2: latestMerkleRoot */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono space-y-2">
                <div className="text-xs text-slate-400 font-bold">2. latestMerkleRoot() <span className="text-slate-600">view returns (bytes32)</span></div>
                <div className="bg-slate-950 p-2.5 rounded-lg text-purple-300 text-xs break-all">
                  {attestation?.merkleRoot || '0x7c8a14d5e12f6b8c9a341b80d0e65c9284a123f05b90e1c2479f6e80b1593c21'}
                </div>
              </div>

              {/* Query 3: totalEggsProcessed & totalPayoutWei */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono space-y-2">
                  <div className="text-xs text-slate-400 font-bold">3. totalEggsProcessed() <span className="text-slate-600">view (uint256)</span></div>
                  <div className="bg-slate-950 p-2.5 rounded-lg text-white font-bold text-sm">
                    420 Butir
                  </div>
                </div>
                <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono space-y-2">
                  <div className="text-xs text-slate-400 font-bold">4. getContractBalance() <span className="text-slate-600">view (uint256)</span></div>
                  <div className="bg-slate-950 p-2.5 rounded-lg text-emerald-400 font-bold text-sm">
                    0.285 ETH (~Rp 12.825.000)
                  </div>
                </div>
              </div>

              {/* Query 4: farmers(address) */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono space-y-3">
                <div className="text-xs text-slate-400 font-bold">
                  5. farmers(address) <span className="text-slate-600">view returns (sovereignDid, totalHarvestCount, totalClaimedWei, isRegistered)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryAddress}
                    onChange={(e) => setQueryAddress(e.target.value)}
                    placeholder="0x Alamat Peternak Sovereign..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleQueryFarmer}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Query
                  </button>
                </div>

                {queriedFarmerResult && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs text-slate-300">
                    <div>[0] bytes32 sovereignDid: <span className="text-purple-300 break-all">{queriedFarmerResult.sovereignDid}</span></div>
                    <div>[1] uint256 totalHarvestCount: <span className="text-white font-bold">{queriedFarmerResult.totalHarvestCount} Butir</span></div>
                    <div>[2] uint256 totalClaimedWei: <span className="text-amber-400">{queriedFarmerResult.totalClaimedWei}</span></div>
                    <div>[3] bool isRegistered: <span className="text-emerald-400 font-bold">true</span></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============= TAB 4: WRITE CONTRACT ============= */}
          {activeTab === 'WRITE_CONTRACT' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="font-bold text-white text-xs">Connected Web3 Sovereign Node</span>
                    <span className="block text-[11px] text-purple-300 font-mono">
                      {shortenAddress(sovereignAddress || '0x71C8364f3B821A8598711674488b03FfB61b8D01')} • Network: Ethereum Agro-Fi
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Sign
                </span>
              </div>

              {/* Write Method 1 */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 font-mono space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-white font-bold text-xs flex items-center gap-2">
                    <span className="text-amber-400">1.</span>
                    settleVerifiedHarvestWithProof
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    State Mutating
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">eggBatchCount (uint256)</label>
                    <input
                      type="number"
                      value={writeBatchCount}
                      onChange={(e) => setWriteBatchCount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">recipient (address)</label>
                    <input
                      type="text"
                      value={writeRecipient}
                      onChange={(e) => setWriteRecipient(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg text-[11px] text-slate-400 space-y-0.5">
                  <div>• Estimated Payout: <span className="text-emerald-400 font-bold">{((writeBatchCount * IDR_PER_EGG) / IDR_PER_ETH).toFixed(6)} ETH</span> ({formatRupiah(writeBatchCount * IDR_PER_EGG)})</div>
                  <div>• Merkle Proof inclusion: Auto-calculated with Oracle cold-chain signature (24.0°C)</div>
                </div>

                <button
                  onClick={handleExecuteWrite}
                  disabled={isExecutingWrite}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-lg transition text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isExecutingWrite ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Broadcasting Transaction to Sepolia/Mainnet...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Write / Execute on EVM (Sign with Sovereign Key)
                    </>
                  )}
                </button>

                {writeStatusMsg && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    {writeStatusMsg}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============= TAB 5: RWA NFT PASSPORT ============= */}
          {activeTab === 'RWA_PASSPORT' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0b101b] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Real World Asset (RWA) Poultry Digital Passport</h4>
                      <p className="text-[11px] text-slate-400">Standard: ERC-721 On-Chain Cold Chain & Biosecurity Metadata</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                    Token #{attestation ? attestation.tokenId : 1014}
                  </span>
                </div>

                {/* Digital Certificate Badge */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#101b2b] to-slate-950 border border-amber-500/40 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-start justify-between relative z-10 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/80">Agro-Fi Provenance Certificate</span>
                      <h3 className="text-lg font-extrabold text-white">BATCH {attestation?.batchCode || 'RWA-EGG-2026-914'}</h3>
                      <p className="text-xs text-slate-400 font-mono">Issued by: GamegrafityFarmCore.sol</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg">
                      🥚
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs mb-4">
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Jumlah Butir</span>
                      <span className="text-white font-bold">{displayReceipt.eggCount} Butir</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Gramasi Timbangan</span>
                      <span className="text-amber-300 font-bold">{displayReceipt.gramasiWeightKg || 7.2} Kg</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Suhu IoT Cold-Chain</span>
                      <span className="text-emerald-400 font-bold">24.0°C (Certified)</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Biosekuriti</span>
                      <span className="text-purple-300 font-bold">100% Bebas Wabah</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Merkle Leaf:</span>
                      <span className="text-purple-300">{shortenAddress(attestation?.leafHash || '0x3f5...092')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Merkle Root:</span>
                      <span className="text-emerald-300">{shortenAddress(attestation?.merkleRoot || '0x7c8...c21')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Salmonella Test:</span>
                      <span className="text-emerald-400 font-bold">NEGATIVE (PASS)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(attestation, null, 2), 'metadata')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'metadata' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy OpenSea Metadata JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============= TAB 6: CONTRACT CODE ============= */}
          {activeTab === 'CONTRACT' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#0b101b] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-white font-semibold">
                    Contract Source Code Verified (Solidity 0.8.24) • Optimization: 200 runs
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(SOLIDITY_SOURCE_CODE, 'solidity')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'solidity' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Code
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[420px] overflow-y-auto">
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {SOLIDITY_SOURCE_CODE}
                </pre>
              </div>
            </div>
          )}

          {/* ============= TAB 7: ABI ============= */}
          {activeTab === 'ABI' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Contract Application Binary Interface (ABI) for Web3, Ethers.js & Wagmi:</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(CONTRACT_ABI, null, 2), 'abi')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'abi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy ABI
                </button>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[400px] overflow-y-auto">
                <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(CONTRACT_ABI, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* ============= TAB 8: CLI VERIFY ============= */}
          {activeTab === 'CLI_VERIFY' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 leading-relaxed">
                Gunakan skrip CLI berikut untuk memverifikasi kontrak ini langsung di Etherscan Sepolia / Ethereum Mainnet:
              </div>

              {/* Hardhat */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono">1. Hardhat Verification</span>
                  <button
                    onClick={() => handleCopy(`npx hardhat verify --network sepolia ${CONTRACT_ADDRESS}`, 'hardhat')}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                  >
                    {copiedKey === 'hardhat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Command
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-300 select-all">
                  npx hardhat verify --network sepolia {CONTRACT_ADDRESS}
                </div>
              </div>

              {/* Foundry */}
              <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 font-mono">2. Foundry / Forge Verification</span>
                  <button
                    onClick={() => handleCopy(`forge verify-contract --chain sepolia ${CONTRACT_ADDRESS} src/contracts/${CONTRACT_NAME}.sol:${CONTRACT_NAME} --watch`, 'forge')}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                  >
                    {copiedKey === 'forge' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Command
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-300 select-all">
                  forge verify-contract --chain sepolia {CONTRACT_ADDRESS} src/contracts/{CONTRACT_NAME}.sol:{CONTRACT_NAME} --watch
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#0d131f] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ethereum Agro-Fi Verifier v3.2</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-xs font-semibold"
          >
            Tutup Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
