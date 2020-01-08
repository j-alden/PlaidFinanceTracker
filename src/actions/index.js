import axios from 'axios';
// Action Types
import { GET_TRANSACTIONS } from './types';

// Run against local server if development
// Not sure what gcloud NODE_ENV is
let gcloudApiUrl;
if (process.env.NODE_ENV === 'development') {
  gcloudApiUrl = 'http://localhost:8080';
} else {
  gcloudApiUrl =
    'https://us-central1-finance-tracker-259314.cloudfunctions.net/api';
}

// Get all transactions
export const getTransactions = () => async dispatch => {
  // Call cloud function
  const res = await axios.get(`${gcloudApiUrl}/transactions`);
  dispatch({ type: GET_TRANSACTIONS, payload: res.data });
};

// Get all account info (names, titles)
export const getAccounts = () => async dispatch => {};
