import React from 'react';
import './style.scss';
import { MdModeEditOutline } from 'react-icons/md';
import { useAuthentication } from '../../hooks';
import { UserPosts } from './components';
import { Tabs, Box, Chip, Typography, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Skeleton } from 'antd';


const Profile = () => {
  const { user } = useAuthentication();
  const userId = user.id;
  const { data = {}, isLoading, error } = useQuery(['memeServices.userDetail', userId],
    ({ queryKey }) => memeServices.userDetail(queryKey[1]));
  const [counter, setCounter] = React.useState({});
  const { data: apiUser = {} } = data;
  const onUpdateVerifiedCounter = React.useCallback((num) => setCounter((cur) => ({ ...cur, verified: num })), []);
  const onUpdatePendingCounter = React.useCallback((num) => setCounter((cur) => ({ ...cur, pending: num })), []);
  const onUpdateHotCounter = React.useCallback((num) => setCounter((cur) => ({ ...cur, hot: num })), []);

  const paramsVerified = React.useMemo(() => ({ status: 1, creatorId: user.id }), [user]);
  const paramsPending = React.useMemo(() => ({ status: 0, creatorId: user.id }), [user]);
  const paramsHot = React.useMemo(() => ({ status: 2, creatorId: user.id }), [user]);

  const tabs = [
    {
      id: 1,
      code: 'verified',
      label: 'New Posts',
      component: <UserPosts params={paramsVerified} onUpdateCounter={onUpdateVerifiedCounter} />,
    },
    {
      id: 2,
      code: 'pending',
      label: 'Pending Posts',
      component: <UserPosts params={paramsPending} onUpdateCounter={onUpdatePendingCounter} />,
    },
    {
      id: 3,
      code: 'hot',
      label: 'Hot Posts',
      component: <UserPosts params={paramsHot} onUpdateCounter={onUpdateHotCounter} />,
    },
  ];
  const [activeTab, setActiveTab] = React.useState(tabs[0].code);
  const handleChangeTab = (_, nextTab) => {
    setActiveTab(nextTab);
  };
  return (
    <div className='profile-controller'>
      {
        isLoading ? (<Skeleton/>) : error ? (<p>Som error has occured</p>) : (
          <div className='profile-header'>
            <div className='profile-information'>
              <div className='profile-avatar'>
                <img src={apiUser?.avatar || '/images/default-avatar.jpg'} alt='' />
              </div>
              <div className='profile-name'>
                <div className='profile-fullname'>{apiUser?.fullName || 'No name'}</div>
                <Link to={privateRoute.profileUpdate.path} style={{ color: '#fff' }}>
                  <button className='btn btn-primary'>
                    <MdModeEditOutline /> Edit Profile
                  </button>
                </Link>
              </div>
            </div>
            <div className='profile-activity'>
              <div className='profile-post'>{0} posts</div>
              <div className='profile-comment'>{apiUser?.comment || 0} comments</div>
              <div className='profile-token'>{apiUser?.tokenBalance || 0} tokens</div>
            </div>
          </div>
        )
      }
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
