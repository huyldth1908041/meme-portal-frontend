import React from 'react';
import './style.scss';
import { MdModeEditOutline } from 'react-icons/md';
const Profile = ({ user }) => {
  return (
    <div className='profile-controller'>
      <div className='profile-header'>
        <div className='profile-avatar'>
          <img src={user?.avatar || '/images/default-avatar.jpg'} alt='' />
        </div>
        <div className='profile-name'>
          <div className='profile-fullname'>{user?.name || 'No name'}</div>
          <button className='btn btn-primary'>
            <MdModeEditOutline /> Edit Profile
          </button>
        </div>
        <div className='profile-activity'>
          <div className='profile-post'>{user?.post || 0} posts</div>
          <div className='profile-comment'>{user?.comment || 0} comments</div>
          <div className='profile-token'>{user?.token || 0} tokens</div>
        </div>
      </div>
      <div className='profile-content' />
    </div>
  );
};
export default Profile;
