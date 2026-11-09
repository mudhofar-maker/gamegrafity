import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  FileCheck,
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { OFFICIAL_CERTIFICATIONS, OfficialCertification } from '../data/certificationData';
import { sounds } from '../utils/soundEffects';

interface CertificationSectionProps {
  onOpenModal: (cert?: OfficialCertification) => void;
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({ onOpenModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'Semua Sertifikasi', count: OFFICIAL_CERTIFICATIONS.length },
    { key: 'FOOD_SAFETY', label: 'Keamanan Pangan & Halal', count: OFFICIAL_CERTIFICATIONS.filter(c => c.category === 'FOOD_SAFETY').length },
    { key: 'VETERINARY', label: 'Kesehatan Hewan & NKV', count: OFFICIAL_CERTIFICATIONS.filter(c => c.category === 'VETERINARY').length },
    { key: 'WEB3_SECURITY', label: 'Web3 & Smart Contract', count: OFFICIAL_CERTIFICATIONS.filter(c => c.category === 'WEB3_SECURITY').length },
    { key: 'GOV_REGULATORY', label: 'Regulasi Pemerintah (PSE)', count: OFFICIAL_CERTIFICATIONS.filter(c => c.category === 'GOV_REGULATORY').length },
  ];

  const filteredCerts = selectedCategory === 'ALL'
    ? OFFICIAL_CERTIFICATIONS
    : OFFICIAL_CERTIFICATIONS.filter(c => c.category === selectedCategory);

  const handleCopyReg = (e: React.MouseEvent, regNumber: string, id: string) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard.writeText(regNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="certifications-section" className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative space-y-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-emerald-500/20 shrink-0 border border-emerald-400/30">
            🎖️
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Sertifikasi &amp; Legalitas Resmi Platform
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                7 Akreditasi Aktif
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Gamegrafity Farm beroperasi di bawah standar kepatuhan tertinggi: Keamanan Pangan Nasional &amp; Internasional (NKV, Halal BPJPH, ISO 22000), Mutu Operasional (ISO 9001), Praktik Peternakan Terbaik (GFP), Audit Keamanan Smart Contract Web3, dan PSE Kominfo RI.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenModal();
          }}
          className="self-start lg:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 hover:from-emerald-600/50 hover:to-cyan-600/50 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold font-mono transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 shrink-0"
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Lihat Berkas Sertifikat Lengkap</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Trust Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center space-y-1">
          <div className="text-emerald-400 font-mono font-black text-lg sm:text-xl">NKV TINGKAT 1</div>
          <div className="text-[11px] text-slate-400">Higienitas &amp; Biosekuriti Kementan</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center space-y-1">
          <div className="text-emerald-400 font-mono font-black text-lg sm:text-xl">HALAL 100%</div>
          <div className="text-[11px] text-slate-400">BPJPH Kemenag &amp; MUI Resmi</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center space-y-1">
          <div className="text-cyan-400 font-mono font-black text-lg sm:text-xl">ISO 22000 &amp; 9001</div>
          <div className="text-[11px] text-slate-400">Standar Mutu Pangan Global</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center space-y-1">
          <div className="text-purple-400 font-mono font-black text-lg sm:text-xl">0 VULNERABILITY</div>
          <div className="text-[11px] text-slate-400">Smart Contract Web3 Lolos Audit</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scroll relative z-10">
        <span className="text-xs text-slate-400 font-mono flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3 text-cyan-400" />
          Kategori:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              sounds.playClick();
              setSelectedCategory(cat.key);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition shrink-0 flex items-center gap-1.5 ${
              selectedCategory === cat.key
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Certification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {filteredCerts.map((cert) => {
          return (
            <div
              key={cert.id}
              onClick={() => {
                sounds.playClick();
                onOpenModal(cert);
              }}
              className="group p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-indigo-500/50 group-hover:h-1.5 transition-all" />

              <div className="space-y-3">
                {/* Badge and Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cert.icon}</span>
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {cert.badgeCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                    {cert.categoryLabel}
                  </span>
                </div>

                {/* Title and Authority */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {cert.issuingAuthority}
                  </p>
                </div>

                {/* Reg Number Box (Click to copy) */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-500 block">Nomor Lisensi / Registrasi:</span>
                    <span className="text-slate-200 font-semibold">{cert.regNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopyReg(e, cert.regNumber, cert.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
                    title="Salin Nomor Registrasi"
                  >
                    {copiedId === cert.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                  {cert.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span className="line-clamp-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400 font-semibold">{cert.statusLabel}</span>
                <span className="group-hover:translate-x-1 transition text-cyan-400 font-bold flex items-center gap-1">
                  Detail Dokumen →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
