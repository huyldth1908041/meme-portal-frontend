import React from 'react';
import { AiOutlineHome, AiOutlineHeart, AiOutlineCompass } from 'react-icons/ai';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../hooks';

function Header() {
  const { user, logout } = useAuthentication();

  return (
    <div className='header-content'>
      <div className='logo'>MEME PORTAL</div>
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
        {
          user && (
            <>
              <div className='account'>
                <img src={user.avatar || '/images/default-avatar.jpg'} height='100%' width='100%' alt='profile' />
              </div>
              <div>
                {user.fullName}
              </div>
              <div>
                <button onClick={logout}>Logout</button>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}

export default Header;
