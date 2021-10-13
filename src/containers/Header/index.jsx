import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineHome, AiOutlineHeart, AiOutlineCompass, AiOutlineLogin, AiOutlineCloudUpload } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../hooks';
import { BiExit } from 'react-icons/all';

function Header() {
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
        <Link to={privateRoute.home.path}>MEME PORTAL</Link>
      </div>
      <div className='search'>
        <input type='text' placeholder='Search' />
      </div>
      <div className='list-icon'>
        <Link to={privateRoute.home.path}>
          <AiOutlineHome />
        </Link>
        <Link to={privateRoute.home.path}>
          <AiOutlineHeart />
        </Link>
        <Link to={privateRoute.home.path}>
          <AiOutlineCompass />
        </Link>
        {user ? (
          <div className='d-flex justify-content-center align-items-center'>
            <div ref={ref} className="header-content-container">
              <button onClick={toggleProfile}>
                <div className='account'>
                  <img src={user.avatar || '/images/default-avatar.jpg'} height='100%' width='100%' alt='profile' />
                </div>
                <div className='name'>{user.fullName}</div>
              </button>
              {openProfile && (
                <div className='dropdown-content'>
                  <Link to={privateRoute.home.path}>
                    <BsPersonCircle /> Profile
                  </Link>
                  <button onClick={() => logout()}>
                    <BiExit className='button-icon' />Logout
                  </button>
                </div>
              )}
            </div>
            <Link className='header-btn' to={privateRoute.create.path}>
              <AiOutlineCloudUpload className='button-icon' /> Create
            </Link>
          </div>
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
