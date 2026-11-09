import React, { useState } from 'react';
import {
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Printer,
  Sparkles,
  FileCheck,
  Building,
  Calendar,
  Lock,
  Globe
} from 'lucide-react';
import { OFFICIAL_CERTIFICATIONS, OfficialCertification } from '../data/certificationData';
import { sounds } from '../utils/soundEffects';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCertId?: string | null;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  isOpen,
  onClose,
  selectedCertId,
}) => {
  const [activeCertId, setActiveCertId] = useState<string>(
    selectedCertId || OFFICIAL_CERTIFICATIONS[0].id
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCert =
    OFFICIAL_CERTIFICATIONS.find((c) => c.id === activeCertId) ||
    OFFICIAL_CERTIFICATIONS[0];

  const handleCopy = (text: string, fieldName: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 text-xl font-bold">
              🎖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  Dokumen Sertifikasi &amp; Akreditasi Resmi
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  Terakreditasi Penuh
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifikasi Standar Mutu, NKV Kementan, Halal BPJPH, ISO 22000/9001 &amp; Audit Web3
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Tab List & Right Details */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Cert List Navigation */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 p-3 sm:p-4 overflow-y-auto space-y-1.5 bg-slate-950/60 shrink-0">
            <div className="text-[11px] font-mono font-bold text-slate-400 px-2 pb-1 uppercase tracking-wider">
              Daftar Sertifikat (7)
            </div>
            {OFFICIAL_CERTIFICATIONS.map((cert) => {
              const isActive = cert.id === currentCert.id;
              return (
                <button
                  key={cert.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveCertId(cert.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-white shadow-md'
                      : 'hover:bg-slate-900 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{cert.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate text-slate-100">
                      {cert.badgeCode}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {cert.name}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{cert.statusLabel}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Certificate Certificate View */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-900/40">
            
            {/* Certificate Header Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-xl bg-slate-900 border border-slate-800">{currentCert.icon}</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {currentCert.categoryLabel}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {currentCert.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    STATUS: {currentCert.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Official Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
              
              {/* Box 1: Nomor Registrasi */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>NOMOR REGISTRASI / LISENSI:</span>
                  <button
                    onClick={() => handleCopy(currentCert.regNumber, 'reg')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px]"
                  >
                    {copiedField === 'reg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'reg' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="text-sm font-bold text-slate-100 select-all">
                  {currentCert.regNumber}
                </div>
              </div>

              {/* Box 2: Masa Berlaku */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">MASA BERLAKU SERTIFIKASI:</div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentCert.validUntil}</span>
                </div>
              </div>

              {/* Box 3: Lembaga Penerbit */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                <div className="text-[10px] text-slate-500">LEMBAGA / OTORITAS PENERBIT:</div>
                <div className="text-xs font-semibold text-slate-200">
                  {currentCert.issuingAuthority}
                </div>
              </div>

              {/* Box 4: Lingkup Sertifikasi */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                <div className="text-[10px] text-slate-500">RUANG LINGKUP AKREDITASI:</div>
                <div className="text-xs text-slate-300 font-sans leading-relaxed">
                  {currentCert.scope}
                </div>
              </div>

              {/* Box 5: Standar Acuan */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">STANDAR REGULASI ACUAN:</div>
                <div className="text-xs font-bold text-slate-200">
                  {currentCert.standard}
                </div>
              </div>

              {/* Box 6: Hasil Audit / Pengujian */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">HASIL AUDIT / SCORE:</div>
                <div className="text-xs font-bold text-cyan-300">
                  {currentCert.auditScore}
                </div>
              </div>

            </div>

            {/* Poin Utama Verifikasi */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pilar Jaminan Kualitas &amp; Kepatuhan:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentCert.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">●</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blockchain On-Chain Verification Hash (if applicable) */}
            {currentCert.verificationHashOrUrl && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1 text-xs font-mono">
                <div className="text-[10px] text-purple-300 flex items-center justify-between">
                  <span>BUKTI VERIFIKASI ON-CHAIN (SMART CONTRACT):</span>
                  <button
                    onClick={() => handleCopy(currentCert.verificationHashOrUrl!, 'hash')}
                    className="text-purple-400 hover:text-purple-200 flex items-center gap-1 text-[10px]"
                  >
                    {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'hash' ? 'Tersalin' : 'Salin Hash'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-purple-200 font-mono truncate select-all">
                  {currentCert.verificationHashOrUrl}
                </div>
              </div>
            )}

            {/* Official Digital Seal & Stamp */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-cyan-950/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-400/60 flex items-center justify-center font-serif text-emerald-400 font-black text-xs shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                  SEAL
                </div>
                <div>
                  <div className="font-bold text-white">Stempel Digital Resmi Gamegrafity Farm</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Owner &amp; Pengelola: Mudhofar's™ • KCP Cikarang BCA 3432650071
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Cetak PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="hidden sm:inline">Semua sertifikasi aktif dan diaudit secara berkala</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition ml-auto"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
