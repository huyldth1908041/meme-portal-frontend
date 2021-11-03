import styled from 'styled-components';
import { Image } from 'antd';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;

  .post-info {
    margin-left: 20px;
    overflow: hidden; // ẩn các nội dung khi kích thước lớn hơn chiều rộng khối bên ngoài
    .post-title {
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
`;
const StyledImage = styled(Image)`
  width: 80px;
  height: 80px;
  min-width: 80px;
  max-height: 80px;
`
const PostSearchLabel = ({ item }) => {
  return (
    <Wrapper>
      <StyledImage src={item.image} preview={false} />
      <div className='post-info'>
        <div className='post-title'>{item.title}</div>
        <div className='post-creator'>{item.creator.fullName}</div>
      </div>
    </Wrapper>
  );
};

export default PostSearchLabel;