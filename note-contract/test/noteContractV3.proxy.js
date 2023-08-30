/* eslint-disable no-undef */
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const NoteContract = artifacts.require("NoteContract");
const NoteContractV3 = artifacts.require("NoteContractV3");

contract("NoteContractV3(proxy)", (accounts) => {
    let noteContract, noteContractV3
    before(async () => {
        noteContract = await deployProxy(NoteContract);
        noteContractV3 = await upgradeProxy(noteContract.address, NoteContractV3)
    });

    describe("deployment", async () => {
        it("deploys successfully", async () => {
            const address = await noteContractV3.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async () => {
            const name = await noteContractV3.name();
            assert.equal(name, "web3Note");
        });

        it("has a symbol", async () => {
            const symbol = await noteContractV3.symbol();
            assert.equal(symbol, "NC");
        });
    });

    describe("minting", async () => {
        const tokenURI = 'https://www.baidu.com'
        before(async () => {
            await noteContract.mintNote(tokenURI, {
                from: accounts[0]
            })
        });
        it('创建token是否是accounts[0]', async () => {
            const owner = await noteContractV3.ownerOf(1)
            assert.equal(owner, accounts[0], 'owner is not accounts[0]')
        })
        it('第一个token是否指向正确的tokenURI', async () => {
            const actTokenURI = await noteContractV3.tokenURI(1)
            assert.equal(actTokenURI, tokenURI, '没有指向正确的tokenURI')
        })
        it('不能用使用过的tokenURI', async () => {
            try {
                await noteContractV3.mintNote(tokenURI, {
                    from: accounts[0]
                })
            } catch (err) {
                assert(err, '没有抛出错误')
            }
        })
    });
    describe('获取笔记列表', async () => {
        const tokenURI = 'https://www.baidu1.com'
        before(async () => {
            await noteContract.mintNote(tokenURI, {
                from: accounts[0]
            })
            await noteContractV3.mintNote(`${tokenURI}+1`, {
                from: accounts[1]
            })
        });
        it("获取笔记列表", async () => {
            const noteList = await noteContractV3.getOwnedNotes({ from: accounts[0] })
            // console.log(noteList)
            assert.equal(noteList.length, 2, '获取笔记列表失败')
        })
    })
    describe('销毁笔记', async () => {
        it("销毁笔记", async () => {
            await noteContractV3.burnTokenId(1, { from: accounts[0] })
            const noteList = await noteContractV3.getOwnedNotes({ from: accounts[0] })
            assert.equal(noteList.length, 1, '销毁笔记失败')
        })
    })
})