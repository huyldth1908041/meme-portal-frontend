import React from 'react';
import './style.scss';

const ActivityItem = ({ item }) => {
  return (
    <div className='activity-controller'>
      {item.map((activities) => (
        <div className='activity-content'>
          <div className='activity-date'>{activities.date}</div>
          {activities.data.map((activity) => (
            <div className='activity'>
              <div className='activity-left'>
                <div className='activity-avatar'>
                  <img alt='' src={activity.avatar || '/images/default-avatar.jpg'} />
                </div>
                <div className='activity-action'>
                  <div className='activity-action-name'>
                    <div className='activity-name'>{activity.name}</div>
                    {activity.action}
                  </div>
                  <div className='activity-description'>{activity.description}</div>
                </div>
              </div>
              <div className='activity-time'>{activity.time}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ActivityItem;
