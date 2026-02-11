const TonWeb = require('tonweb');
const crypto = require('crypto');

// HTTP-провайдер для testnet
const tonweb = new TonWeb(
  new TonWeb.HttpProvider(
    'https://testnet.toncenter.com/api/v2/jsonRPC'
  )
);

async function generateWallet() {
  // 32 случайных байта для seed
  const seed = crypto.randomBytes(32);

  // Генерация ключей
  const keyPair =
    TonWeb.utils.keyPairFromSeed(seed);

  const publicKeyHex = TonWeb.utils.bytesToHex(
    keyPair.publicKey
  );
  const secretKeyHex = TonWeb.utils.bytesToHex(
    keyPair.secretKey
  );

  console.log('=== TON Testnet Wallet ===');
  console.log('Public Key :', publicKeyHex);
  console.log('Secret Key :', secretKeyHex);

  // Генерация raw-адреса через Wallet v2R1
  const WalletClass = tonweb.wallet.all['v3R2'];
  const wallet = new WalletClass(
    tonweb.provider,
    keyPair
  );

  const rawAddress = await wallet.getAddress();
  wallet
    .getAddress()
    .then((addr) =>
      console.log(
        'Raw address:',
        addr.toString(true, true, true)
      )
    );

  console.log(
    'Raw Address:',
    rawAddress.toString(true, true, true)
  );
}

generateWallet();
