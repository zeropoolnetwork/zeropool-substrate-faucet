const fs = require('fs');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

const { PRIVATE_KEY, RPC_URL } = process.env;

exports.claim = async (fastify, request, reply) => {
  await cryptoWaitReady();
  const wsProvider = new WsProvider(RPC_URL);
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri(PRIVATE_KEY);

  await new Promise(async (res, rej) => {
    console.log('Initializing account with funds', address);
    const { nonce } = await api.query.system.account(alice.address);

    await api.tx.sudo
      .sudo(
        api.tx.balances.setBalance(address, '1000000000', '0')
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
}
