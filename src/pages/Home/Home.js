import React from 'react';
import PostItem from '../../components/PostItem';
import './style.scss';

const contentFixed = [
  {
    id: 1,
    creator: {
      name: 'Linh Cao',
      avatar: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
    },
    time: '2 minutes ago',
    title: 'This is title',
    description: 'This is description',
    image:
      'https://thosuaxe.info/wp-content/uploads/2021/03/M%E1%BB%99t-trong-nh%E1%BB%AFng-Memes-kinh-%C4%91i%E1%BB%83n-nh%E1%BA%A5t-tr%C3%AAn-internet.jpg',
    likesCount: 0,
  },
  {
    id: 2,
    creator: {
      name: 'Linh Cao',
      avatar: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
    },
    time: '2 minutes ago',
    title: 'This is title',
    description: 'This is description',
    image:
      'https://thosuaxe.info/wp-content/uploads/2021/03/M%E1%BB%99t-trong-nh%E1%BB%AFng-Memes-kinh-%C4%91i%E1%BB%83n-nh%E1%BA%A5t-tr%C3%AAn-internet.jpg',
    likesCount: 0,
  },
];

const Home = () => {

  return (
    <div className='home-body'>
      <div className='body-sideleft' />
      <div className='body'>
        {contentFixed.map(item => {
          return <PostItem item={item} key={item.id} />;
        })}
      </div>
      <div className='body-sideright' />
    </div>
  );
};

export default Home;
