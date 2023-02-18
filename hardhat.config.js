require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: process.env.VITE_QUICKNODE_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
