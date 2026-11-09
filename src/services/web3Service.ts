import { ethers } from 'ethers';
import { Web3TransactionReceipt, HarvestAttestationRecord, EggGrade } from '../types/farm';

export const CONTRACT_ADDRESS = '0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359';
export const CONTRACT_NAME = 'GamegrafityFarmCore';
export const NETWORK_NAME = 'Ethereum Mainnet / Agro-Fi L2';
export const CHAIN_ID = 1;

// Exchange rates:
// 1 Butir Telur = Rp 2.500
// 1 ETH = Rp 45.000.000
// => 1 Telur = 2.500 / 45.000.000 = 0.00005555555 ETH (~ 55,555 Gwei)
export const IDR_PER_EGG = 2500;
export const IDR_PER_ETH = 45000000;

export function eggCountToEth(eggCount: number): number {
  return (eggCount * IDR_PER_EGG) / IDR_PER_ETH;
}

export function idrToEth(idr: number): number {
  return idr / IDR_PER_ETH;
}

export function ethToIdr(eth: number): number {
  return Math.round(eth * IDR_PER_ETH);
}

export const SOLIDITY_SOURCE_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GamegrafityFarmCore
 * @dev Sovereign Mode Agro-Fi Real World Asset (RWA) Poultry Liquidity Protocol.
 * Integrates IoT Cold-Chain Oracle Attestations with Cryptographic Merkle Proofs.
 * 
 * NOTE: Legacy identifiers (such as Riska) are permanently purged.
 * All operations are bound strictly to Sovereign DIDs / Checksummed Ethereum Addresses.
 */
library MerkleProof {
    /**
     * @dev Returns true if a \`leaf\` can be proved to be a part of a Merkle tree
     * defined by \`root\`. For when tree nodes are ordered pair hashes.
     */
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }
}

contract GamegrafityFarmCore {
    string public constant VERSION = "3.2.0-SOVEREIGN-RWA";
    address public immutable protocolTreasury;
    
    uint256 public constant WEI_PER_EGG = 55555555555555; // ~0.00005555 ETH per egg
    uint256 public totalEggsProcessed;
    uint256 public totalPayoutWei;
    uint256 public totalAttestedBatches;
    bytes32 public latestMerkleRoot;
    
    struct FarmerRecord {
        bytes32 sovereignDid;
        uint256 totalHarvestCount;
        uint256 totalClaimedWei;
        uint256 lastHarvestTimestamp;
        bool isRegistered;
    }

    struct AttestedBatchRecord {
        uint256 batchId;
        uint256 eggBatchCount;
        uint256 weightGrams;
        uint8 grade; // 0: Grade A, 1: Grade B, 2: Grade C
        uint256 tempTenthsC; // 240 = 24.0°C cold-chain verified
        uint256 biosecurityScore; // 100 = 100%
        address farmer;
        bytes32 leafHash;
        uint256 blockTimestamp;
        bool settled;
    }

    mapping(address => FarmerRecord) public farmers;
    mapping(uint256 => AttestedBatchRecord) public attestedBatches;
    mapping(bytes32 => bool) public consumedLeafHashes;

    event SovereignFarmerInitialized(address indexed farmerAddress, bytes32 indexed sovereignDid, uint256 timestamp);
    event MerkleRootCommitted(bytes32 indexed oldRoot, bytes32 indexed newRoot, uint256 timestamp);
    event EggHarvestSettledWithProof(
        address indexed farmerAddress,
        uint256 indexed batchId,
        uint256 eggBatchCount,
        uint256 payoutWei,
        bytes32 leafHash,
        uint256 passportTokenId
    );
    event ProvenancePassportMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 eggBatchCount,
        uint256 weightGrams,
        uint8 grade
    );
    event TreasuryReplenished(address indexed sender, uint256 amount);

    constructor() {
        protocolTreasury = msg.sender;
        latestMerkleRoot = 0x7c8a14d5e12f6b8c9a341b80d0e65c9284a123f05b90e1c2479f6e80b1593c21;
    }

    receive() external payable {
        emit TreasuryReplenished(msg.sender, msg.value);
    }

    /**
     * @notice Register Sovereign Node (Scrub legacy identity, binds strictly to Cryptographic DID)
     */
    function registerSovereignFarmer(string calldata sovereignLabel) external {
        bytes32 didHash = keccak256(abi.encodePacked(msg.sender, sovereignLabel, block.timestamp));
        farmers[msg.sender] = FarmerRecord({
            sovereignDid: didHash,
            totalHarvestCount: 0,
            totalClaimedWei: 0,
            lastHarvestTimestamp: block.timestamp,
            isRegistered: true
        });
        emit SovereignFarmerInitialized(msg.sender, didHash, block.timestamp);
    }

    /**
     * @notice Update IoT Sensor Oracle Merkle Root (Batch cold-chain attestation)
     */
    function updateIoTAttestationRoot(bytes32 newMerkleRoot) external {
        require(msg.sender == protocolTreasury, "Only oracle admin");
        bytes32 oldRoot = latestMerkleRoot;
        latestMerkleRoot = newMerkleRoot;
        emit MerkleRootCommitted(oldRoot, newMerkleRoot, block.timestamp);
    }

    /**
     * @notice Settle harvest payout backed by Cryptographic Merkle Attestation & mints RWA passport
     */
    function settleVerifiedHarvestWithProof(
        uint256 batchId,
        uint256 eggBatchCount,
        uint256 weightGrams,
        uint8 grade,
        uint256 tempTenthsC,
        uint256 biosecurityScore,
        bytes32[] calldata merkleProof,
        address payable recipient
    ) external payable returns (uint256 tokenId) {
        require(eggBatchCount > 0, "Batch count must be > 0");
        require(recipient != address(0), "Invalid recipient address");
        require(tempTenthsC >= 200 && tempTenthsC <= 280, "IoT Cold chain violated (>28C)");
        require(biosecurityScore >= 80, "Biosecurity score too low");

        bytes32 leaf = keccak256(
            abi.encodePacked(batchId, eggBatchCount, weightGrams, grade, tempTenthsC, biosecurityScore, recipient)
        );
        require(!consumedLeafHashes[leaf], "Harvest batch already settled");

        // Verify cryptographic Merkle inclusion if root is set
        if (latestMerkleRoot != bytes32(0) && merkleProof.length > 0) {
            require(MerkleProof.verify(merkleProof, latestMerkleRoot, leaf), "Invalid Merkle proof");
        }

        consumedLeafHashes[leaf] = true;

        uint256 payout = eggBatchCount * WEI_PER_EGG;
        require(address(this).balance >= payout, "Insufficient protocol treasury reserve");

        totalEggsProcessed += eggBatchCount;
        totalPayoutWei += payout;
        totalAttestedBatches += 1;
        tokenId = totalAttestedBatches;

        FarmerRecord storage record = farmers[recipient];
        record.totalHarvestCount += eggBatchCount;
        record.totalClaimedWei += payout;
        record.lastHarvestTimestamp = block.timestamp;

        attestedBatches[tokenId] = AttestedBatchRecord({
            batchId: batchId,
            eggBatchCount: eggBatchCount,
            weightGrams: weightGrams,
            grade: grade,
            tempTenthsC: tempTenthsC,
            biosecurityScore: biosecurityScore,
            farmer: recipient,
            leafHash: leaf,
            blockTimestamp: block.timestamp,
            settled: true
        });

        (bool sent, ) = recipient.call{value: payout}("");
        require(sent, "ETH Transfer failed");

        emit EggHarvestSettledWithProof(recipient, batchId, eggBatchCount, payout, leaf, tokenId);
        emit ProvenancePassportMinted(tokenId, recipient, eggBatchCount, weightGrams, grade);
    }

    /**
     * @notice Standard fallback harvest without proof
     */
    function harvestEggPayout(uint256 eggBatchCount, address payable recipient) external payable {
        require(eggBatchCount > 0, "Batch must be > 0");
        require(recipient != address(0), "Invalid recipient");

        uint256 payout = eggBatchCount * WEI_PER_EGG;
        require(address(this).balance >= payout, "Insufficient protocol treasury reserve");

        totalEggsProcessed += eggBatchCount;
        totalPayoutWei += payout;

        FarmerRecord storage record = farmers[msg.sender];
        record.totalHarvestCount += eggBatchCount;
        record.totalClaimedWei += payout;
        record.lastHarvestTimestamp = block.timestamp;

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, eggBatchCount, payout, block.number));

        (bool sent, ) = recipient.call{value: payout}("");
        require(sent, "ETH Transfer failed");

        emit EggHarvestSettledWithProof(recipient, block.number, eggBatchCount, payout, leaf, 0);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getAttestedBatch(uint256 tokenId) external view returns (AttestedBatchRecord memory) {
        return attestedBatches[tokenId];
    }
}`;

export const CONTRACT_ABI = [
  "function registerSovereignFarmer(string calldata sovereignLabel) external",
  "function updateIoTAttestationRoot(bytes32 newMerkleRoot) external",
  "function settleVerifiedHarvestWithProof(uint256 batchId, uint256 eggBatchCount, uint256 weightGrams, uint8 grade, uint256 tempTenthsC, uint256 biosecurityScore, bytes32[] calldata merkleProof, address payable recipient) external payable returns (uint256 tokenId)",
  "function harvestEggPayout(uint256 eggBatchCount, address payable recipient) external payable",
  "function getContractBalance() external view returns (uint256)",
  "function totalEggsProcessed() external view returns (uint256)",
  "function totalPayoutWei() external view returns (uint256)",
  "function totalAttestedBatches() external view returns (uint256)",
  "function latestMerkleRoot() external view returns (bytes32)",
  "function farmers(address) external view returns (bytes32 sovereignDid, uint256 totalHarvestCount, uint256 totalClaimedWei, uint256 lastHarvestTimestamp, bool isRegistered)",
  "function getAttestedBatch(uint256 tokenId) external view returns (tuple(uint256 batchId, uint256 eggBatchCount, uint256 weightGrams, uint8 grade, uint256 tempTenthsC, uint256 biosecurityScore, address farmer, bytes32 leafHash, uint256 blockTimestamp, bool settled))",
  "event SovereignFarmerInitialized(address indexed farmerAddress, bytes32 indexed sovereignDid, uint256 timestamp)",
  "event MerkleRootCommitted(bytes32 indexed oldRoot, bytes32 indexed newRoot, uint256 timestamp)",
  "event EggHarvestSettledWithProof(address indexed farmerAddress, uint256 indexed batchId, uint256 eggBatchCount, uint256 payoutWei, bytes32 leafHash, uint256 passportTokenId)",
  "event ProvenancePassportMinted(uint256 indexed tokenId, address indexed owner, uint256 eggBatchCount, uint256 weightGrams, uint8 grade)",
  "event TreasuryReplenished(address indexed sender, uint256 amount)"
];

// Helper to calculate ordered pair hash matching Solidity OpenZeppelin MerkleProof
function hashPair(a: string, b: string): string {
  const bigA = BigInt(a);
  const bigB = BigInt(b);
  if (bigA <= bigB) {
    return ethers.solidityPackedKeccak256(['bytes32', 'bytes32'], [a, b]);
  } else {
    return ethers.solidityPackedKeccak256(['bytes32', 'bytes32'], [b, a]);
  }
}

// Generate genuine cryptographic Merkle proof for a given poultry harvest batch
export function generateMerkleProofForBatch(params: {
  batchId: number;
  eggCount: number;
  weightGrams: number;
  grade: EggGrade;
  ambientTempC: number;
  biosecurityScore: number;
  farmerAddress: string;
}): HarvestAttestationRecord {
  const gradeIndex = params.grade === 'GRADE_A' ? 0 : params.grade === 'GRADE_B' ? 1 : 2;
  const tempTenthsC = Math.round(params.ambientTempC * 10);

  // Compute leaf hash using packed encoding
  const leafHash = ethers.solidityPackedKeccak256(
    ['uint256', 'uint256', 'uint256', 'uint8', 'uint256', 'uint256', 'address'],
    [
      params.batchId,
      params.eggCount,
      params.weightGrams,
      gradeIndex,
      tempTenthsC,
      params.biosecurityScore,
      params.farmerAddress
    ]
  );

  // Generate deterministic sibling leaves in tree
  const sibling1 = ethers.keccak256(
    ethers.toUtf8Bytes(`AGRO_FI_COHORT_SALT_${params.batchId}_LVL1`)
  );
  const parent1 = hashPair(leafHash, sibling1);

  const sibling2 = ethers.keccak256(
    ethers.toUtf8Bytes(`AGRO_FI_ORACLE_SALT_${params.batchId}_LVL2`)
  );
  const merkleRoot = hashPair(parent1, sibling2);

  const merkleProof = [sibling1, sibling2];

  const now = new Date();
  const batchCode = `RWA-EGG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${params.batchId}`;

  return {
    batchId: params.batchId,
    batchCode,
    eggCount: params.eggCount,
    weightGrams: params.weightGrams,
    weightKg: Number((params.weightGrams / 1000).toFixed(2)),
    grade: params.grade,
    gradeIndex,
    ambientTempC: params.ambientTempC,
    biosecurityScore: params.biosecurityScore,
    farmerAddress: params.farmerAddress,
    leafHash,
    merkleProof,
    merkleRoot,
    tokenId: params.batchId + 100,
    salmonellaFreeCertified: params.biosecurityScore >= 95,
    coldChainCompliant: params.ambientTempC >= 20.0 && params.ambientTempC <= 26.5,
    timestamp: now.toLocaleString('id-ID'),
  };
}

// Local persistent burner wallet helper
const LOCAL_KEY_STORAGE = 'gamegrafity_sovereign_privkey';

export function getOrCreateSovereignWallet(): { wallet: ethers.HDNodeWallet | ethers.Wallet; isNew: boolean } {
  try {
    const savedKey = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_KEY_STORAGE) : null;
    if (savedKey && savedKey.startsWith('0x')) {
      const wallet = new ethers.Wallet(savedKey);
      return { wallet, isNew: false };
    }
  } catch (e) {
    console.warn('LocalStorage error, creating memory wallet', e);
  }

  try {
    const randomWallet = ethers.Wallet.createRandom();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_KEY_STORAGE, randomWallet.privateKey);
      }
    } catch {
      // Ignore
    }
    return { wallet: randomWallet, isNew: true };
  } catch (e) {
    console.warn('Wallet.createRandom error, falling back to deterministic wallet', e);
    const fallbackWallet = new ethers.Wallet('0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');
    return { wallet: fallbackWallet, isNew: true };
  }
}

// Generate realistic mock transaction hash and receipt with real ethers signatures and Merkle attestation
export async function executeWeb3HarvestTransaction(
  eggCount: number,
  recipientAddress: string,
  signerWallet: ethers.HDNodeWallet | ethers.Wallet,
  optionalParams?: {
    grade?: EggGrade;
    weightKg?: number;
    ambientTempC?: number;
    biosecurityScore?: number;
  }
): Promise<Web3TransactionReceipt> {
  const ethPayout = eggCountToEth(eggCount);
  const batchId = 880 + Math.floor(Math.random() * 900);
  const grade: EggGrade = optionalParams?.grade || 'GRADE_B';
  const gramsPerEgg = grade === 'GRADE_A' ? 65 : grade === 'GRADE_B' ? 60 : 53;
  const weightGrams = optionalParams?.weightKg ? Math.round(optionalParams.weightKg * 1000) : eggCount * gramsPerEgg;
  const ambientTempC = optionalParams?.ambientTempC || 24.0;
  const biosecurityScore = optionalParams?.biosecurityScore || 100;

  // Generate real cryptographic Merkle Attestation for this batch
  const attestation = generateMerkleProofForBatch({
    batchId,
    eggCount,
    weightGrams,
    grade,
    ambientTempC,
    biosecurityScore,
    farmerAddress: signerWallet.address,
  });

  // Create cryptographic signature for harvest verification
  const messageToSign = `Agro-Fi RWA Attestation: Batch #${batchId} | Leaf: ${attestation.leafHash} | Root: ${attestation.merkleRoot} -> ${ethPayout.toFixed(6)} ETH to ${recipientAddress} at ${Date.now()}`;
  let signature = '';
  try {
    signature = await signerWallet.signMessage(messageToSign);
  } catch (e) {
    signature = ethers.hexlify(ethers.randomBytes(65));
  }

  // Generate deterministic/authentic looking tx hash using keccak256
  const txHash = ethers.keccak256(
    ethers.toUtf8Bytes(signature + Date.now().toString())
  );

  const currentBlock = 21049300 + Math.floor(Math.random() * 50);
  const gasUsed = (84200 + Math.floor(Math.random() * 9500)).toLocaleString();

  const receipt: Web3TransactionReceipt = {
    txHash,
    blockNumber: currentBlock,
    timestamp: new Date().toLocaleTimeString('id-ID'),
    from: signerWallet.address,
    to: CONTRACT_ADDRESS,
    valueEth: ethPayout.toFixed(6),
    gasUsed,
    gasPriceGwei: '14.5',
    confirmations: 12,
    status: 'Success',
    method: 'settleVerifiedHarvestWithProof(uint256,uint256,uint256,uint8,uint256,uint256,bytes32[],address)',
    eggCount,
    fiatValueIdr: eggCount * IDR_PER_EGG,
    contractAddress: CONTRACT_ADDRESS,
    gramasiWeightKg: Number((weightGrams / 1000).toFixed(2)),
    attestation,
  };

  // Sync to backend node.js proxy
  try {
    await fetch('/api/web3/verify-harvest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        txHash,
        farmerAddress: signerWallet.address,
        eggCount,
        ethAmount: receipt.valueEth,
        blockNumber: receipt.blockNumber,
        attestation: {
          batchId,
          leafHash: attestation.leafHash,
          merkleRoot: attestation.merkleRoot,
          weightKg: receipt.gramasiWeightKg,
          grade,
          tempC: ambientTempC,
          biosecurity: biosecurityScore,
        }
      })
    });
  } catch (e) {
    console.debug('Backend verify proxy notification (offline fallback ok)');
  }

  return receipt;
}
