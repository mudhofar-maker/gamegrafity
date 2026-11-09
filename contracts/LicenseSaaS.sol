// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LicenseSaaS
 * @dev Smart Contract Lisensi SaaS Berbasis NFT (ERC-721) untuk Polygon Amoy Testnet.
 * @author Senior Web3 & Solidity Architect (Gamegrafity Ecosystem)
 */
contract LicenseSaaS is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping tracking status lisensi aktif per tokenId
    mapping(uint256 => bool) public isLicenseActive;
    
    // Mapping 1-to-1 pencocokan lisensi per address klien
    mapping(address => uint256) public clientLicenseId;

    // Event on-chain saat lisensi SaaS baru diterbitkan
    event LicenseIssued(address indexed client, uint256 indexed tokenId, uint256 timestamp);
    // Event on-chain saat status lisensi diubah
    event LicenseStatusChanged(uint256 indexed tokenId, bool isActive, uint256 timestamp);

    /**
     * @dev Inisialisasi ERC-721 Token Name, Simbol, dan penetapan Owner (msg.sender).
     */
    constructor() ERC721("SaaS License Pass", "SAAS") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @notice Menerbitkan lisensi SaaS baru kepada address klien/mitra.
     * @dev Hanya bisa dieksekusi oleh Owner kontrak (onlyOwner).
     * @param to Alamat wallet penerima lisensi SaaS.
     * @return tokenId Nomor token lisensi unik yang diterbitkan.
     */
    function mintLicense(address to) external onlyOwner returns (uint256) {
        require(to != address(0), "LicenseSaaS: Alamat tujuan tidak valid");
        require(balanceOf(to) == 0, "LicenseSaaS: Klien sudah memiliki lisensi aktif");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        isLicenseActive[tokenId] = true;
        clientLicenseId[to] = tokenId;

        emit LicenseIssued(to, tokenId, block.timestamp);
        return tokenId;
    }

    /**
     * @notice Menonaktifkan atau mengaktifkan kembali lisensi tertentu.
     * @param tokenId ID token lisensi yang akan diubah statusnya.
     * @param active Status boolean aktif (true/false).
     */
    function setLicenseStatus(uint256 tokenId, bool active) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "LicenseSaaS: Token ID tidak ditemukan");
        isLicenseActive[tokenId] = active;
        emit LicenseStatusChanged(tokenId, active, block.timestamp);
    }

    /**
     * @notice Helper verifikasi instan untuk backend/middleware SaaS.
     * @param client Alamat wallet pengguna aplikasi SaaS.
     * @return bool True jika klien memiliki lisensi NFT dan berstatus aktif.
     */
    function hasValidLicense(address client) external view returns (bool) {
        uint256 tokenId = clientLicenseId[client];
        if (tokenId == 0) {
            return false;
        }
        return (ownerOf(tokenId) == client && isLicenseActive[tokenId]);
    }

    /**
     * @notice Mengembalikan total lisensi yang telah dicetak hingga saat ini.
     */
    function totalLicensesIssued() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
