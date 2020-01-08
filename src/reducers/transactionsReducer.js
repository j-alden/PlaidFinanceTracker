import { GET_TRANSACTIONS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return action.payload;
    default:
      return state;
  }
}
