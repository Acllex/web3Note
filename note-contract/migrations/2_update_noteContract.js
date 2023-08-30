/* eslint-disable no-undef */
const NoteContract = artifacts.require("NoteContract");
const NoteContractV2 = artifacts.require("NoteContractV2");

const { prepareUpgrade, upgradeProxy } = require('@openzeppelin/truffle-upgrades');


module.exports = async function (deployer) {
    const note = await NoteContract.deployed()
    await prepareUpgrade(note.address, NoteContractV2, { deployer });
    await upgradeProxy(note.address, NoteContractV2, { deployer });
};