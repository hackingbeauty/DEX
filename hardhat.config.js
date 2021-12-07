require('@nomiclabs/hardhat-waffle');


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require('./tasks/faucet');

module.exports = {
  solidity: '0.8.1',
  compilers: {
    solc: {
      version: '0.8.1',
    },
  },
};
