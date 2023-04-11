const fs = require('fs');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

const { PRIVATE_KEY, WS_URL } = process.env;

exports.claim = async (request, reply) => {
  await cryptoWaitReady();

  const address = request.body.address;
  const wsProvider = new WsProvider(WS_URL);
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri(PRIVATE_KEY);

  await new Promise(async (res, rej) => {
    console.log('Initializing account with funds', address);
    const { nonce } = await api.query.system.account(alice.address);

    await api.tx.sudo
      .sudo(
        api.tx.balances.setBalance(address, '100000000000000000000', '0')
      )
      .signAndSend(alice, { nonce }, ({ events = [], status }) => {
        if (status.isFinalized) {
          console.log('Account initialized', address)
          res(status);
        } else if (status.isInvalid || status.isDropped) {
          rej(status);
        }
      });
  });

  reply
    .code(200)
    .send();
}
