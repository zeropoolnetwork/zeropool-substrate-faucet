import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider(window.WS_URL);
const api = new ApiPromise({ provider: wsProvider });

async function getBalance(address) {
  await api.isReady;
  const { data: balance } = await api.query.system.account(address);
  return balance.free.toString();
}

const balanceElement = document.getElementById('balance');
const balanceBlock = document.getElementById('balance-block');

async function displayBalance(address) {
  const balance = await getBalance(address);
  balanceElement.innerText = balance;
  balanceBlock.classList.remove('hidden');
}

function hideBalanceBlock() {
  balanceBlock.classList.add('hidden');
}

// Display balance on input change
const addressInput = document.getElementById('address');
addressInput.addEventListener('input', function (ev) {
  const address = ev.target.value;

  displayBalance(address)
    .catch(err => hideBalanceBlock());
});

// Submit form
const form = document.getElementById('claim-form');
const submit = document.getElementById('submit');
form.addEventListener('submit', (e) => {
  submit.setAttribute('aria-busy', 'true');
  submit.value = '';

  fetch(form.action, {
    method: form.method,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  }).then(() => {
    displayBalance(addressInput.value);
  }).finally(() => {
    submit.removeAttribute('aria-busy');
    submit.value = 'Claim';
  });

  e.preventDefault();
});
