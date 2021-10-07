import React from 'react';
import { AiOutlineHome, AiOutlineHeart, AiOutlineCompass } from 'react-icons/ai';
import './style.scss';

function Header() {
  return (
    <div className='header-content'>
      <div className='logo'>asbdjasd</div>
      <div className='search'>
        <input type='text' placeholder='Search' />
      </div>
      <div className='list-icon'>
        <a href='#'>
          <AiOutlineHome />
        </a>
        <a href='#'>
          <AiOutlineHeart />
        </a>
        <a href='#'>
          <AiOutlineCompass />
        </a>
        <div className='account'>
          <img src='/images/profile.jpeg' height='100%' width='100%' />
        </div>
      </div>
    </div>
  );
}
export default Header;
