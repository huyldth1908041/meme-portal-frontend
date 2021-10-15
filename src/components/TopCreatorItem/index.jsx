import React from 'react';
import './style.scss';

const TopCreatorItem = ({ lisPerson }) => {
  return (
    <div className='creator-controller'>
      <div className='creator-header'>
        <div className='creator-top'>Top Creator</div>
        <button>See all</button>
      </div>
      {lisPerson.map((person) => (
        <div className='creator'>
          <div className='creator-logo'>
            <img src={person.avatar || '/images/default-avatar.jpg'} alt='' />
          </div>
          <div className='creator-detail'>
            <div className='creator-name'>
              <div className='creator-fullname'>{person.fullName}</div>
              <button className='follow'>Follow</button>
            </div>
            <div className='creator-follower'>Followed by {person.follower}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCreatorItem;
