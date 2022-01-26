import React from 'react';
import './style.scss';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';

const TopTokenItem = ({ showHeader = true }) => {
  const {
    isLoading,
    data = {},
    error,
  } = useQuery(['memeServices.getTopTokenHolder'], () => memeServices.getTopTokenHolder());
  const { data: topTokenOwners = [] } = data;
  return (
    <div className='token-owner-controller'>
      {
        showHeader && (
          <div className='token-owner-header'>Top Token Holder</div>
        )
      }
      <>
        {
          isLoading ? (<Skeleton />) : error ? (<p>Some error has occurred</p>) : (
            topTokenOwners.length > 0 ? (topTokenOwners.map((item, id) => (
              <Link className='token-owner' key={item.user.id} to={privateRoute.userProfile.url(item.user.id)}>
                <div className='token-owner-left'>
                  <div className='token-owner-position'>{id + 1}</div>
                  <div className='token-owner-logo'>
                    <img src={item.user.avatar || '/images/default-avatar.jpg'} alt='avatar' />
                  </div>
                </div>
                <div className='token-owner-detail'>
                  <div className='token-owner-name'>{item.user.fullName}</div>
                  <div className='token-owner-token'>{item.tokenBalance.toLocaleString()}</div>
                </div>
              </Link>
            ))) : (
              <div>No body on top yet</div>
            )
          )
        }
      </>
      {/*<button className='token-owner-all'>View All</button>*/}
    </div>
  );
};

export default TopTokenItem;
