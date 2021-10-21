import { Avatar, Comment, Form, List, Skeleton } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { AiOutlineLike } from 'react-icons/ai';
import { TextareaAutosize } from '@material-ui/core';
import memeServices from '../../services/memeServices';
import { toast } from 'react-hot-toast';
import { useAuthentication } from '../../hooks';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';

const CommentAuthor = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const StyledComment = styled(Comment)`
  .ant-comment-content {
    border-radius: 5px;
    border: 1px solid #111;
    padding: 10px;
  }
`;
const LikeButton = styled.button`
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    font-size: 18px;
    color: #008EDE;
    margin-left: 5px;
  }
`;
const ReplyButton = styled.button`
  font-size: 14px;
`;
const CommentTime = styled.p`
  font-size: 12px;
  margin-left: 5px;
`;
const ReplyCommentContainer = styled.div`
  width: 100%;
  height: auto;
  overflow: auto;
`;

const CommentInput = styled(TextareaAutosize)`
  width: 100%;
  padding: 10px;
  border-radius: 7px;

  &::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }


  ::-webkit-scrollbar-thumb {
    background: #6B6C6E;
    border-radius: 10px;
  }


  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const LoadMoreButton = styled.button`
  display: block;
  width: fit-content;
  margin: 10px auto;
  color: #008EDE;
`;

const CommentItem = ({ comment, reFetchPostDeail }) => {
  const { user } = useAuthentication();
  const { id } = useParams();
  const [isCommenting, setIsCommenting] = useState(false);
  const [form] = Form.useForm();
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [dataSearch] = React.useState({ limit: 5, status: 1, page: 1 });
  const {
    data: { pages = [] } = {},
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useInfiniteQuery(
    ['memeServices.fetchReplyComment', dataSearch, comment.id],
    ({ queryKey, pageParam: page }) => memeServices.fetchReplyComment(queryKey[2], { ...queryKey[1], page }),
    {
      getNextPageParam: ({ data: { last, number } }) => {
        if (last === true) return undefined;
        //api page number count from 0
        let pageNumber = number + 1;
        return pageNumber + 1;
      },
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );
  const listComments = pages.reduce((previous, current) => previous.concat(current.data.content), []);
  const handleLoadMore = async () => {
    await fetchNextPage();
  };
  const handleReply = async (values) => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }
    const replyPromise = new Promise(async (resolve, reject) => {
      try {
        setIsCommenting(true);
        await memeServices.postAComment(id, { content: values.content, replyCommentId: comment.id });
        form.resetFields();
        await refetch();
        await reFetchPostDeail();
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setIsCommenting(false);
      }
    });
    await toast.promise(replyPromise, {
      loading: 'Saving....',
      success: 'Comment success',
      error: err => `comment failed: ${err.message}`,
    });
  };
  const handleReplyFailed = () => {
    toast.error('Please check form value then try again');
  };
  const handleChange = e => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      form.submit();
    }
  };
  const handleOpenReply = async () => {
    await refetch();
    setIsOpenReply(true);
  };
  return (
    <StyledComment
      actions={[
        <LikeButton key='like-button'>{comment.likeCount}<AiOutlineLike /></LikeButton>,
        <ReplyButton key='reply-button' onClick={handleOpenReply}>{comment.replyCount} Reply</ReplyButton>,
      ]}
      author={<CommentAuthor>{comment.user.fullName}</CommentAuthor>}
      avatar={<Avatar src={comment.user.avatar || '/images/default-avatar.jpg'} alt={comment.user.fullName} />}
      content={
        <p>
          {comment.content}
        </p>
      }
      datetime={<CommentTime>{moment(comment.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}</CommentTime>}
    >
      {isOpenReply && (
        <>
          <ReplyCommentContainer>
            {isFetching ? (<Skeleton />) : isError ? (<p>Some error has occured</p>) :
              listComments.length > 0 && (
                <List dataSource={listComments} renderItem={(item) => <StyledComment
                  actions={[
                    <LikeButton key='like-button'>{item.likeCount}<AiOutlineLike /></LikeButton>,
                  ]}
                  author={<CommentAuthor>{item.user.fullName}</CommentAuthor>}
                  avatar={<Avatar src={item.user.avatar || '/images/default-avatar.jpg'}
                                  alt={item.user.fullName} />}
                  content={
                    <p>
                      {item.content}
                    </p>
                  }
                  datetime={<CommentTime>{moment(item.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}</CommentTime>}
                />} />
              )
            }
            {hasNextPage && (<LoadMoreButton onClick={handleLoadMore}>Load more...</LoadMoreButton>)}
          </ReplyCommentContainer>
          <Form
            name='commentForm'
            onFinish={handleReply}
            onFinishFailed={handleReplyFailed}
            form={form}
          >
            <Form.Item
              name='content'
              rules={[{ required: true, message: 'Comment content cant not be blank' }]}
            >
              <CommentInput
                maxRows={5}
                placeholder='Enter your reply...'
                onKeyPress={handleChange}
                disabled={isCommenting}
              />
            </Form.Item>
          </Form>
        </>
      )}
    </StyledComment>
  );
};
export default CommentItem;