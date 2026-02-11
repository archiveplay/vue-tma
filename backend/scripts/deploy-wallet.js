// scripts/deploy-wallet.js
const TonWeb = require('tonweb');
require('dotenv').config();

const RPC =
  process.env.TON_RPC ||
  'https://testnet.toncenter.com/api/v2/jsonRPC';

async function sleep(ms) {
  return new Promise((res) =>
    setTimeout(res, ms)
  );
}

async function main() {
  const tonweb = new TonWeb(
    new TonWeb.HttpProvider(RPC)
  );

  const publicKeyHex =
    process.env.APP_WALLET_PUBLIC;
  const secretKeyHex =
    process.env.APP_WALLET_SECRET;

  if (!publicKeyHex || !secretKeyHex) {
    console.error(
      'Please set APP_WALLET_PUBLIC and APP_WALLET_SECRET in .env'
    );
    process.exit(1);
  }

  // hex -> bytes
  const publicKey =
    TonWeb.utils.hexToBytes(publicKeyHex);
  const secretKey =
    TonWeb.utils.hexToBytes(secretKeyHex);

  // Найдём доступный класс кошелька в зависимости от версии TonWeb
  let WalletClass = null;
  if (tonweb.wallet && tonweb.wallet.all) {
    // старые/совместимые сборки
    WalletClass =
      tonweb.wallet.all['v3R2'] ||
      tonweb.wallet.all['v2R1'] ||
      tonweb.wallet.all['v3'];
  } else if (
    TonWeb.Wallets &&
    TonWeb.Wallets.all
  ) {
    WalletClass =
      TonWeb.Wallets.all['v3R2'] ||
      TonWeb.Wallets.all['v2R1'] ||
      TonWeb.Wallets.all['v3'];
  } else if (
    TonWeb.wallet &&
    TonWeb.wallet.WalletV3R2
  ) {
    WalletClass = TonWeb.wallet.WalletV3R2;
  }

  if (!WalletClass) {
    console.error(
      'Не удалось найти подходящий Wallet класс в TonWeb. Проверь версию tonweb.'
    );
    process.exit(2);
  }

  // Создаём инстанс кошелька (конструктор у некоторых версий принимает (provider, { publicKey }))
  let wallet;
  try {
    wallet = new WalletClass(tonweb.provider, {
      publicKey,
    });
  } catch (e) {
    // в некоторых версиях create() используется
    if (
      typeof WalletClass.create === 'function'
    ) {
      wallet = await WalletClass.create(
        tonweb.provider,
        { publicKey }
      );
    } else {
      console.error(
        'Не удалось создать экземпляр WalletClass:',
        e
      );
      process.exit(3);
    }
  }

  const addr = await wallet.getAddress();
  console.log(
    'Wallet address:',
    addr.toString(true, true, true)
  );

  const seqno = await wallet.methods
    .seqno()
    .call();
  console.log('Current seqno:', seqno);

  if (seqno === null) {
    console.log(
      'Wallet not deployed — отправляем deploy транзакцию...'
    );
    try {
      // deploy принимает секретный ключ (bytes)
      const deploy = wallet.deploy(secretKey);
      const sendResult = await deploy.send();
      console.log(
        'Deploy message sent, result:',
        sendResult
      );

      // Poll seqno пока не станет >= 0 или пока не истечёт таймаут
      const timeoutMs = 120000; // максимум 2 минуты ожидания
      const intervalMs = 4000;
      let waited = 0;
      while (waited < timeoutMs) {
        await sleep(intervalMs);
        waited += intervalMs;
        const newSeq = await wallet.methods
          .seqno()
          .call();
        console.log('Checking seqno...', newSeq);
        if (newSeq !== null) {
          console.log(
            'Wallet deployed! seqno =',
            newSeq
          );
          return;
        }
      }
      console.warn(
        'Deploy отправлен, но seqno не появился в течение 2 минут. Проверь баланс и explorer.'
      );
    } catch (err) {
      console.error(
        'Ошибка при отправке deploy:',
        err
      );
      process.exit(4);
    }
  } else {
    console.log(
      'Wallet уже задеплоен (seqno != null).'
    );
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(99);
});
