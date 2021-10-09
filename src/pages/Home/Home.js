import React from 'react';
import Post from '../../components/Post';
import './style.scss'
const Home = () => {
  return (
    <div className="home-body">
      <div className='body-sideleft'></div>
      <div className='body'>
        <Post />
      </div>
      <div className='body-sideright'></div>
    </div>
  );
};

export default Home;
