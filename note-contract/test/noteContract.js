/* eslint-disable no-undef */
const NoteContract = artifacts.require("NoteContract");


contract("NoteContract", (accounts) => {
    let noteContract;
    before(async () => {
        noteContract = await NoteContract.deployed();
    });

    describe("deployment", async () => {
        it("deploys successfully", async () => {
            const address = await noteContract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async () => {
            const name = await noteContract.name();
            assert.equal(name, "NoteContract");
        });

        it("has a symbol", async () => {
            const symbol = await noteContract.symbol();
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
            const owner = await noteContract.ownerOf(1)
            assert.equal(owner, accounts[0], 'owner is not accounts[0]')
        })
        it('第一个token是否指向正确的tokenURI', async () => {
            const actTokenURI = await noteContract.tokenURI(1)
            assert.equal(actTokenURI, tokenURI, '没有指向正确的tokenURI')
        })
        it('不能用使用过的tokenURI', async () => {
            try {
                await noteContract.mintNote(tokenURI, {
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
            await noteContract.mintNote(`${tokenURI}+1`, {
                from: accounts[1]
            })
        });
        it("获取笔记列表", async () => {
            const noteList = await noteContract.getOwnedNotes({ from: accounts[0] })
            assert.equal(noteList.length, 2, '获取笔记列表失败')
        })
    })
})