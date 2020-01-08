import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../actions';
import moment from 'moment';

// Ant Design
import { Timeline, Typography } from 'antd';

const TransactionList = () => {
  const transactions = useSelector(state => state.transactions);
  const dispatch = useDispatch();
  const { Title } = Typography;
  // Fetch transactions from api
  useEffect(() => {
    dispatch(actions.getTransactions());
  }, []);

  const renderTransactions = transArray => {
    return (
      transArray
        .map(trans => (
          <Timeline.Item
            key={trans.transaction_id}
            color={trans.type === 'spending' ? '#d33c2d' : '#16a336'}
          >
            {`$${trans.amount} | ${trans.name} | ${moment(trans.date).format(
              'MMM Do'
            )}`}
          </Timeline.Item>
        ))
        // Sort by date descending (this may not be work)
        .sort((a, b) => (a.datetime < b.datetime ? -1 : 1))
    );
  };
  console.log(transactions);
  return (
    <div className='rainbow-m-around_large'>
      <Title level={2}>Recent Transactions</Title>
      <Timeline>{renderTransactions(transactions)}</Timeline>
    </div>
  );
};

export default TransactionList;
