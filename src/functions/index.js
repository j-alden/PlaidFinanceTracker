const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');
const plaid = require('plaid');
const keys = require('../keys/plaid-keys');

// Initialize Express
const app = express();
// Allow CORS. Might need to change for prod
app.use(cors());
const firestore = new Firestore();

// Plaid client
var plaidClient = new plaid.Client(
  keys.clientId,
  keys.secret,
  keys.publicKey,
  plaid.environments['development'],
  { version: '2019-05-29', clientApp: 'FinanceTracker' }
);

// https://us-central1-finance-tracker-259314.cloudfunctions.net/api
app.get('/', (req, res) => {
  res.send('This is the root!');
});

//
//  Routes from Plaid to Firebase
//

// Get recent plaid transactions and save to firebase
// Ideally this takes an account? and a date range based on last time run?
app.get('/plaid/save_transactions', async (req, res) => {
  // Create Plaid public token for an account
  let publicToken;
  plaidClient.createPublicToken(keys.chaseAccessToken, (err, res) => {
    if (err) {
      res.status(500).json({ error: err.toString() });
    }
    publicToken = res.public_token;
  });

  // Get Plaid transactions for the account with date range
  const { transactions } = await plaidClient.getTransactions(
    keys.chaseAccessToken,
    '2019-12-20',
    '2019-12-30'
  );

  // Format transactions I want to save/update
  const formattedTransactions = transactions.map(transaction => {
    return {
      accountId: transaction.account_id,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      currency: transaction.iso_currency_code,
      name: transaction.name,
      transactionId: transaction.transaction_id,
      pending: transaction.pending,
      pendingTransactionId: transaction.pending_transaction_id
    };
  });

  // Save or update transactions to firestore
  const transCollRef = firestore.collection('transactions');

  // Can't do async call in forEach because it's synchronous so it won't wait for promise to resolve. It was returning empty array
  for (let formattedTran of formattedTransactions) {
    let query = await transCollRef
      .where('transactionId', '==', formattedTran.transactionId)
      .get();

    // Save transaction to Firebase if it isn't there
    if (query.empty) {
      transCollRef.doc().create(formattedTran);
    }
    // Update the transaction if it's already there in case it changed
    else {
      query.forEach(async doc => {
        await transCollRef.doc(doc.id).update(formattedTran);
      });
    }
  }
  res.send(200);
});

// Get Transactions
app.get('/client/transactions', async (req, res) => {
  // Get collection reference
  const transactionsRef = firestore.collection('transactions');

  let transactionSnapshot;
  // Need to set GOOGLE_APPLICATION_CREDENTIALS env variable for this to work locally
  // $env:GOOGLE_APPLICATION_CREDENTIALS="<Path>"
  try {
    // Get collection snapshot
    transactionSnapshot = await transactionsRef.get();
  } catch (err) {
    //next(err); <--- Different error handling
    res.status(500).json({ error: err.toString() });
  }
  const transactions = transactionSnapshot.docs.map(doc => {
    return doc.data();
  });
  transactions.forEach(
    transaction => (transaction.date = transaction.date.toDate())
  );
  res.send(transactions);
});

app.get('/account', async (req, res) => {
  // Get account info (balance)
  const accountResponse = await plaidClient.getAccounts(keys.chaseAccessToken);
  res.send(accountResponse.accounts);
});

//
//  Routes from Firebase to Client
//

// Testing pubsub to save transactions
exports.getTransactionsPubSub = functions.pubsub
  .topic('plaid_transactions')
  .onPublish(async message => {
    // Create Plaid public token for an account
    let publicToken;
    plaidClient.createPublicToken(keys.chaseAccessToken, (err, res) => {
      if (err) {
        res.status(500).json({ error: err.toString() });
      }
      publicToken = res.public_token;
    });

    // Get Plaid transactions for the account with date range
    const { transactions } = await plaidClient.getTransactions(
      keys.chaseAccessToken,
      '2019-12-20',
      '2019-12-30'
    );

    // Format transactions I want to save/update
    const formattedTransactions = transactions.map(transaction => {
      return {
        accountId: transaction.account_id,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        currency: transaction.iso_currency_code,
        name: transaction.name,
        transactionId: transaction.transaction_id,
        pending: transaction.pending,
        pendingTransactionId: transaction.pending_transaction_id
      };
    });

    // Save or update transactions to firestore
    const transCollRef = firestore.collection('transactions');

    // Can't do async call in forEach because it's synchronous so it won't wait for promise to resolve. It was returning empty array
    for (let formattedTran of formattedTransactions) {
      let query = await transCollRef
        .where('transactionId', '==', formattedTran.transactionId)
        .get();

      // Save transaction to Firebase if it isn't there
      if (query.empty) {
        transCollRef.doc().create(formattedTran);
      }
      // Update the transaction if it's already there in case it changed
      else {
        query.forEach(async doc => {
          await transCollRef.doc(doc.id).update(formattedTran);
        });
      }
    }
  });

exports.testPubSub = (data, context) => {
  const pubSubMessage = data;
  const name = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString()
    : 'World';

  console.log(`Hello, ${name}!`);
};

// Create api to export as cloud function
const api = functions.https.onRequest(app);

module.exports = {
  api
};
