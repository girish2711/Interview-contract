var TalioSet = artifacts.require("./Set");
var Talio = artifacts.require("./Talio");

module.exports = function(deployer) {
  deployer.deploy(TalioSet,{gas: 4612388});
    deployer.deploy(Talio,{gas: 4612388});
      
};
