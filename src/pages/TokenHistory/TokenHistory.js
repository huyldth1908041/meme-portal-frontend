import styled from 'styled-components';
import { Avatar, Divider, Pagination, Skeleton } from 'antd';
import AppTable from '../../components/Table';
import { tokenHistoryColumns } from './config';
import { useState } from 'react';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { useAuthentication } from '../../hooks';

const Wrapper = styled.div`
  width: 800px;
  margin: 0 auto;
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

  div.user-token {
    margin-top: 10px;
    font-size: 18px;
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
  const userId = user.id;
  const { data = {}, isLoading, error } = useQuery(['memeServices.userDetail', userId],
    ({ queryKey }) => memeServices.userDetail(queryKey[1]));
  const { data: apiUser = {} } = data;
  const {
    data: tokenHistoryData = {},
    isLoading: isLoadingTokenHistory,
    error: tokenHistoryError,
  } = useQuery(['memeServices.getTokenHistory', dataSearch],
    ({ queryKey }) => memeServices.getTokenHistory(queryKey[1]),
    {
      keepPreviousData: true,
    });
  const { data: { content: apiTokenHistory = [], totalElements = 0 } } = tokenHistoryData;
  const handlePageChanged = (page, _) => {
    setDataSearch({ ...dataSearch, page: page });
  };
  return (
    <Wrapper>
      {
        isLoading ? <Skeleton /> : error ? (<p>Some error has occurred</p>) : (
          <Header>
            <Avatar src={apiUser.avatar || '/images/default-avatar.jpg'} alt='avatar' size={100} />
            <UserInformation>
              <div className='username'>{apiUser.fullName}</div>
              <div className='user-token'>Current token balance: {apiUser.tokenBalance}</div>
            </UserInformation>
          </Header>
        )
      }
      <Divider />
      {
        isLoadingTokenHistory ? (<Skeleton />) : tokenHistoryError ? (<p>Some errors has occurred</p>) : (
          apiTokenHistory.length && (
            <>
              <AppTable
                renderTitle={() => <h4>Token history</h4>}
                columns={tokenHistoryColumns}
                data={apiTokenHistory.map(item => ({ ...item, key: item.id }))}
              />
              <PaginationContainer>
                <Pagination defaultCurrent={1} total={totalElements} onChange={handlePageChanged}
                            pageSize={dataSearch.limit} />
              </PaginationContainer>
            </>
          )
        )
      }
    </Wrapper>
  );
};

export default TokenHistory;