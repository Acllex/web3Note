/* eslint-disable no-undef */
const NoteContract = artifacts.require("NoteContract");
const NoteContractV3 = artifacts.require("NoteContractV3");

const { prepareUpgrade, upgradeProxy } = require('@openzeppelin/truffle-upgrades');


module.exports = async function (deployer) {
    const note = await NoteContract.deployed()
    await prepareUpgrade(note.address, NoteContractV3, { deployer });
    await upgradeProxy(note.address, NoteContractV3, { deployer });
};