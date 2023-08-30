// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract NoteContract is Initializable, ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;
    // 记录笔记数量
    Counters.Counter private _listedItems;
    // 记录笔记tokenId
    Counters.Counter private _tokenIds;
    function initialize() initializer public {
        __ERC721_init("web3Note", "NC");
     }
    struct Note {
        uint tokenId;
        address creator;
    }
    // 保存所有的tokenURI, 用于判断是否已经存在
    mapping(string => bool) private _usedTokenURIs;
    // 保存所有的笔记,通过tokenId获取note
    mapping(uint => Note) private _noteList;
    // 所有者拥有的token列表
    mapping(address => mapping(uint => uint)) private _ownedTokens;
    // 所有者拥有的tokenId和对应下标
    mapping(uint => uint) private _idToOwnerIndex;
    event NoteCreated(uint tokenId, address creator);
    // 创建笔记
    function mintNote(string memory tokenURI) public returns (uint) {
        require(!_usedTokenURIs[tokenURI], "This tokenURI has been used");
        _tokenIds.increment();
        _listedItems.increment();

        uint newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _usedTokenURIs[tokenURI] = true;
        _noteList[newItemId] = Note(newItemId, msg.sender);
        emit NoteCreated(newItemId, msg.sender);
        return newItemId;
    }

    // 获取个人笔记列表
    function getOwnedNotes() public view returns (Note[] memory) {
        uint ownedNotesCount = balanceOf(msg.sender);
        Note[] memory items = new Note[](ownedNotesCount);

        for (uint i = 0; i < ownedNotesCount; i++) {
            uint tokenId = _ownedTokens[msg.sender][i];
            Note storage item = _noteList[tokenId];
            items[i] = item;
        }
        return items;
    }
    // 销毁笔记
    function burnTokenId(uint tokenId) public {
        require(msg.sender == _noteList[tokenId].creator, "You are not the creator of this note");
        _burn(tokenId);
    }
    function _beforeTokenTransfer(address from, address to, uint tokenId,uint256 batchSize) internal virtual override{
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from!=address(0)&&from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to!=address(0)&&to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }
    // 将tokenId添加所有者的枚举中
    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        // to拥有的note数量
        uint length = balanceOf(to);
        // 将tokenId添加到to拥有的note数组中
        _ownedTokens[to][length] = tokenId;
        // tokenId在to拥有的note数组中的index
        _idToOwnerIndex[tokenId] = length;
    }
    // 将tokenId从所有者的枚举中删除
    function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
        // from拥有的笔记数量
        uint lastTokenIndex = balanceOf(from) - 1;
        // tokenId在from拥有的笔记数组中的index
        uint tokenIndex = _idToOwnerIndex[tokenId];
        /**
         * 如果要删除的toukeId不是from拥有的笔记数组中的最后一个笔记
         * 则把from拥有的笔记数组中的最后一个笔记移到要删除的tokenId的位置
         */
        if(tokenIndex != lastTokenIndex){
            // from拥有的笔记数组中的最后一个笔记的tokenId
            uint lastTokenId = _ownedTokens[from][lastTokenIndex];
            // 将from拥有的笔记数组中的最后一个笔记移到要删除的tokenId的位置
            _ownedTokens[from][tokenIndex] = lastTokenId;
            // 将要最后的TokenId和index对应起来
            _idToOwnerIndex[lastTokenId] = tokenIndex;
        }
        // 删除tokenId在from拥有的NFT数组中的index
        delete _idToOwnerIndex[tokenId];
        // 删除from拥有的NFT数组中的最后一个笔记
        delete _ownedTokens[from][lastTokenIndex];
    }
}