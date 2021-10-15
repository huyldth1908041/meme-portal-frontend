import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar, Button, Col,  Form, Image, Input, Row, Skeleton } from 'antd';
import { AiFillLike,  BiUpvote } from 'react-icons/all';
import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import moment from 'moment';

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
  min-width: 100%;
`;
const CommentBox = styled.div`
  width: 100%;
  margin-top: 20px;
`;
const CommentContainer = styled.div`
  width: 100%;
  min-height: 200px;
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
const CommentItem = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;
const CommentContent = styled.div`
  max-width: 250px;
  margin-left: 10px;
  border: 1px solid #FFA6D5;
  padding: 5px;
  border-radius: 10px;

  > p:first-child {
    font-weight: 600;
    margin-bottom: 5px;
  }
`;
const CommentAction = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 600;

  svg {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    background: #8ec0f5;
    color: #fff;
    padding: 5px;
    margin-left: 5px;
  }

  > div {
    margin: 0 10px;
  }
`;
const PostDetail = () => {
  const { id } = useParams();
  const { data = {}, isLoading, error } = useQuery(['memeServices.postDetail', id],
    ({ queryKey }) => memeServices.postDetail(queryKey[1]));
  const { data: postItem = {} } = data;
  const handleComment = (values) => {
    console.log(values);
  };
  const handleCommentFailed = () => {
    console.log('here');
    toast.error('please enter comment content!');
  };
  return (
    <PageWrapper>
      {
        isLoading ? (
          <Skeleton />
        ) : error  ? (
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
                12 <AiFillLike />
              </PostEmotion>
              <PostEmotion>
                24 Comments
              </PostEmotion>
              <PostEmotion>
                12 push
              </PostEmotion>
            </EmotionContainer>
            <FlexBox style={{ marginTop: '20px' }}>
              <StyledButton type='primary' icon={<AiFillLike />}>Like</StyledButton>
              <StyledButton type='primary' icon={<BiUpvote />}>Push</StyledButton>
            </FlexBox>
            <CommentBox>
              <CommentContainer>
                <CommentItem>
                  <Avatar src={'/images/default-avatar.jpg'} size={50} />
                  <CommentContent>
                    <FlexBox>
                      <p style={{ fontWeight: 600 }}>Lưu Đức huy</p>
                      <p>15m ago</p>
                    </FlexBox>
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis distinctio ea et ipsam,
                      nemo
                      sunt
                      unde. Iste labore quos sit!</p>
                    <CommentAction>
                      <div>
                        12 <AiFillLike />
                      </div>
                      <div>
                        Reply
                      </div>
                    </CommentAction>
                  </CommentContent>

                </CommentItem>
                <CommentItem>
                  <Avatar src={'/images/default-avatar.jpg'} size={50} />
                  <CommentContent>
                    <FlexBox>
                      <p style={{ fontWeight: 600 }}>Lưu Đức huy</p>
                      <p>15m ago</p>
                    </FlexBox>
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis distinctio ea et ipsam,
                      nemo
                      sunt
                      unde. Iste labore quos sit!</p>
                    <CommentAction>
                      <div>
                        12 <AiFillLike />
                      </div>
                      <div>
                        Reply
                      </div>
                    </CommentAction>
                  </CommentContent>

                </CommentItem>
                <CommentItem>
                  <Avatar src={'/images/default-avatar.jpg'} size={50} />
                  <CommentContent>
                    <FlexBox>
                      <p style={{ fontWeight: 600 }}>Lưu Đức huy</p>
                      <p>15m ago</p>
                    </FlexBox>
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis distinctio ea et ipsam,
                      nemo
                      sunt
                      unde. Iste labore quos sit!</p>
                    <CommentAction>
                      <div>
                        12 <AiFillLike />
                      </div>
                      <div>
                        Reply
                      </div>
                    </CommentAction>
                  </CommentContent>

                </CommentItem>
              </CommentContainer>
              <Form
                name='commentForm'
                onFinish={handleComment}
                onFinishFailed={handleCommentFailed}
              >
                <Form.Item
                  name='comment'
                  rules={[{ required: true, message: 'Comment content cant not be blank' }]}
                >
                  <Input type='text' placeholder={'Enter your comment...'} />
                </Form.Item>
              </Form>
              {/*<Form.Item>*/}
              {/*  <Button type='submit'>*/}
              {/*    Send*/}
              {/*  </Button>*/}
              {/*</Form.Item>*/}

            </CommentBox>
          </StyledCol>
        </Row>)
      }

    </PageWrapper>
  );
};

export default PostDetail;