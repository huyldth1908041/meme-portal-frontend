import React from 'react';
import PostItem from '../../components/PostItem';
import './style.scss'
const Home = () => {
  return (
    <div className="home-body">
      <div className='body-sideleft'></div>
      <div className='body'>
        <PostItem />
      </div>
      <div className='body-sideright'></div>
    </div>
  );
};

export default Home;
