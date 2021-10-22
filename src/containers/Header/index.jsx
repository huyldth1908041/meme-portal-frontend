import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineHome, AiOutlineLogin, AiOutlineCloudUpload } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../hooks';
import { BiExit, IoNotificationsOutline } from 'react-icons/all';
import { useSearchHandler } from '../../states/search';
import { Dropdown, Menu } from 'antd';
import styled from 'styled-components';
import NotificationItem from '../../components/NotificationItem';
import Fire from '../../services/fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const StyledMenu = styled(Menu)`
  width: 350px;
`;
const NotificationChip = styled.span`
  display: block;
  position: absolute;
  top: -7px;
  right: -9px;
  z-index: 10;
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  color: #fff;
`;

function Header() {
  const { onSendSearch } = useSearchHandler();
  const { user, logout } = useAuthentication();
  const [openProfile, setOpenProfile] = useState(false);
  const ref = useRef();
  const notificationRef = Fire.create.fireStore.collection(user.username);
  const query = notificationRef.orderBy('createdAt', 'desc').limit(5);
  const [notifications = []] = useCollectionData(query, { idField: 'id' });
  const activeNotifications = notifications.filter(notification => notification.status > 0);
  const handleNotificationClicked = async (item) => {
    await notificationRef.doc(item.id).update({ ...item, status: -1 });
  };
  const menu = (
    <StyledMenu>
      {
        notifications && notifications.length > 0 ? notifications.map(item => (
          <Menu.Item key={item.id} onClick={async () => await handleNotificationClicked(item)}>
            <NotificationItem item={item} />
          </Menu.Item>
        )) : (
          <Menu.Item key='no-notification'>
            <p>You dont have any notification yet</p>
          </Menu.Item>
        )
      }
    </StyledMenu>
  );

  const toggleProfile = () => {
    setOpenProfile(!openProfile);
  };
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (openProfile && ref.current && !ref.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [openProfile]);
  return (
    <div className='header-content'>
      <div className='logo'>
        <Link to={privateRoute.home.path}>MEME PORTAL</Link>
      </div>
      <div className='search'>
        <input type='text' placeholder='Search' onChange={(e) => onSendSearch(e.target.value)} />
      </div>
      <div className='list-icon'>
        <Link to={privateRoute.home.path}>
          <AiOutlineHome />
        </Link>
        {user ? (
          <>
            <Dropdown overlay={menu} trigger='click' placement='bottomCenter'>
              <button>
                <IoNotificationsOutline />
                {activeNotifications.length > 0 && <NotificationChip>{activeNotifications.length}</NotificationChip>}
              </button>
            </Dropdown>
            <div className='d-flex justify-content-center align-items-center'>
              <div ref={ref} className='header-content-container'>
                <button onClick={toggleProfile}>
                  <div className='account'>
                    <img src={user.avatar || '/images/default-avatar.jpg'} height='100%' width='100%' alt='profile' />
                  </div>
                  <div className='name'>{user.fullName}</div>
                </button>
                {openProfile && (
                  <div className='dropdown-content' onClick={() => setOpenProfile(false)}>
                    <Link to={privateRoute.profile.path}>
                      <BsPersonCircle /> Profile
                    </Link>
                    <button onClick={() => logout()}>
                      <BiExit className='button-icon' />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <Link className='header-btn' to={privateRoute.create.path}>
                <AiOutlineCloudUpload className='button-icon' /> Create
              </Link>
            </div>
          </>
        ) : (
          <div>
            <Link className='header-btn' to='/login'>
              <AiOutlineLogin className='button-icon' /> Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
