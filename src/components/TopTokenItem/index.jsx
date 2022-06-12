import React from 'react';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Avatar, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../routes';
import styled from 'styled-components';
import { AiOutlineDollar } from 'react-icons/all';

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, .4);
  min-height: 100px;
`;
const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  color: #111;
  margin-top: 20px;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;

  &:hover {
    text-decoration: none;
    color: #111;
  }

  &:last-child {
    border-bottom: none;
  }
`;
const Header = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 40px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 20%;
    height: 1px;
    background: #DC4734;
  }
`;
const TopTokenWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;
const Index = styled.div`
  font-weight: 700;
  margin-right: 20px;
  font-size: 18px;
`;
const UserInf = styled.div`
  margin-left: 20px;

  div.username {
    font-weight: 700;
    font-size: 16px;
  }

  div.userBalance {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: fit-content;
    font-size: 16px;
    font-weight: 600;


    > svg {
      margin-left: 10px;
      font-size: 20px;

    }
  }

`;
const TopTokenItem = ({ showHeader = true }) => {
  const {
    isLoading,
    data = {},
    error,
  } = useQuery(['memeServices.getTopTokenHolder'], () => memeServices.getTopTokenHolder());
  const { data: topTokenOwners = [] } = data;
  return (
    <Wrapper>
      {
        showHeader && (
          <Header>Top Token Holder</Header>
        )
      }
      <>
        {
          isLoading ? (<Skeleton />) : error ? (<p>Some error has occurred</p>) : (
            topTokenOwners.length > 0 ? (topTokenOwners.map((item, id) => (
              <StyledLink key={item.user.id} to={privateRoute.userProfile.url(item.user.id)}>
                <TopTokenWrapper>
                  <Index>{id + 1}</Index>
                  <Avatar src={item.user.avatar || '/images/default-avatar.jpg'} alt='user-avatar' size={50} />
                  <UserInf>
                    <div className='username'>{item.user.fullName}</div>
                    <div className='userBalance' style={showHeader ? null : { marginTop: '10px' }}>
                      {item.tokenBalance.toLocaleString()}
                      <AiOutlineDollar />
                    </div>
                  </UserInf>
                </TopTokenWrapper>
              </StyledLink>
            ))) : (
              <div>No body on top yet</div>
            )
          )
        }
      </>
      {/*<button className='token-owner-all'>View All</button>*/}
    </Wrapper>
  );
};

export default TopTokenItem;
