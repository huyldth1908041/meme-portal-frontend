import styled from 'styled-components';
import { Avatar } from 'antd';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  div {
    margin-left: 20px;
    font-weight: 600;
  }
`
const UserSearchLabel = ({item}) => {
  return (
    <Wrapper>
      <Avatar src={item.avatar || '/images/default-avatar.jpg'} alt={item.fullName} size={50}/>
      <div>{item.fullName}</div>
    </Wrapper>
  )
}

export default UserSearchLabel