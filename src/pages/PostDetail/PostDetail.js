import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar, Button, Col, Form, Image, List, Row, Skeleton } from 'antd';
import { AiFillLike, BiComment, BiUpvote } from 'react-icons/all';
import { toast } from 'react-hot-toast';
import { useInfiniteQuery, useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import moment from 'moment';
import { AiOutlineLike } from 'react-icons/ai';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthentication } from '../../hooks';
import CommentItem from '../../components/CommentItem';
import { TextareaAutosize } from '@material-ui/core';
import ModalTokenPushPost from '../../components/ModalTokenPushPost';

const PageWrapper = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 10px;
`;
const PostHeader = styled.div`
  width: 100%;
  padding: 20px;
`;
const PostTitle = styled.h1`
  font-size: 32px;
`;
const FlexBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledCol = styled(Col)`
  padding-top: 20px;
`;
const CreatorBox = styled.div`
  display: flex;

  > div {
    margin-left: 10px;
  }

  div.up-hot-token {
    margin-left: 30px;
  }

  p {
    margin-bottom: 5px;

    &:first-child {
      font-weight: 600;
    }

    &:nth-child(2) {
      color: #7e7e7e;
    }
  }
`;
const DescriptionBox = styled.div`
  margin-top: 10px;
`;
const PostContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const StyledImage = styled(Image)`
  max-height: 500px;
  min-height: 400px;
  min-width: 100%;
`;
const CommentBox = styled.div`
  width: 100%;
  margin-top: 20px;
`;
const CommentContainer = styled.div`
  width: 100%;
  max-height: 370px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */

  ::-webkit-scrollbar-thumb {
    background: #6B6C6E;
    border-radius: 10px;
  }

  /* Handle on hover */

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const StyledButton = styled(Button)`
  height: 40px;
  border-radius: 7px;
  width: 100px;
  font-size: 16px;
  font-weight: 600;

  > svg {
    margin-right: 10px;
    margin-bottom: 5px;
  }
`;
const EmotionContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  margin-top: 20px;

`;
const PostEmotion = styled.div`
  margin: 0 10px;
  font-weight: 600;
  font-size: 16px;

  > svg {
    margin-bottom: 2px;
    font-size: 16px;
    color: #8ec0f5;
  }
`;
const LoadMoreButton = styled.button`
  display: block;
  width: fit-content;
  margin: 10px auto;
  color: #008EDE;
`;
const CommentInput = styled(TextareaAutosize)`
  width: 100%;
  padding: 10px;
  border-radius: 7px;

  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */

  ::-webkit-scrollbar-thumb {
    background: #6B6C6E;
    border-radius: 10px;
  }

  /* Handle on hover */

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const PostDetail = () => {
  const { user } = useAuthentication();
  const [form] = Form.useForm();
  const { id } = useParams();
  const commentBox = useRef(null);
  const [displayModal, setDisplayModal] = React.useState(false);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);
  const { data = {}, isLoading, error, refetch: reFetchPostDeail } = useQuery(['memeServices.postDetail', id],
    ({ queryKey }) => memeServices.postDetail(queryKey[1]));
  const { data: postItem = {} } = data;
  const {
    data: likeCountData = {},
    refetch,
  } = useQuery(['memeServices.getLikeCount', id],
    ({ queryKey }) => memeServices.getLikeCount(queryKey[1]));
  const { data: { likeCount = 0, hasLikedYet = false } = {} } = likeCountData;
  const [dataSearch] = React.useState({
    limit: 10,
    status: 1,
    page: 1,
  });
  const {
    data: { pages = [] } = {},
    fetchNextPage: fetchNextPageComment,
    hasNextPage: hasNextPageComments,
    isFetching: isFetchingComments,
    isError: isErrorComment,
    refetch: reFetchComment,
  } = useInfiniteQuery(
    ['memeServices.getListCommentOfAPost', dataSearch, id],
    ({ queryKey, pageParam: page }) => memeServices.getListCommentOfAPost(queryKey[2], { ...queryKey[1], page }),
    {
      getNextPageParam: ({ data: { last, number } }) => {
        if (last === true) return undefined;
        //api page number count from 0
        let pageNumber = number + 1;
        return pageNumber + 1;
      },
      refetchOnWindowFocus: false,
    },
  );
  const listComments = pages.reduce((previous, current) => previous.concat(current.data.content), []);
  const [isCommenting, setIsCommenting] = useState(false);
  const handleComment = async (values) => {
    if (!user) {
      toast.error('Please login to like post');
      return;
    }
    const commentPromise = new Promise(async (resolve, reject) => {
      try {
        setIsCommenting(true);
        await memeServices.postAComment(id, values);
        form.resetFields();
        await reFetchComment();
        await reFetchPostDeail();
        commentBox.current.scrollTop = 0;
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setIsCommenting(false);
      }
    });
    await toast.promise(commentPromise, {
      loading: 'Saving....',
      success: 'Comment success',
      error: err => `comment failed: ${err.message}`,
    });
  };
  const handleCommentFailed = () => {
    toast.error('please enter comment content!');
  };
  const handleLikePost = async () => {
    if (!user) {
      toast.error('Please login to like post');
      return;
    }
    const likePostPromise = new Promise(async (resolve, reject) => {
      try {
        await memeServices.likeAPost({ postId: id });
        await refetch();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
    await toast.promise(likePostPromise, {
      loading: 'Saving....',
      success: 'Like success',
      error: err => `liked failed: ${err.message}`,
    });
  };
  const handleChange = e => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      form.submit();
    }
  };

  const handlePush = () => {
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

  return (
    <PageWrapper>
      {
        isLoading ? (
          <Skeleton />
        ) : error ? (
          <p>Not found</p>
        ) : (<Row gutter={24}>
          <Col span={16}>

            <PostHeader>
              <FlexBox>
                <PostTitle>{postItem.title}</PostTitle>
              </FlexBox>
              <DescriptionBox>{postItem.description}</DescriptionBox>
            </PostHeader>
            <PostContent>
              <StyledImage src={postItem.image} preview={false} />

            </PostContent>

          </Col>
          <StyledCol span={8}>
            <CreatorBox>
              <Avatar src={postItem.creator.avatar || '/images/default-avatar.jpg'} size={50} />
              <div>
                <p>{postItem.creator.fullName}</p>
                <p>{moment(postItem.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}</p>
              </div>
            </CreatorBox>
            <EmotionContainer>
              <PostEmotion>
                {hasLikedYet ? <AiFillLike style={{ color: 'blue' }} /> : <AiOutlineLike />}
                {likeCount}
              </PostEmotion>
              <PostEmotion>
                <BiComment style={{ color: '#111' }} /> {postItem.commentCounts || 0}
              </PostEmotion>
              {
                postItem.status === 1 && (
                  <>
                    <PostEmotion>
                      {postItem.pushCount} push
                    </PostEmotion>
                    <div className='up-hot-token'>
                      <b>{postItem.upHotTokenNeeded} </b> tokens to be hot
                    </div>
                  </>
                )
              }
            </EmotionContainer>
            <FlexBox style={{ marginTop: '20px' }}>
              <StyledButton
                type='primary'
                icon={<AiFillLike />}
                onClick={handleLikePost}
                disabled={hasLikedYet}
              >
                {hasLikedYet ? 'Liked' : 'Like'}
              </StyledButton>
              {
                postItem.status === 1 && (
                  <>
                    <StyledButton type='primary' icon={<BiUpvote />} onClick={handlePush}>Push</StyledButton>
                    <ModalTokenPushPost
                      visible={displayModal}
                      handleCancel={handleCancel}
                      handleOk={handleOk}
                      pusherId={user.id}
                      postItem={postItem}
                    />
                  </>
                )
              }
            </FlexBox>
            <CommentBox>
              <CommentContainer ref={commentBox}>
                {
                  isFetchingComments ? (
                    Array.from(Array(5).keys()).map((i) => <Skeleton avatar paragraph={{ rows: 4 }} key={i} />)
                  ) : isErrorComment ? (<p>Some error has occured</p>) : (
                    listComments.length > 0 && (
                      <List dataSource={listComments}
                            renderItem={(item) => <CommentItem comment={item} reFetchPostDeail={reFetchPostDeail} />} />
                    )
                  )
                }
                {
                  hasNextPageComments && (<LoadMoreButton onClick={fetchNextPageComment}>Load more</LoadMoreButton>)
                }
              </CommentContainer>
              <Form
                name='commentForm'
                onFinish={handleComment}
                onFinishFailed={handleCommentFailed}
                form={form}
              >
                <Form.Item
                  name='content'
                  rules={[{ required: true, message: 'Comment content cant not be blank' }]}
                >
                  <CommentInput
                    maxRows={5}
                    placeholder='Enter your comment...'
                    onKeyPress={handleChange}
                    disabled={isCommenting}
                  />
                </Form.Item>
              </Form>
            </CommentBox>
          </StyledCol>
        </Row>)
      }

    </PageWrapper>
  );
};

export default PostDetail;