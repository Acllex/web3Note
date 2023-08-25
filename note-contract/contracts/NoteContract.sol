// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NoteContract is ERC721URIStorage, Ownable {
    constructor() ERC721("NoteContract", "NC") {}
    using Counters for Counters.Counter;
    // 记录笔记数量
    Counters.Counter private _listedItems;
    // 记录笔记tokenId
    Counters.Counter private _tokenIds;
    struct Note {
        uint tokenId;
        uint creatTime;
        uint updateTime;
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
    event NoteCreated(uint tokenId, uint creatTime, uint updateTime, address creator);
    // 创建笔记
    function mintNote(string memory tokenURI) public returns (uint) {
        require(!_usedTokenURIs[tokenURI], "This tokenURI has been used");
        _tokenIds.increment();
        _listedItems.increment();

        uint newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _usedTokenURIs[tokenURI] = true;
        _noteList[newItemId] = Note(newItemId,block.timestamp,block.timestamp, msg.sender);
        emit NoteCreated(newItemId, block.timestamp, block.timestamp, msg.sender);
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

    function _beforeTokenTransfer(address from, address to, uint tokenId,uint256 batchSize) internal virtual override{
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if(to == address(0)){
            // _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
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
}