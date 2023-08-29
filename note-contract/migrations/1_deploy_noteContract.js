/* eslint-disable no-undef */
const NoteContract = artifacts.require("NoteContract");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');


module.exports = async function (deployer) {
    await deployProxy(NoteContract, [], { deployer });
};