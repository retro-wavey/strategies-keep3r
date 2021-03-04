// function addStrategies(address[] calldata _strategies, uint256[] calldata _requiredAmounts) external override onlyGovernorOrMechanic {
import { ContractFactory } from 'ethers';
import { run, ethers } from 'hardhat';
import { bnToDecimal } from '../../../utils/web3-utils';
import config from '../../../.config.json';
import { v1CrvStrategies } from '../../../utils/v1-crv-strategies';
const mainnetContracts = config.contracts.mainnet;

async function main() {
  await run('compile');
  await promptAndSubmit();
}

function promptAndSubmit(): Promise<void | Error> {
  return new Promise(async (resolve, reject) => {
    console.log('adding strategies on HarvestV2Keep3rJob contract');
    try {
      // Setup HarvestV2Keep3rJob
      const harvestV2Keep3rJob = await ethers.getContractAt(
        'HarvestV2Keep3rJob',
        mainnetContracts.proxyJobs.harvestV2Keep3rJob
      );

      // Add harvest strategies
      const defaultHarvestAmount = 2_000_000; // 2m gas (no extra decimals)
      const v2Strategies = [
        {
          address: '0x979843B8eEa56E0bEA971445200e0eC3398cdB87',
          harvestAmount: defaultHarvestAmount,
        },
        { address: '0x4D7d4485fD600c61d840ccbeC328BfD76A050F87' },
        { address: '0x4031afd3B0F71Bace9181E554A9E680Ee4AbE7dF' },
        { address: '0xeE697232DF2226c9fB3F02a57062c4208f287851' },
        { address: '0x32b8C26d0439e1959CEa6262CBabC12320b384c4' },
      ];
      await harvestV2Keep3rJob.addStrategies(
        v2Strategies.map((v2Strategies) => v2Strategies.address),
        v2Strategies.map(
          (v2Strategies) => v2Strategies.harvestAmount || defaultHarvestAmount
        )
      );

      resolve();
    } catch (err) {
      reject(
        `Error while adding strategies on HarvestV2Keep3rJob contract: ${err.message}`
      );
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
