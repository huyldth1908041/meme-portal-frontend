import React from 'react';
import './style.scss';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Skeleton } from 'antd';


const TopCreatorItem = () => {
  const { isLoading, data = {} } = useQuery([memeServices.topCreator], () => memeServices.topCreator());
  const { data: topCreators = [] } = data;
  return (
    <div className='creator-controller'>
      <div className='creator-header'>
        <div className='creator-top'>Top Creator</div>
        {/*<button>See all</button>*/}
      </div>
      <>
        {
          isLoading && (<Skeleton />)

        }
        {topCreators.length && topCreators.map((item) => (
          <div className='creator' key={item.user.id}>
            <div className='creator-logo'>
              <img src={item.user.avatar || '/images/default-avatar.jpg'} alt='' />
            </div>
            <div className='creator-detail'>
              <div className='creator-name'>
                <div className='creator-fullname'>{item.user.fullName}</div>
                <button className='follow'>Follow</button>
              </div>
              <div className='creator-follower'>Posts created {item.postCounts}</div>
            </div>
          </div>
        ))}
      </>
    </div>
  );
};

export default TopCreatorItem;
