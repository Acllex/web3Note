/* eslint-disable no-undef */
const NoteContract = artifacts.require("NoteContract");


module.exports = function (deployer) {
    deployer.deploy(NoteContract);
};