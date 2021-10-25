import React from 'react';
import ActivityItem from '../../components/ActivityItem';
import './style.scss';

const RecentActivities = () => {
  const item = [
    {
      date: 'October 24, 2021',
      data: [
        { name: 'John Smith', action: "commented on Mark's post", description: 'Let show more', time: '3:40 PM' },
        { name: 'John Smith', action: "commented on Mark's post", description: 'Let show more', time: '3:40 PM' },
      ],
    },
    {
      date: 'October 22, 2021',
      data: [{ name: 'John Smith', action: "commented on Mark's post", description: 'Let show more', time: '3:40 PM' }],
    },
  ];
  return (
    <div className='recentActivities-controller'>
      <div className='header'>Recently Activities</div>
      <ActivityItem item={item} />
    </div>
  );
};

export default RecentActivities;
