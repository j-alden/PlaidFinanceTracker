import React from 'react';
import PlaidLink from 'react-plaid-link';
// CSS
import './styles.css';

// For testing
import axios from 'axios';
import plaid from 'plaid';
import keys from '../../keys/plaid-keys';

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
var client = new plaid.Client(
  keys.clientId,
  keys.secret,
  keys.publicKey,
  plaid.environments['development'],
  { version: '2019-05-29', clientApp: 'FinanceTracker' }
);
console.log(client);

const LinkAccount = () => {
  const handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token);
    console.log(metadata);
  };
  const handleOnExit = () => {
    // handle the case when your user exits Link
  };

  const getAccount = async () => {
    const res = await axios.get('http://localhost:8080/account');
    console.log(res);
  };

  return (
    <div>
      <PlaidLink
        clientName='FinanceTracker'
        env='development'
        product={['auth', 'transactions']}
        publicKey={keys.publicKey}
        onExit={handleOnExit}
        onSuccess={handleOnSuccess}
        // token={'public-development-68f4c035-3d93-4e3a-ae31-27247d9bc373'}
      >
        Open Link and connect your bank!
      </PlaidLink>
      <button onClick={getAccount}>Get Account</button>
    </div>
  );
};

export default LinkAccount;
