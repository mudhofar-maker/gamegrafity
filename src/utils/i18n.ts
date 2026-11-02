export type SupportedLanguage = 'en' | 'id' | 'es' | 'pt' | 'zh';

export type SupportedCurrency = 'USD' | 'EUR' | 'BRL' | 'IDR' | 'ETH' | 'USDC';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToIdr: number; // 1 Currency = X IDR
  flag: string;
  decimals: number;
}

export const CURRENCY_RATES: Record<SupportedCurrency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToIdr: 16000, flag: '🇺🇸', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToIdr: 17200, flag: '🇪🇺', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rateToIdr: 2750, flag: '🇧🇷', decimals: 2 },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rateToIdr: 1, flag: '🇮🇩', decimals: 0 },
  ETH: { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', rateToIdr: 49600000, flag: '⟠', decimals: 5 },
  USDC: { code: 'USDC', symbol: '$', name: 'USD Coin (ERC-20)', rateToIdr: 16000, flag: '🔵', decimals: 2 },
};

export function convertIdrToCurrency(amountIdr: number, targetCurrency: SupportedCurrency): number {
  const config = CURRENCY_RATES[targetCurrency];
  if (!config) return amountIdr;
  return amountIdr / config.rateToIdr;
}

export function formatCustomCurrency(amountIdr: number, targetCurrency: SupportedCurrency): string {
  const config = CURRENCY_RATES[targetCurrency];
  const converted = convertIdrToCurrency(amountIdr, targetCurrency);

  if (targetCurrency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(converted);
  }

  if (targetCurrency === 'ETH') {
    return `${config.symbol} ${converted.toFixed(5)}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: targetCurrency === 'USDC' ? 'USD' : targetCurrency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(converted) + (targetCurrency === 'USDC' ? ' USDC' : '');
}

export const TRANSLATIONS = {
  en: {
    // Header & Brand
    brandSubtitle: 'Global Web3 Agro-Fi & Sovereign Poultry Protocol • Dual-Payout Hub',
    sovereignBadge: 'Sovereign Mode',
    activeFarmer: 'Active Sovereign Farmer',
    ownerKas: 'Owner Treasury Vault',
    myWalletBalance: 'My Available Balance',
    topUpBtn: 'Top-Up Capital (QRIS / Card / Crypto)',
    topUpSub: 'Instant zero-fee broker liquidity',
    withdrawBtn: 'Harvest Payout (P2P / DANA / Web3 ETH)',
    withdrawSub: 'Liquidate egg yield to Bank, DANA, or Etherscan Web3',
    gramasiBtn: 'Gramasi Fair Trade Logic',
    globalGatewayBtn: 'Global Farmer Onboarding',
    globalCoopBtn: 'World Co-op Map',
    globalAuditBtn: 'World Readiness Audit (98/100)',
    smartContractBtn: 'Smart Contract',
    etherscanBtn: 'Etherscan Verified',

    // Lifecycle
    cycleHeader: 'Poultry Biological Lifecycle (Real-Time Simulator)',
    phase: 'Current Phase',
    activePopulation: 'Active Flock Population',
    eggAccumulation: 'Egg Yield Accumulation',
    readyForHarvest: 'Ready for Broker Offtaker',
    biosecurity: 'Biosecurity Health',
    advanceCycleBtn: 'Advance 1 Day (Generate Harvest)',
    sellAllEggsBtn: 'Liquidate All Eggs via Gramasi',

    // Climate
    climateTitle: 'IoT Climate & Heating Conditioners',
    ambientTemp: 'Ambient Coop Temp',
    targetTemp: 'Target Setpoint',
    humidity: 'Coop Humidity',
    climateStatus: 'Climate Regulation Status',

    // Market
    marketTitle: 'Real-Time Poultry & Egg Commodity Exchange',
    marketSubtitle: 'National & Global live benchmarks to ensure fair-value offtake',

    // Emergency
    emergencyHeader: 'Autonomous Emergency Command Center',
    takeAction: 'Execute Priority Directive',

    // Ledger
    ledgerTitle: 'Real-Time Ledger & On-Chain Audit',
    allCategory: 'All Events',

    // Global Farmer
    joinGlobalCoop: 'Join as Global Farmer',
    countryLabel: 'Select Your Country & Region',
    flockScale: 'Flock Scale (Number of Birds)',
    climateZone: 'Coop Climate Zone',
    certifications: 'International Certifications',
    payoutRail: 'Preferred Payout Rail',
    mintDidBtn: 'Generate Sovereign DID & Onboard Farm',
    globalCoopTitle: 'World Poultry Cooperative Network',
    connectedNodes: 'Active Global Nodes',
    coopBirds: 'Total Co-op Birds',
    dailyEggs: 'Daily Co-op Eggs',
  },
  id: {
    brandSubtitle: 'Web3 Agro-Fi & Sovereign Poultry Protocol • Dual-Payout Hub',
    sovereignBadge: 'Sovereign Mode',
    activeFarmer: 'Peternak Berdaulat Aktif',
    ownerKas: 'Kas Treasury Owner',
    myWalletBalance: 'Saldo Dompet Saya',
    topUpBtn: 'Top-Up Saldo (QRIS / DANA / Transfer)',
    topUpSub: 'Tambah saldo instan tanpa potongan broker',
    withdrawBtn: 'Tarik Saldo (P2P DANA / Web3 ETH)',
    withdrawSub: 'Cairkan profit panen ke Bank, DANA, atau Etherscan',
    gramasiBtn: 'Logika Gramasi Peternak',
    globalGatewayBtn: 'Pendaftaran Peternak Dunia',
    globalCoopBtn: 'Peta Koperasi Global',
    globalAuditBtn: 'Audit Kesiapan Dunia (98/100)',
    smartContractBtn: 'Smart Contract',
    etherscanBtn: 'Etherscan Terverifikasi',

    cycleHeader: 'Siklus Biologis Ayam (Real-Time Simulator)',
    phase: 'Fase Biologis',
    activePopulation: 'Populasi Aktif',
    eggAccumulation: 'Akumulasi Telur',
    readyForHarvest: 'Siap Panen Broker',
    biosecurity: 'Kesehatan Biosekuriti',
    advanceCycleBtn: 'Majukan Siklus 1 Hari (Generate Panen)',
    sellAllEggsBtn: 'Jual Semua Telur ke Broker (Gramasi)',

    climateTitle: 'Pengatur Suhu Otomatis & AC Api',
    ambientTemp: 'Suhu Aktual Kandang',
    targetTemp: 'Target Suhu Ideal',
    humidity: 'Kelembaban Relatif (RH)',
    climateStatus: 'Status Pengatur Iklim',

    marketTitle: 'Indeks Harga Pasar Telur & Ayam Real-Time',
    marketSubtitle: 'Harga Resmi Bapanas, Pinsar Indonesia & Acuan Dunia CME/USDA',

    emergencyHeader: 'Pusat Komando Alarm Darurat Otomatis',
    takeAction: 'Jalankan Perintah Prioritas',

    ledgerTitle: 'Live Ledger & Audit On-Chain',
    allCategory: 'Semua Transaksi',

    joinGlobalCoop: 'Daftar Sebagai Peternak Dunia',
    countryLabel: 'Pilih Negara & Wilayah Kandang',
    flockScale: 'Skala Populasi Ternak',
    climateZone: 'Zona Iklim Kandang',
    certifications: 'Sertifikasi Internasional',
    payoutRail: 'Jalur Pembayaran Hasil Panen',
    mintDidBtn: 'Terbitkan Sovereign DID & Hubungkan Kandang',
    globalCoopTitle: 'Jaringan Koperasi Unggas Dunia',
    connectedNodes: 'Simpul Peternak Aktif',
    coopBirds: 'Total Populasi Unggas',
    dailyEggs: 'Produksi Telur Harian',
  },
  es: {
    brandSubtitle: 'Protocolo Agro-Fi Web3 y Avicultura Soberana • Hub de Pago Dual',
    sovereignBadge: 'Modo Soberano',
    activeFarmer: 'Granjero Soberano Activo',
    ownerKas: 'Bóveda de Tesorería',
    myWalletBalance: 'Mi Saldo Disponible',
    topUpBtn: 'Recargar Saldo (QRIS / Tarjeta / Cripto)',
    topUpSub: 'Liquidez instantánea sin intermediarios',
    withdrawBtn: 'Retiro de Cosecha (P2P / DANA / Web3 ETH)',
    withdrawSub: 'Liquidar producción a Banco, DANA o Etherscan',
    gramasiBtn: 'Lógica de Gramaje Justo',
    globalGatewayBtn: 'Registro Granjero Global',
    globalCoopBtn: 'Mapa Cooperativa Mundial',
    globalAuditBtn: 'Auditoría Global (98/100)',
    smartContractBtn: 'Contrato Inteligente',
    etherscanBtn: 'Etherscan Verificado',

    cycleHeader: 'Ciclo Biológico Avícola (Simulador en Tiempo Real)',
    phase: 'Fase Actual',
    activePopulation: 'Población Activa',
    eggAccumulation: 'Huevos Acumulados',
    readyForHarvest: 'Listo para Venta',
    biosecurity: 'Salud y Bioseguridad',
    advanceCycleBtn: 'Avanzar 1 Día (Generar Cosecha)',
    sellAllEggsBtn: 'Liquidar Todos los Huevos',

    climateTitle: 'Climatización IoT y Calefacción de Precisión',
    ambientTemp: 'Temp. Ambiente Galpón',
    targetTemp: 'Punto de Ajuste Ideal',
    humidity: 'Humedad Relativa',
    climateStatus: 'Regulación de Clima',

    marketTitle: 'Bolsa de Huevos y Aves en Tiempo Real',
    marketSubtitle: 'Precios oficiales CME/USDA, Europa y América Latina',

    emergencyHeader: 'Centro de Mando de Alarma Autónoma',
    takeAction: 'Ejecutar Directiva Prioritaria',

    ledgerTitle: 'Libro Mayor en Vivo y Auditoría Web3',
    allCategory: 'Todas las Operaciones',

    joinGlobalCoop: 'Unirse como Granjero Global',
    countryLabel: 'Seleccione País y Región',
    flockScale: 'Escala de Aves (Población)',
    climateZone: 'Zona Climática',
    certifications: 'Certificaciones Internacionales',
    payoutRail: 'Vía de Pago Preferida',
    mintDidBtn: 'Generar DID Soberano y Conectar Galpón',
    globalCoopTitle: 'Red Cooperativa Avícola Mundial',
    connectedNodes: 'Nodos Conectados',
    coopBirds: 'Total de Aves Cooperativas',
    dailyEggs: 'Producción Diaria',
  },
  pt: {
    brandSubtitle: 'Protocolo Agro-Fi Web3 e Avicultura Soberana • Hub de Pagamento Duplo',
    sovereignBadge: 'Modo Soberano',
    activeFarmer: 'Avicultor Soberano Ativo',
    ownerKas: 'Cofre do Tesouro',
    myWalletBalance: 'Meu Saldo Disponível',
    topUpBtn: 'Recarga de Saldo (PIX / QRIS / Cripto)',
    topUpSub: 'Liquidez instantânea sem taxa de corretagem',
    withdrawBtn: 'Retirada de Lucro (P2P / PIX / Web3 ETH)',
    withdrawSub: 'Liquidar ovos para Banco, DANA ou Etherscan',
    gramasiBtn: 'Lógica de Gramatura Justa',
    globalGatewayBtn: 'Portal Avicultor Global',
    globalCoopBtn: 'Mapa Cooperativa Global',
    globalAuditBtn: 'Auditoria de Prontidão (98/100)',
    smartContractBtn: 'Contrato Inteligente',
    etherscanBtn: 'Etherscan Verificado',

    cycleHeader: 'Ciclo Biológico Avícola (Simulador Tempo Real)',
    phase: 'Fase Atual',
    activePopulation: 'População Ativa',
    eggAccumulation: 'Acúmulo de Ovos',
    readyForHarvest: 'Pronto para Abatedouro/Broker',
    biosecurity: 'Biosegurança e Saúde',
    advanceCycleBtn: 'Avançar 1 Dia (Gerar Postura)',
    sellAllEggsBtn: 'Vender Todos os Ovos (Gramatura)',

    climateTitle: 'Climatização IoT e Aquecimento Controlado',
    ambientTemp: 'Temperatura do Aviário',
    targetTemp: 'Meta Térmica',
    humidity: 'Umidade Relativa',
    climateStatus: 'Status Térmico',

    marketTitle: 'Índice de Preços de Aves e Ovos em Tempo Real',
    marketSubtitle: 'Cotações CEPEA Brasil, USDA e Bolsa de Chicago',

    emergencyHeader: 'Central de Alarme e Diretrizes Críticas',
    takeAction: 'Executar Diretiva Imediata',

    ledgerTitle: 'Livro-Razão ao Vivo & Auditoria On-Chain',
    allCategory: 'Todos os Lançamentos',

    joinGlobalCoop: 'Registrar Granja Global',
    countryLabel: 'Selecione seu País e Estado',
    flockScale: 'Escala de Aves no Aviário',
    climateZone: 'Zona Climática',
    certifications: 'Certificações Internacionais',
    payoutRail: 'Canal de Pagamento',
    mintDidBtn: 'Emitir DID Soberano e Conectar Granja',
    globalCoopTitle: 'Rede Cooperativa Avícola Mundial',
    connectedNodes: 'Granjas Conectadas',
    coopBirds: 'Total de Aves Cooperadas',
    dailyEggs: 'Ovos Diários',
  },
  zh: {
    brandSubtitle: '全球Web3农业金融与主权禽业协议 • 双通道结算枢纽',
    sovereignBadge: '主权模式',
    activeFarmer: '当前活跃主权农场主',
    ownerKas: '农场财库金库',
    myWalletBalance: '我的可用余额',
    topUpBtn: '充值资本 (QRIS / 银行卡 / 加密货币)',
    topUpSub: '即时零手续费补充流动资金',
    withdrawBtn: '提取利润 (P2P / 钱包 / Web3 ETH)',
    withdrawSub: '将鸡蛋产量提现至银行或以太坊智能合约',
    gramasiBtn: '公平称重克重商业逻辑',
    globalGatewayBtn: '全球农场主入驻门户',
    globalCoopBtn: '全球禽业合作社地图',
    globalAuditBtn: '全球就绪度审计报告 (98/100)',
    smartContractBtn: '智能合约',
    etherscanBtn: '以太坊区块链认证',

    cycleHeader: '蛋鸡生物生命周期模拟器 (实时仿真)',
    phase: '当前生理阶段',
    activePopulation: '活跃家禽存栏量',
    eggAccumulation: '待采收产蛋量',
    readyForHarvest: '待收购商交付',
    biosecurity: '生物安全健康指数',
    advanceCycleBtn: '推进1天 (生成产蛋并更新数据)',
    sellAllEggsBtn: '按克重清算全部鸡蛋',

    climateTitle: '物联网鸡舍温控与暖风热能系统',
    ambientTemp: '鸡舍实时环境温度',
    targetTemp: '目标设定温度',
    humidity: '相对湿度 (RH)',
    climateStatus: '环境调控状态',

    marketTitle: '全球禽肉与鲜蛋商品实时指数',
    marketSubtitle: '对接国际芝加哥商品交易所、农业部与地方基准',

    emergencyHeader: '全自动应急指挥与智能告警',
    takeAction: '立即执行首要指令',

    ledgerTitle: '实时区块链分布式账本',
    allCategory: '全部交易',

    joinGlobalCoop: '入驻成为全球农场主',
    countryLabel: '选择您的国家与地区',
    flockScale: '家禽养殖规模 (羽)',
    climateZone: '所在气候带',
    certifications: '国际合规认证',
    payoutRail: '首选支付渠道',
    mintDidBtn: '生成主权DID并入驻全球联盟',
    globalCoopTitle: '全球家禽去中心化合作社网络',
    connectedNodes: '活跃全球节点',
    coopBirds: '合作社家禽总量',
    dailyEggs: '每日产蛋总量',
  },
};
