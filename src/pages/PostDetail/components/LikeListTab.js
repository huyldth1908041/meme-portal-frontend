import React, { useState } from 'react';
import { useQuery } from 'react-query';
import memeServices from '../../../services/memeServices';
import { Avatar, List, Pagination, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { privateRoute } from '../../../routes';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LikeListTab = ({ postId }) => {
  const [dataSearch, setDataSearch] = useState({ page: 1, limit: 10 });
  const {
    data = {},
    isLoading,
    error,
  } = useQuery(['memeServices.getListLike', dataSearch],
    ({ queryKey }) => memeServices.getListLike(postId, queryKey[1]),
    {
      keepPreviousData: true,
    });
  const { data: { likedList: { content: likeList = [], totalElements = 0 } = {} } = {} } = data;
  const handlePageChanged = (page, _) => {
    setDataSearch({ ...dataSearch, page: page });
  };

  return (
    <>
      {
        isLoading ? (<Skeleton />) : error ? <p>Somme error has occurred</p> : (
          <>
            <List
              bordered
              dataSource={likeList}
              style={{ width: 500 }}
              renderItem={item => (
                <List.Item>
                  <Link to={privateRoute.userProfile.url(item.id)} style={{ color: '#111' }}>
                    <Avatar size={50} src={item.avatar || '/images/default-avatar.jpg'} alt='avatar'
                            style={{ marginRight: 10 }} />
                    <b>{item.fullName}</b>
                  </Link>
                </List.Item>
              )}
            />
            <PaginationContainer>
              <Pagination defaultCurrent={1} total={totalElements} onChange={handlePageChanged}
                          pageSize={dataSearch.limit} />
            </PaginationContainer>
          </>
        )
      }
    </>
  );
};

export default LikeListTab;