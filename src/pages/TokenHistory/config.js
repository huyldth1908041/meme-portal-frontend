import moment from 'moment';

export const tokenHistoryColumns = [
  {
    title: 'Type',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Reason',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: amount => (
      <p style={{ textAlign: 'right' }}>{amount}</p>
    ),
  },
  {
    title: 'Create time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: createdAt => (
      <p>{moment(createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').format('DD-MM-YYYY HH:mm')}</p>
    ),
  },
];