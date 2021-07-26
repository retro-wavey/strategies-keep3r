import { e18 } from './web3-utils';

export const defaultRequiredHarvestAmount = e18.mul(10_000);

export const v2CrvStrategies = [
  {
    /* STABLECOINS */
    name: 'yUSD',
    wantSymbol: 'yDAI+yUSDC+yUSDT+yTUSD',
    added: true,
    address: '0x6d45c5a8C1cF1f77Ab89cAF8D44917730298bab7',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'y3CRV',
    wantSymbol: '3Crv',
    added: true,
    address: '0x9d7c11D1268C8FD831f1b92A304aCcb2aBEbfDe1',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'Compound',
    wantSymbol: 'cDAI+cUSDC',
    added: true,
    address: '0xdDAAc8B5Dd65d079b6572e43890BDD8d95bD5cc3',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  // { deprecated
  //   name: 'yBUSD',
  //   wantSymbol: 'yDAI+yUSDC+yUSDT+yBUSD',
  //   added: true,
  //   address: '0xB3E1a513a2fE74EcF397dF9C0E6BCe5B57A961C8',
  //   requiredHarvestAmount: e18.mul(10000),
  //   requiredEarn: { amount: 250_000, decimals: 18 },
  //   profitFactor: 1,
  // },
  // { // deprecated
  //   name: 'GUSD',
  //   wantSymbol: 'gusd3CRV',
  //   added: true,
  //   address: '0x9C1117cf2ED3A0F4A9F069001F517c1D511c8B53',
  //   requiredHarvestAmount: e18.mul(10000),
  //   requiredEarn: { amount: 250_000, decimals: 18 },
  //   profitFactor: 1,
  // },
  {
    name: 'DUSD',
    wantSymbol: 'dusd3CRV',
    added: true,
    address: '0x4C547b6202247E7B7c45A95d7747A85704530ab3',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'mUSD',
    wantSymbol: 'musd3CRV',
    added: true,
    address: '0xf9fF7f463A7e6f43d4E65c230D3743355fC954e4',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'UST',
    wantSymbol: 'ust3CRV',
    added: true,
    address: '0xbf811462955DEeD9aaD62EFE771E34e8B5811857',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'HUSD',
    wantSymbol: 'husd3CRV',
    added: true,
    address: '0x5ED527A2cfC5411EB63b12E46e270b07b6813824',
    requiredHarvestAmount: e18.mul(3000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'AAVE',
    wantSymbol: 'a3CRV',
    added: true,
    address: '0xB11FC91DF59ADc604485f1B25ABa1F96A685473f',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  // { // deprecated
  //   name: 'SAAVE',
  //   wantSymbol: 'saCRV',
  //   added: false,
  //   address: '0x106838c85Ab33F41567F7AbCfF787d7269E824AF',
  //   requiredHarvestAmount: e18.mul(10000),
  //   requiredEarn: { amount: 250_000, decimals: 18 },
  //   profitFactor: 1,
  // },
  // { // deprecated
  //   name: 'sUSD',
  //   wantSymbol: 'crvPlain3andSUSD',
  //   added: true,
  //   address: '0x9730F52AB5BcEc960bE41b0fE4913a09c0B57066',
  //   requiredHarvestAmount: e18.mul(10000),
  //   requiredEarn: { amount: 250_000, decimals: 18 },
  //   profitFactor: 1,
  // },
  {
    name: 'USDN',
    wantSymbol: 'usdn3CRV',
    added: true,
    address: '0x23a09D84e50fF3fDFa270308851443734b0a4b6D',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'USDP',
    wantSymbol: 'usdp3CRV',
    added: true,
    address: '0x94fA3A90E680f6b866545C904D1dc9DEe6416de9',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'LUSD',
    wantSymbol: 'LUSD3CRV-f',
    added: true,
    address: '0xE13C452b5F10686366C2183964341A01A24d9984',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'FRAX',
    wantSymbol: 'FRAX3CRV-f',
    added: true,
    address: '0x8423590CD0343c4E18d35aA780DF50a5751bebae',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'BUSD',
    wantSymbol: 'BUSD3CRV-f',
    added: true,
    address: '0xD670439D889f9Eb16497d8D6EA9a5E549ae5bFF5',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  // { // deprecated
  //   name: 'TUSD',
  //   wantSymbol: 'TUSD3CRV-f',
  //   added: true,
  //   address: '0xF088aC5ebf8423b894903312AaC8Ac42c3Ab3A02',
  //   requiredHarvestAmount: e18.mul(10000),
  //   requiredEarn: { amount: 250_000, decimals: 18 },
  //   profitFactor: 1,
  // },
  {
    name: 'ALUSD',
    wantSymbol: 'ALUSD3CRV-f',
    added: true,
    address: '0x31CD90D60516ED18750bA49b2C9d1053190F40d9',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  /* ETH */
  {
    name: 'ankrETH',
    wantSymbol: 'ankrCRV',
    added: true,
    address: '0x32EF165F2ABbdbE7dcC25B86EdB14a2C0dc52571',
    requiredHarvestAmount: e18.mul(3000),
    requiredEarn: { amount: 125, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'rETH',
    wantSymbol: 'rCRV',
    added: true,
    address: '0x16468a3999d931Dd6b6ffA0086Cf195D6C5BDAFA',
    requiredHarvestAmount: e18.mul(3000),
    requiredEarn: { amount: 125, decimals: 18 },
    profitFactor: 1,
  },
  /* MISC */
  {
    name: 'LINK',
    wantSymbol: 'linkCRV',
    added: true,
    address: '0x0E94D346D8A53FEF83484b178a581695E0001E55',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 12_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'EURS',
    wantSymbol: 'eursCRV',
    added: true,
    address: '0x53cE22d5b4F667eC73710d428E828Cd96E9a37C9',
    requiredHarvestAmount: e18.mul(10000),
    requiredEarn: { amount: 250_000, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'TRICRYPTO',
    wantSymbol: 'triCRV',
    added: true,
    address: '',
    requiredHarvestAmount: e18.mul(5000),
    requiredEarn: { amount: 250, decimals: 18 },
    profitFactor: 1,
  },
  /* BTC */
  // { // deprecated
  //   name: 'hbtc',
  //   wantSymbol: 'hCRV',
  //   added: true,
  //   address: '0xEeabc022EA72AFC585809214a43e1dDF3b34FBB6',
  //   requiredHarvestAmount: e18.mul(5000),
  //   requiredEarn: { amount: 10, decimals: 18 },
  //   profitFactor: 1,
  // },
  // { // deprecated
  //   name: 'sbtc',
  //   wantSymbol: 'crvRenWSBTC',
  //   added: true,
  //   address: '0x24345144c80BC994C12d85fb276bB4c5520579Ea',
  //   requiredHarvestAmount: e18.mul(5000),
  //   requiredEarn: { amount: 10, decimals: 18 },
  //   profitFactor: 1,
  // },
  {
    name: 'obtc',
    wantSymbol: 'oBTC/sbtcCRV',
    added: true,
    address: '0x126e4fDfa9DCEA94F8f4157EF8ad533140C60fC7',
    requiredHarvestAmount: e18.mul(5000),
    requiredEarn: { amount: 10, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'pbtc',
    wantSymbol: 'pBTC/sbtcCRV',
    added: true,
    address: '0xf726472B7BE7461001df396C55CAdB1870c78dAE',
    requiredHarvestAmount: e18.mul(5000),
    requiredEarn: { amount: 10, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'rbtc',
    wantSymbol: 'crvRenWBTC',
    added: true,
    address: '0x9eCC1abbA680C5cAACA37AD56E446ED741d86731',
    requiredHarvestAmount: e18.mul(5000),
    requiredEarn: { amount: 10, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'bbtc',
    wantSymbol: 'bBTC/sbtcCRV',
    added: true,
    address: '0xe9Fd1BEfdd412C8966689A64dE74a783AfA6AD57',
    requiredHarvestAmount: e18.mul(5000),
    requiredEarn: { amount: 10, decimals: 18 },
    profitFactor: 1,
  },
  {
    name: 'tbtc',
    wantSymbol: 'tbtc/sbtcCrv',
    added: true,
    address: '0x060E04305C07DdE40A9f57bB4fFAcd662D51Ab96',
    requiredHarvestAmount: e18.mul(5000),
    requiredEarn: { amount: 10, decimals: 18 },
    profitFactor: 1,
  },
  // unknown
  {
    name: 'unknown',
    wantSymbol: 'unknown',
    added: true,
    address: '0x57D2E2eD281650A5d987E6ef87BC1BeD4fD0E959',
    requiredHarvestAmount: e18.mul(10_000),
    requiredEarn: { amount: 80_000, decimals: 18 },
    profitFactor: 1,
  },
];
