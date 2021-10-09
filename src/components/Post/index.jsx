/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BsArrowUpCircle, BsShare } from 'react-icons/bs';
import axios from 'axios';
import './style.scss';

const Post = () => {
  const [content, setContent] = useState([]);
  const contentFixed = [
    {
      name: 'LinhCao',
      time: '2 minutes ago',
      title: 'This is title',
      description: 'This is description',
      logoUrl:
        'https://thosuaxe.info/wp-content/uploads/2021/03/M%E1%BB%99t-trong-nh%E1%BB%AFng-Memes-kinh-%C4%91i%E1%BB%83n-nh%E1%BA%A5t-tr%C3%AAn-internet.jpg',
      pngUrl: 'https://static2.yan.vn/YanNews/2167221/202003/meme-la-gi-meme-bat-nguon-tu-dau-28eba17b.png',
    },
  ];
  useEffect(() => {
    axios
      .post('/content', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        if (data.success) {
          setContent(data.content);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return (
    <div className='post-controller'>
      {contentFixed.map((post) => (
        <div className='post'>
          <div className='post-header'>
            <div className='post-logo'>
              <img src={post.logoUrl} />
            </div>
            <div className='post-name-time'>
              <div className='post-name'>{post.name}</div>
              <div className='post-time'>{post.time}</div>
            </div>
          </div>
          <div className='post-detail'>
            <div className='post-title'>{post.title}</div>&nbsp;-&nbsp;{post.description}
          </div>
          <div className='post-image'>
            <img src={post.pngUrl} />
          </div>
          <div className='post-emotion'>
            <div className='post-emotion-up'>
              <div className='post-emotion-like'>
                <AiOutlineLike />
                123
              </div>
              <div className='post-emotion-vote'>
                <BsArrowUpCircle />
                34
              </div>
            </div>
            <div className='post-emotion-share'>
              <BsShare />
              Share
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
