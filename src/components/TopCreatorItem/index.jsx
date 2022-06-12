import React from 'react';
import './style.scss';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Avatar, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';


const TopCreatorItem = ({ showHeader = true }) => {
  const { isLoading, data = {}, error } = useQuery(['memeServices.topCreator'], () => memeServices.topCreator());
  const { data: topCreators = [] } = data;
  return (
    <div className='creator-controller'>
      {
        showHeader && (
          <div className='creator-header'>
            <div className='creator-top'>Top Creator</div>
            {/*<button>See all</button>*/}
          </div>
        )
      }
      <>
        {
          isLoading && (<Skeleton />)

        }
        {
          error && <div>Some error has occurred</div>
        }
        {topCreators.length > 0 ? (topCreators.map((item) => (
          <div className='creator' key={item.user.id}>
            <div className='creator-logo'>
              <Link to={privateRoute.userProfile.url(item.user.id)}>
                <Avatar
                  src={(!item.user.avatar || item.user.avatar === 'null') ? '/images/default-avatar.jpg' : item.user.avatar}
                  alt='user-avatar' size={50} />
              </Link>
            </div>
            <div className='creator-detail'>
              <div className='creator-name'>
                <div className='creator-fullname'>
                  <Link to={privateRoute.userProfile.url(item.user.id)}>
                    {item.user.fullName}
                  </Link>
                </div>
              </div>
              <div className='creator-follower'>Posts created {item.postCounts}</div>
            </div>
          </div>
        ))) : (
          <div>No body on top yet</div>
        )}
      </>
    </div>
  );
};

export default TopCreatorItem;
