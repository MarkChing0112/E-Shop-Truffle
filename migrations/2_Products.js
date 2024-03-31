const Products = artifacts.require("products");

module.exports = function (deployer) {
    deployer.deploy(Products);
};