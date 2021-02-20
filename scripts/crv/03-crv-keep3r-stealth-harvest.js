const { Confirm, NumberPrompt, Select, Toggle } = require('enquirer');
const hre = require('hardhat');
const ethers = hre.ethers;
const config = require('../../.config.json');
const { gwei, e18 } = require('../../utils/web3-utils');
const taichi = require('../../utils/taichi');

const selectStrategyPrompt = new Select({
  name: 'strategy',
  message: 'Select a crv strategy to stealth harvest',
  choices: ['ycrv', 'busd', 'sbtc', 'pool3', 'comp', 'gusd3crv', 'musd'],
});
const customGasPrompt = new Toggle({
  message: 'Send custom gasPrice?',
  enabled: 'Yes',
  disabled: 'No',
});
const gasPricePrompt = new NumberPrompt({
  name: 'number',
  message: 'type a custom gasPrice in gwei',
});
const customNoncePrompt = new Toggle({
  message: 'Send custom nonce?',
  enabled: 'Yes',
  disabled: 'No',
});
const sendTxPrompt = new Confirm({ message: 'Send tx?' });

async function main() {
  await hre.run('compile');
  await run();
}

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const [owner] = await ethers.getSigners();
      const provider = ethers.getDefaultProvider();
      const signer = new ethers.Wallet(
        '0x' + config.accounts.mainnet.privateKey
      ).connect(provider);

      // Setup crv strategy keep3r
      const crvStrategyKeep3r = await ethers.getContractAt(
        'CrvStrategyKeep3r',
        config.contracts.mainnet.crvStrategyKeep3r.address,
        signer
      );

      const strategy = await selectStrategyPrompt.run();
      if (!strategy) reject('no strategy');
      console.log('using strategy:', strategy);

      // Setup crv strategy
      const strategyContract = await ethers.getContractAt(
        'StrategyCurveYVoterProxy',
        config.contracts.mainnet[strategy].address,
        signer
      );

      // console.time('current strategist')
      const strategist = await strategyContract.strategist();
      console.log(
        `${strategy}.strategist()`,
        strategist == crvStrategyKeep3r.address
          ? 'crvStrategyKeep3r'
          : strategist
      );
      // console.timeEnd('current strategist')

      console.log(`calculating harvest for: ${strategy}. please wait ...`);
      // console.time('calculateHarvest')
      console.log(
        `calculateHarvest(${strategy})`,
        (
          await crvStrategyKeep3r.callStatic.calculateHarvest(
            strategyContract.address
          )
        )
          .div(e18)
          .toString()
      );
      // console.timeEnd('calculateHarvest')

      let gasPrice;
      if (await customGasPrompt.run()) {
        gasPrice = await gasPricePrompt.run();
        console.log('using custom gasPrice in gwei:', gasPrice);
        gasPrice = gwei.mul(gasPrice);
      } else {
        const gasResponse = await taichi.getGasPrice();
        gasPrice = ethers.BigNumber.from(gasResponse.data.fast);
        console.log('gasPrice in gwei:', gasPrice.div(gwei).toNumber());
      }

      const maxGwei = 200;
      if (gasPrice.gt(gwei.mul(maxGwei))) {
        reject(`gas price > ${maxGwei}gwei`);
      }

      let nonce = ethers.BigNumber.from(await signer.getTransactionCount());
      if (await customNoncePrompt.run()) {
        const noncePrompt = new NumberPrompt({
          name: 'number',
          message: `type a custom nonce, current is ${nonce}`,
        });
        nonce = await noncePrompt.run();
        console.log('using custom nonce:', nonce);
      } else {
        console.log('using account nonce:', nonce.toNumber());
      }

      const rawMessage = await crvStrategyKeep3r.populateTransaction.forceHarvest(
        strategyContract.address,
        {
          gasPrice,
          nonce,
        }
      );

      const signedMessage = await signer.signTransaction(rawMessage);

      // TODO prompt and Send tx on forknet and see if it rejects

      if ((await sendTxPrompt.run()) == false) {
        console.log('not sending tx, bye :)');
        resolve();
      }

      const res = await taichi.sendPrivateTransaction(signedMessage);
      const privateTxHash = res.result;

      console.log({ privateTxHash });

      if (!privateTxHash) {
        reject('no privateTxHash from taichi');
      }
      let received;
      while (!received) {
        const query = await taichi.queryPrivateTransaction(privateTxHash);
        received = query.success && query.obj.status == 'pending';
        // TODO Wait a few seconds
      }

      resolve();
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
