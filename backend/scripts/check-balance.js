const TonWeb = require('tonweb');
const tonweb = new TonWeb(
  new TonWeb.HttpProvider(
    'https://testnet.toncenter.com/api/v2/jsonRPC'
  )
);

// Friendly или raw адрес
const walletAddress =
  'EQA7Wq-fMe505nTGMpHjnr_qJlfTyb341tP89MQX47OjR_IJ';

async function checkBalance() {
  const balanceNano =
    await tonweb.provider.getBalance(
      walletAddress
    );
  console.log(
    'Balance (nanoTON):',
    balanceNano.toString()
  );
  console.log(
    'Balance (TON):',
    TonWeb.utils.fromNano(balanceNano)
  );
}

checkBalance();
