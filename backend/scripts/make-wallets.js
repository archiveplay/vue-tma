require('dotenv').config();
const {
  TonClient,
  WalletContractV3R2,
} = require('ton');
const {
  mnemonicNew,
  mnemonicToPrivateKey,
} = require('ton-crypto');

async function makeTonWallet() {
  const mnemonic = await mnemonicNew();
  const { secretKey, publicKey } =
    await mnemonicToPrivateKey(mnemonic);

  console.log('publicKey', publicKey);

  const wallet = WalletContractV3R2.create({
    publicKey,
    workchain: 0,
  });

  return {
    mnemonic,
    secretKey,
    publicKey,
    wallet,
    address: wallet.address.toString(),
  };
}

/**
 * Попытка получить адрес jetton-wallet у minter'а через разные геттеры.
 * Внимание: сигнатуры геттеров у разных minter'ов могут отличаться.
 * Здесь делаем best-effort: пробуем несколько имен методов.
 *
 * client: TonClient из 'ton'
 * minterAddress: строка адреса minter контракта
 * ownerAddress: Address-like или строка адреса владельца (тот, для которого нужен jetton wallet)
 */
async function tryGetJettonWalletAddress(
  client,
  minterAddress,
  ownerAddress
) {
  const candidateGetters = [
    'get_wallet_address', // распространённое имя
    'getWalletAddress',
    'get_wallet',
    'get_wallet_by_owner',
  ];

  for (const m of candidateGetters) {
    try {
      // callGetMethod — best-effort: интерфейс может быть client.callGetMethod(address, method, stack)
      // У разных версий библиотеки сигнатуры отличаются; поэтому пробуем две формы.
      // Если у тебя другая версия — подправь вызов под свою.
      if (
        typeof client.callGetMethod === 'function'
      ) {
        // Многие геттеры ожидают 1 аргумент - owner address как standard cell/stack item.
        // Здесь мы передаём ownerAddress как тип "addr" — иногда это работает прямо.
        const res = await client.callGetMethod(
          minterAddress,
          m,
          [{ type: 'addr', value: ownerAddress }]
        );
        // Если ответ получилось распарсить — попробуем извлечь строку-адрес.
        if (res && res.stack) {
          // попытка найти строковое представление в стеке
          const s = res.stack.find(
            (item) =>
              item.type === 'cell' ||
              item.type === 'addr' ||
              item.type === 'slice' ||
              item.type === 'tvm.Address'
          );
          // Иногда библиотека возвращает в другом месте — просто логируем весь результат
          if (res.stack.length > 0) {
            return { method: m, raw: res };
          }
        }
      } else if (
        typeof client.runGetMethod === 'function'
      ) {
        const res = await client.runGetMethod(
          minterAddress,
          m,
          [{ type: 'addr', value: ownerAddress }]
        );
        if (
          res &&
          res.stack &&
          res.stack.length > 0
        ) {
          return { method: m, raw: res };
        }
      }
    } catch (err) {
      // молча пробуем следующий getter
    }
  }

  // Ничего не нашли:
  return null;
}

(async () => {
  const MINTER_ADDRESS =
    process.env.JETTON_MINTER ||
    'PUT_YOUR_TESTNET_MINTER_ADDRESS_HERE';
  if (
    !MINTER_ADDRESS ||
    MINTER_ADDRESS.includes('PUT_YOUR')
  ) {
    console.error(
      '⚠️ Укажи адрес minter через переменную окружения JETTON_MINTER или прямо в файле.'
    );
    process.exit(1);
  }

  // Клиент для testnet
  const client = new TonClient({
    endpoint:
      'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  console.log(
    'Generating TON wallet (V3R2) on testnet...'
  );
  const created = await makeTonWallet();

  console.log('\n=== WALLET INFO ===');
  console.log(
    'Mnemonic (save it safely):\n',
    created.mnemonic.join(' ')
  );
  console.log(
    'TON wallet address (fund to deploy):',
    created.address
  );
  console.log('---');

  console.log(
    '\nTrying to discover JettonWallet address via on-chain getters (best-effort)...'
  );
  const tryRes = await tryGetJettonWalletAddress(
    client,
    MINTER_ADDRESS,
    created.address
  );

  if (tryRes) {
    console.log(
      'Possible getter found:',
      tryRes.method
    );
    console.log(
      'Raw getter response (inspect it to extract address):',
      JSON.stringify(tryRes.raw, null, 2)
    );
    console.log(
      '\nNOTE: Extracting exact address text from raw response depends on the minter implementation. ' +
        'Если ты пришлёшь сюда этот raw-ответ, я помогу извлечь адрес.'
    );
  } else {
    console.log(
      "Не удалось автоматически получить jetton-wallet адрес у minter'a."
    );
    console.log('Варианты действий:');
    console.log(
      ' 1) Попросить владельца/автора minter-а выполнить первый перевод токенов на',
      created.address
    );
    console.log(
      ' 2) Если у тебя есть доступ к minter-коду — посмотреть, есть ли геттер (get_wallet_address) и каков его формат.'
    );
    console.log(
      ' 3) Использовать TonWeb / другой SDK, который может иметь готовые утилиты для Jetton (я могу помочь с примером).'
    );
  }

  console.log('\n=== ADDRESSES TO FUND ===');
  console.log(
    '- Fund this TON wallet with testnet TON to deploy / pay fees:'
  );
  console.log('   ', created.address);
  console.log(
    '- If minter supports on-chain auto-deploy, send first token transfer from minter to this jetton-wallet address (если он известен).'
  );
  console.log('\nЕсли хочешь — могу:');
  console.log(
    ' A) Подготовить пример, который с помощью TonWeb (npm package "tonweb") делает то же самое (он часто имеет jetton-утилиты).'
  );
  console.log(
    ' B) Поддержать твою конкретную minter-реализацию: пришли адрес minter и я попытаюсь точнее распарсить ответ и вернуть точный jetton-wallet адрес.'
  );
})();
