# 🐔 Gamegrafity Farm: Sovereign Mode
### Web3 Agro-Fi & Sovereign Poultry Protocol • Dual-Payout Hub

**Gamegrafity Farm** adalah protokol agro-finansial berbasis Web3 dan model ekonomi *Sovereign* yang dirancang untuk menciptakan ekosistem peternakan modern yang transparan, adil, berbasis harga pasar nyata (*real-time*), serta menjamin keuntungan mutlak bagi peternak tanpa risiko kematian fisik ternak (*zero mortality rate*).

---

## 📐 Arsitektur Matematika Bisnis & Hukum Besi Moneter

Sistem ini beroperasi di atas pilar matematika ekonomi tertutup (*closed-loop monetary economics*) untuk memastikan likuiditas kas pusat selalu aman dan berkelanjutan:

1. **Invarian Mutlak ($V_{sys} > V_{harv}$):**
   Likuiditas uang sistem di *Treasury Reserve* ($V_{sys}$) wajib selalu lebih besar atau sama dengan total kewajiban serap panen ($V_{harv}$) ditambah koefisien cadangan darurat ($\alpha$):
   $$V_{sys} \ge V_{harvest} \times (1 + \alpha)$$

2. **Struktur HPP Utilitas Riil:**
   Seluruh komponen operasional (Bibit/DOC, Pakan, Listrik/kWh IoT, dan Tindakan Medis Dokter Hewan) dihitung berdasarkan riset harga pasar nyata *real-time* yang diringkas secara virtual melalui efisiensi distribusi langsung (*first-hand supplier*).

3. **Logika Serap Tanpa Batas (*Infinite Absorption Logic*):**
   * **Harga Serap Peternak ($H_{serap}$):** Dikunci di atas HPP riil ($H_{serap} > HPP$), memastikan peternak **pasti untung** dan dapat mencairkan hasil panen menjadi uang tunai nyata ke DANA atau rekening bank.
   * **Posisi Broker/Sistem:** Membeli di bawah harga pasar terbuka konvensional namun tetap di atas HPP, sehingga broker/sistem mendapatkan margin pengelolaan yang sehat tanpa risiko salah hitung atau kebobolan kas.

---

## 🛠️ Struktur Berkas Utama Repositori

* `src/` — Direktori komponen antarmuka, logika frontend, dan modul dasbor.
* `server.ts` — Skrip backend utama penghubung server/API.
* `package.json` — Daftar pustaka dan dependensi proyek.
* `vite.config.ts` — Konfigurasi bundler Vite.
* `tsconfig.json` — Konfigurasi TypeScript.
* `.env.example` — Template variabel lingkungan (*Environment Variables*) untuk koneksi database Neon dan Vercel.

---

## 🚀 Fitur & Integrasi Teknis

* **Sovereign Mode & Validasi Invarian:** Pemantauan otomatis status kesehatan kas treasury dan batas serap panen secara *real-time*.
* **Multi-Valas & Multi-Bahasa:** Mendukung berbagai mata uang (IDR, USD, EUR, BRL, ETH) dan pilihan bahasa global.
* **Dual-Payout Hub & QRIS DANA P2P:** Memfasilitasi pencairan dana instan dan transaksi peer-to-peer yang transparan.
* **Web3 Integration:** Koneksi dompet desentralisasi via MetaMask.
* **Siklus Biologis Nyata (*Lifecycle Pipeline*):** Pelacakan akurat mulai dari inkubasi telur, DOC, pullet, layer, hingga ayam afkir.

---

## ⚙️ Memulai & Instalasi

1. Klon repositori ini ke perangkat Anda:
   ```bash
   git clone [https://github.com/username/repository-name.git](https://github.com/username/repository-name.git)
