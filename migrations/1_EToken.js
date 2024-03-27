const EToken = artifacts.require("EToken");

module.exports = function (deployer) {
    deployer.deploy(EToken);
};