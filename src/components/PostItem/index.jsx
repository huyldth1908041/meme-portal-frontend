/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';
import './style.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';
import { AiFillLike, BiComment } from 'react-icons/all';
import memeServices from '../../services/memeServices';
import { useAuthentication } from '../../hooks';
import { toast } from 'react-hot-toast';

const PostItem = ({ item, isPreview }) => {
  const { user } = useAuthentication();
  const [likeCount, setLikeCount] = useState(item.likeCounts);
  const [hasLikedYet, setHasLikedYet] = useState(false);

  const fetchLikeCount = useCallback(async () => {
    if (isPreview) {
      return;
    }
    try {
      const data = await memeServices.getLikeCount(item.id);
      setLikeCount(data.data.likeCount);
      setHasLikedYet(data.data.hasLikedYet);
    } catch (err) {
      setLikeCount(0);
      setHasLikedYet(false);
    }
  }, [item, isPreview]);

  const handleLikePost = async () => {
    if (!user) {
      toast.error('Please login to like post');
      return;
    }
    const likePostPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await memeServices.likeAPost({ postId: item.id });
        setHasLikedYet(res.data.hasLikedYet);
        setLikeCount(res.data.likeCount);
        resolve();
      } catch (err) {
        if (err.statusCode === 400) {
          await fetchLikeCount();
        }
        reject(err);
      }
    });
    await toast.promise(likePostPromise, {
      loading: 'Saving....',
      success: 'Like success',
      error: err => `liked failed: ${err.message}`,
    });
  };

  return (
    <div className='post-controller'>
      <div className='post'>
        <div className='post-header'>
          <div className='post-logo'>
            <img src={item.creator.avatar || '/images/default-avatar.jpg'} />
          </div>
          <div className='post-name-time'>
            <div className='post-name'>{item.creator.fullName}</div>
            <div className='post-time'>
              {moment(item.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}
            </div>
          </div>
        </div>
        <div className='post-detail'>
          <div className='post-title'>{item.title}</div>
          <p>{item.description}</p>
        </div>
        <div className='post-image'>
          {
            isPreview ? (
              <img src={item.image} />
            ) : (
              <Link to={privateRoute.postDetail.url(item.id)}>
                <img src={item.image} />
              </Link>
            )
          }
        </div>
        <div className='post-emotion'>
          <div className='post-emotion-up'>
            <div className='post-emotion-like'>
              {
                isPreview ? (
                  <>
                    <AiOutlineLike />
                    {likeCount}
                  </>
                ) : (
                  <>
                    <button onClick={handleLikePost} disabled={hasLikedYet}>
                      {hasLikedYet ? <AiFillLike style={{ color: 'blue' }} /> : <AiOutlineLike />}
                    </button>
                    {likeCount}
                  </>
                )
              }
            </div>
            <div className='post-emotion-vote'>
              <BiComment />
              {item.commentCounts || 0}
            </div>
          </div>
          <div className='post-emotion-share'>
            <BsShare />
            Share
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
