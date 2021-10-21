import styled from 'styled-components';
import { Avatar, Comment } from 'antd';
import { AiOutlineLike } from 'react-icons/ai';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { CommentAuthor, CommentTime, LikeButton } from '../CommentItem';
import memeServices from '../../services/memeServices';
import { toast } from 'react-hot-toast';
import { AiFillLike } from 'react-icons/all';
import { useAuthentication } from '../../hooks';

const StyledComment = styled(Comment)`
  .ant-comment-content {
    border-radius: 5px;
    border: 1px solid #111;
    padding: 10px;
  }
`;

const ReplyCommentItem = ({ comment }) => {
  const { user } = useAuthentication();
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [hasLikedYet, setHasLikedYet] = useState(false);
  const fetchLikeCount = useCallback(async () => {
    try {
      const data = await memeServices.getCommentLikeCount(comment.id);
      setLikeCount(data.data.likeCount);
      setHasLikedYet(data.data.hasLikedYet);
    } catch (err) {
      setLikeCount(0);
      setHasLikedYet(false);
    }
  }, [comment]);
  useEffect(() => {
    fetchLikeCount();
  }, [fetchLikeCount]);
  const handleLikePostComment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }
    const likeCommentPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await memeServices.likeAComment({ commentId: comment.id });
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
    await toast.promise(likeCommentPromise, {
      loading: 'Saving....',
      success: 'Like success',
      error: err => `liked failed: ${err.message}`,
    });
  };

  return (
    <StyledComment
      actions={[
        <LikeButton key='like-button' disabled={hasLikedYet} onClick={handleLikePostComment}>
          {likeCount} {hasLikedYet ? <AiFillLike /> : <AiOutlineLike />}
        </LikeButton>,
      ]}
      author={<CommentAuthor>{comment.user.fullName}</CommentAuthor>}
      avatar={<Avatar src={comment.user.avatar || '/images/default-avatar.jpg'}
                      alt={comment.user.fullName} />}
      content={
        <p>
          {comment.content}
        </p>
      }
      datetime={<CommentTime>{moment(comment.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}</CommentTime>}
    />
  );
};
export default ReplyCommentItem;