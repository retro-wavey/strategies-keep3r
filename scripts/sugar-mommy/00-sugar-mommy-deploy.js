const Confirm = require('prompt-confirm');
const hre = require('hardhat');
const ethers = hre.ethers;
const config = require('../../.config.json');
const { e18, ZERO_ADDRESS } = require('../../utils/web3-utils');

const prompt = new Confirm('Do you wish to deploy keep3r escrow contract?');

async function main() {
  await hre.run('compile');
  const Keep3rSugarMommy = await ethers.getContractFactory('Keep3rSugarMommy');

  await promptAndSubmit(Keep3rSugarMommy);
}

function promptAndSubmit(Keep3rSugarMommy) {
  return new Promise((resolve) => {
    try {
      prompt.ask(async (answer) => {
        if (answer) {
          console.time('Keep3rSugarMommy deployed');
          const escrowContracts = config.contracts.mainnet.escrow;
          // Setup Keep3rSugarMommy
          const keep3rSugarMommy = await Keep3rSugarMommy.deploy(
            escrowContracts.keep3r,
            ZERO_ADDRESS, // // KP3R bond
            e18.mul(50), // 50 KP3Rs bond requirement
            0,
            0,
            true
          );
          escrowContracts.keep3rSugarMommy = keep3rSugarMommy.address;
          console.timeEnd('Keep3rSugarMommy deployed');
          console.log('Keep3rSugarMommy address:', keep3rSugarMommy.address);
          console.log(
            'TODO: change .config.json & example.config.json keep3rSugarMommy address to:',
            keep3rSugarMommy.address
          );
          // Setup Keep3rSugarMommy as a keep3r job
          console.log('keep3r governance needs to do:');
          console.log(
            `${escrowContracts.keep3r}.addJob(${keep3rSugarMommy.address})`
          );
          resolve();
        } else {
          console.error('Aborted!');
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });