import React, { useEffect } from 'react';
import './style.scss';
import { MdModeEditOutline } from 'react-icons/md';
import { useAuthentication } from '../../hooks';
import { UserPosts } from './components';
import { Tabs, Box, Chip, Typography, Tab } from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import { privateRoute } from '../../routes';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Skeleton } from 'antd';
import ModalTransferToken from '../../components/ModalTransferToken';

const Profile = () => {
  const { user } = useAuthentication();
  const [displayModal, setDisplayModal] = React.useState(false);
  let userId = user.id;
  const { id } = useParams();
  let isOtherProfile = false;
  if (id && +userId !== +id) {
    userId = id;
    isOtherProfile = true;
  }
  const {
    data = {},
    isLoading,
    error,
  } = useQuery(['memeServices.userDetail', userId],
    ({ queryKey }) => memeServices.userDetail(queryKey[1]));
  const [counter, setCounter] = React.useState({});
  const { data: apiUser = {} } = data;
  const onUpdateVerifiedCounter = React.useCallback((num) => setCounter((cur) => ({ ...cur, verified: num })), []);
  const onUpdatePendingCounter = React.useCallback((num) => setCounter((cur) => ({ ...cur, pending: num })), []);
  const onUpdateHotCounter = React.useCallback((num) => setCounter((cur) => ({ ...cur, hot: num })), []);

  const paramsVerified = React.useMemo(() => ({ status: 1, creatorId: userId }), [userId]);
  const paramsPending = React.useMemo(() => ({ status: 0, creatorId: userId }), [userId]);
  const paramsHot = React.useMemo(() => ({ status: 2, creatorId: userId }), [userId]);
  const {
    data: commentCountData = {},
    isLoading: isLoadingCommentCount,
    error: commentCountError,
  } = useQuery(['memeServices.getCommentCount', userId],
    ({ queryKey }) => memeServices.getCommentCount(queryKey[1]));
  const { data: commentCount = 0 } = commentCountData;

  const {
    data: postCountData = {},
    isLoading: isLoadingPostCount,
    error: postCountError,
  } = useQuery(['memeServices.getPostCount', userId],
    ({ queryKey }) => memeServices.getPostCount(queryKey[1]));
  const { data: postCount = 0 } = postCountData;
  const tabs = [
    {
      id: 1,
      code: 'verified',
      label: 'New Posts',
      component: <UserPosts params={paramsVerified} onUpdateCounter={onUpdateVerifiedCounter} />,
    },

    {
      id: 3,
      code: 'hot',
      label: 'Hot Posts',
      component: <UserPosts params={paramsHot} onUpdateCounter={onUpdateHotCounter} />,
    },
  ];
  if (!isOtherProfile) {
    tabs.push({
      id: 2,
      code: 'pending',
      label: 'Pending Posts',
      component: <UserPosts params={paramsPending} onUpdateCounter={onUpdatePendingCounter} />,
    });
  }
  const [activeTab, setActiveTab] = React.useState(tabs[0].code);
  const handleChangeTab = (_, nextTab) => {
    setActiveTab(nextTab);
  };
  const sendToken = (e) => {
    setDisplayModal(true);
  };
  const handleOk = () => {
    setDisplayModal(false);
  };

  const handleCancel = () => {
    setDisplayModal(false);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);
  return (
    <div className='profile-controller'>
      <div className='modal-token'>
        <ModalTransferToken
          visible={displayModal}
          receiver={apiUser}
          handleCancel={handleCancel}
          handleOk={handleOk}
          senderId={user.id} />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <p>Som error has occured</p>
      ) : (
        <div className='profile-header'>
          <div className='profile-information'>
            <div className='profile-avatar'>
              <img src={apiUser?.avatar || '/images/default-avatar.jpg'} alt='' />
            </div>
            <div className='profile-name'>
              <div className='profile-fullname'>{apiUser?.fullName || 'No name'}</div>
              {!isOtherProfile ? (
                <Link to={privateRoute.profileUpdate.path} style={{ color: '#fff' }}>
                  <button className='btn btn-primary'>
                    <MdModeEditOutline /> Edit Profile
                  </button>
                </Link>
              ) : (
                <button className='btn btn-primary' onClick={sendToken}>
                  Send token
                </button>
              )}
            </div>
          </div>
          <div className='profile-activity'>
            <div className='profile-post'>
              {
                isLoadingPostCount ? (<Skeleton />) : postCountError ? (<p>Some error has occurred</p>) : (
                  <span>{postCount} posts</span>
                )
              }
            </div>
            <div className='profile-comment'>
              {
                isLoadingCommentCount ? (<Skeleton />) : commentCountError ? (<p>Some error has occurred</p>) : (
                  <span>{commentCount} comments</span>
                )
              }
            </div>
            <div className='profile-token'>{apiUser?.tokenBalance.toLocaleString() || 0} tokens</div>
          </div>
        </div>
      )}
      <div className='profile-content'>
        <div className='content-header'>Posts Created</div>

        <Box mt={6}>
          <Tabs value={activeTab} onChange={handleChangeTab}>
            {tabs.map((tab) => {
              const selected = tab.code === activeTab;
              return (
                <Tab
                  key={tab.id}
                  value={tab.code}
                  style={{ minWidth: 120 }}
                  label={
                    <Box className='flex-row align-items-end'>
                      <span className='mr-8'>{tab.label}</span>
                      <Chip
                        size='small'
                        variant='outlined'
                        style={{
                          borderRadius: 4,
                          backgroundColor: selected ? '#F5A962' : undefined,
                          marginLeft: 10,
                        }}
                        label={<Typography variant='body2'>{counter[tab.code] ?? 0}</Typography>}
                      />
                    </Box>
                  }
                />
              );
            })}
          </Tabs>
          {tabs.map((tab) => (
            <Box key={tab.id} hidden={tab.code !== activeTab} py={2}>
              {tab.component}
            </Box>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default Profile;
