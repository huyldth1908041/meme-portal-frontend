import React from 'react';
import './style.scss';

const TopTokenItem = () => {
  const topTokenOwner = [
    { id: 1, name: 'Pui Pui', token: '1208' },
    { id: 2, name: 'Pui Pui', token: '1208' },
    { id: 3, name: 'Pui Pui', token: '1208' },
    { id: 4, name: 'Pui Pui', token: '1208' },
    { id: 5, name: 'Pui Pui', token: '1208' },
  ];
  return (
    <div className='token-owner-controller'>
      <div className='token-owner-header'>Top Token Holder</div>
      <>
        {topTokenOwner.length &&
          topTokenOwner.map((item) => (
            <div className='token-owner' key={item.id}>
              <div className='token-owner-left'>
                <div className='token-owner-position'>{item.id}</div>
                <div className='token-owner-logo'>
                  <img src={item.avatar || '/images/default-avatar.jpg'} alt='' />
                </div>
              </div>
              <div className='token-owner-detail'>
                <div className='token-owner-name'>{item.name}</div>
                <div className='token-owner-token'>{item.token}</div>
              </div>
            </div>
          ))}
      </>
      <button className='token-owner-all'>View All</button>
    </div>
  );
};

export default TopTokenItem;
