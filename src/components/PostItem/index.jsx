/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import './style.scss';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';
import { AiFillLike, BiComment, FaFacebook, BsArrowUpCircle, MdOutlineReportProblem } from 'react-icons/all';
import memeServices from '../../services/memeServices';
import { useAuthentication } from '../../hooks';
import { toast } from 'react-hot-toast';
import ModalTokenPushPost from '../../components/ModalTokenPushPost';
import ModalReport from '../../components/ModalReport';

const PostItem = ({ item, isPreview, isPhone = false }) => {
  const { user } = useAuthentication();
  const [likeCount, setLikeCount] = useState(item.likeCounts);
  const [hasLikedYet, setHasLikedYet] = useState(false);
  const [disableShareButton, setDisableShareButton] = useState(false);
  const [shareCount, setShareCount] = useState(item.shareCounts);
  const [displayModal, setDisplayModal] = React.useState(false);
  const [displayModalReport, setDisplayModalReport] = React.useState(false);
  useEffect(() => {
    if (user.id > 0 && item?.listLiked.includes(user.id)) {
      setHasLikedYet(true);
    }
  }, [item, user]);

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
      error: (err) => `liked failed: ${err.message}`,
    });
  };
  const handleSharePost = async () => {
    if (!user) {
      toast.error('please login to continue');
      return;
    }
    //check share
    let canShare = false;
    try {
      const resp = await memeServices.checkShare(item.id);
      canShare = resp.data.canShare;
    } catch (err) {
      toast.error('some error has occured');
    }
    if (!canShare) {
      toast.error('You have reached share limit for this post, try again tomorrow');
      setDisableShareButton(true);
      return;
    }
    window.FB.ui(
      {
        method: 'feed',
        name: 'Facebook Dialogs',
        link: `https://meme-portal-frontend.vercel.app/post/${item.id}`,
      },
      function(response) {
        if (typeof response !== 'undefined') {
          memeServices
            .saveSharePost(item.id)
            .then((resp) => {
              const newShareCount = resp.data.shareCount;
              setShareCount(newShareCount);
              setDisableShareButton(true);
              toast.success('Shared success');
            })
            .catch((err) => {
              toast.error('share failed: ' + err.message);
            });
        } else {
          toast.error('post not shared: user denied to share');
        }
      },
    );
  };

  const sendToken = (e) => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }
    setDisplayModal(true);
  };
  const handleOk = () => {
    setDisplayModal(false);
  };

  const handleCancel = () => {
    setDisplayModal(false);
  };
  const handleReport = () => {
    setDisplayModalReport(true);
  };
  const handleCancelModalReport = () => {
    setDisplayModalReport(false);
  };
  const handleOkModalReport = () => {
    setDisplayModalReport(false);
  };
  return (
    <div className='post-controller'>
      <div className='post'>
        <div className='post-header'>
          <div className='post-header-left'>
            <div className='post-logo'>
              <Link to={privateRoute.userProfile.url(item.creator.id)}>
                <img src={item.creator.avatar || '/images/default-avatar.jpg'} alt='avatar' />
              </Link>
            </div>
            <div className='post-name-time'>
              <Link className='post-name' to={privateRoute.userProfile.url(item.creator.id)}>
                {item.creator.fullName}
              </Link>
              <div className='post-time'>{moment(item.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}</div>
            </div>
          </div>
          {item.status === 1 && (
            <div className='post-header-right'>
              Need <b>{item.upHotTokenNeeded.toLocaleString()}</b> tokens more to be hot Post
            </div>
          )}
        </div>
        <div className='post-detail'>
          <div className='post-title'>{item.title}</div>
          <p>{item.description}</p>
        </div>
        <div className='post-image'>
          {isPreview ? (
            <img src={item.image} />
          ) : (
            <Link to={privateRoute.postDetail.url(item.id)}>
              <img src={item.image} />
            </Link>
          )}
        </div>
        <div className='post-emotion'>
          <div className='post-emotion-up'>
            <div className='post-emotion-like'>
              {isPreview ? (
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
              )}
            </div>
            {isPreview ? (
              <div className='post-emotion-vote'>
                <BiComment />
                {item.commentCounts || 0}
              </div>
            ) : (
              <Link className='post-emotion-vote' to={privateRoute.postDetail.url(item.id)} style={{marginRight: '20px'}}>
                <BiComment />
                {item.commentCounts || 0}
              </Link>
            )}
            {item.status === 1 && (
              <>
                <button className='post-emotion-push' onClick={sendToken}>
                  <BsArrowUpCircle /> {!isPhone && `Push`}
                </button>
                {user.id > 0 && (
                  <div className='modal-token'>
                    <ModalTokenPushPost
                      visible={displayModal}
                      handleCancel={handleCancel}
                      handleOk={handleOk}
                      pusherId={user.id}
                      postItem={item}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {!isPreview && (
            <>
              <button className='post-emotion-share' onClick={handleReport}>
                <MdOutlineReportProblem style={{fontSize: '27px'}}/> {!isPhone && `Report`}
              </button>
              <div className='modal-report'>
                <ModalReport
                  visible={displayModalReport}
                  handleCancel={handleCancelModalReport}
                  handleOk={handleOkModalReport}
                  post={item}
                />
              </div>
            </>
          )}
          <div className='post-emotion-share'>
            {isPreview ? (
              <button>
                <FaFacebook />{item.shareCounts} Share
              </button>
            ) : (
              <button onClick={handleSharePost} disabled={disableShareButton}>
                <FaFacebook />
                {shareCount} {!isPhone && 'Share'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
