import styled from 'styled-components';
import { Avatar, Divider, Pagination, Skeleton, Button, Menu, Dropdown} from 'antd';
import AppTable from '../../components/Table';
import { AiOutlineInfoCircle } from 'react-icons/all';
import { tokenHistoryColumns } from './config';
import { useState } from 'react';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { useAuthentication } from '../../hooks';
import { useHistory } from 'react-router-dom';
import { privateRoute } from '../../routes';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  width: 800px;
  margin: 0 auto;
  @media screen and (max-width: 992px) {
    width: 100%;
  }
`;
const Header = styled.div`
  width: 100%;
  padding: 10px;
  height: 150px;
  display: flex;
  align-items: center;
`;
const UserInformation = styled.div`
  margin-left: 20px;

  div.username {
    font-weight: bold;
    font-size: 20px;
  }

  div.user-token-content {
    display: flex;
    align-items: center;

    div.user-token {
      padding-top: 10px;
      font-size: 18px;
      padding-right: 20px;
    }

    svg {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
`;
const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const TokenHistory = () => {
  const [dataSearch, setDataSearch] = useState({ page: 1, limit: 10 });
  const { user } = useAuthentication();
  const userId = user ? user.id : 0;
  const {
    data = {},
    isLoading,
    error,
  } = useQuery(['memeServices.userDetail', userId], ({ queryKey }) => memeServices.userDetail(queryKey[1]));
  const { data: apiUser = {} } = data;
  const {
    data: tokenHistoryData = {},
    isLoading: isLoadingTokenHistory,
    error: tokenHistoryError,
  } = useQuery(
    ['memeServices.getTokenHistory', dataSearch],
    ({ queryKey }) => memeServices.getTokenHistory(queryKey[1]),
    {
      keepPreviousData: true,
    },
  );
  const { data: { content: apiTokenHistory = [], totalElements = 0 } = {} } = tokenHistoryData;
  const handlePageChanged = (page, _) => {
    setDataSearch({ ...dataSearch, page: page });
  };
  const history = useHistory();

  const goTokenPolicy = () => {
    history.push(privateRoute.tokenPolicy.path);
  };
  const menu = (
    <Menu>
      <Menu.Item key='0'>
        <Link to={privateRoute.createAdvertisement.path}>Create advertisement</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <p>Some error has occurred</p>
      ) : (
        <Header>
          <Avatar src={apiUser.avatar || '/images/default-avatar.jpg'} alt='avatar' size={100} />
          <UserInformation>
            <div className='username'>{apiUser.fullName}</div>

            <div className='user-token-content'>
              <div className='user-token'>Current token balance: {apiUser.tokenBalance.toLocaleString()}</div>
              <AiOutlineInfoCircle onClick={goTokenPolicy} />
            </div>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type='primary'>Use Token</Button>
            </Dropdown>
          </UserInformation>
        </Header>
      )}
      <Divider />
      {isLoadingTokenHistory ? (
        <Skeleton />
      ) : tokenHistoryError ? (
        <p>Some errors has occurred</p>
      ) : (
        apiTokenHistory.length && (
          <>
            <AppTable
              renderTitle={() => <h4>Token history</h4>}
              columns={tokenHistoryColumns}
              data={apiTokenHistory.map((item) => ({ ...item, key: item.id }))}
            />
            <PaginationContainer>
              <Pagination
                defaultCurrent={1}
                total={totalElements}
                onChange={handlePageChanged}
                pageSize={dataSearch.limit}
              />
            </PaginationContainer>
          </>
        )
      )}
    </Wrapper>
  );
};

export default TokenHistory;
