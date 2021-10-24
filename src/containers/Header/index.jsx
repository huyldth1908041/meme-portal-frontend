import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineHome, AiOutlineLogin, AiOutlineCloudUpload } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../hooks';
import { BiExit, BsListUl } from 'react-icons/all';
import { useSearchHandler } from '../../states/search';
import NotificationBar from '../../components/NotificationBar';


function Header() {
  const { onSendSearch } = useSearchHandler();
  const { user, logout } = useAuthentication();
  const [openProfile, setOpenProfile] = useState(false);
  const ref = useRef();


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
        <Link to={privateRoute.home.path}>HÀI CODE</Link>
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
            <NotificationBar />
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
                    <Link to={privateRoute.recentlyActivities.path}>
                      <BsListUl /> Recent Activity
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
