import { Avatar, Space } from 'antd';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';

export const pushedListTableColumns = [
  {
    title: 'Name',
    key: 'fullName',
    render: (text, record) => (
      <Space size='middle'>
        <Link to={privateRoute.userProfile.url(record.pusher.id)} style={{ color: '#111' }}>
          <Avatar size={50} alt='avatar' src={record.pusher.avatar || '/images/default-avatar.jpg'}
                  style={{ marginRight: 10 }} />
          <b>{record.pusher.fullName}</b>
        </Link>
      </Space>
    ),
  },
  {
    title: 'Amount',
    key: 'amount',
    dataIndex: 'amount',
    render: amount => (
      <div style={{ textAlign: 'right' }}>{amount.toLocaleString()}</div>
    ),
  },

];