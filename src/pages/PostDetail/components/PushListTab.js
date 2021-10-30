import React, { useState } from 'react';
import AppTable from '../../../components/Table';
import { pushedListTableColumns } from '../config';
import { Pagination, Skeleton } from 'antd';
import { useQuery } from 'react-query';
import memeServices from '../../../services/memeServices';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PushListTab = ({ postId }) => {
  const [dataSearch, setDataSearch] = useState({ page: 1, limit: 10 });
  const {
    data = {},
    isLoading,
    error,
  } = useQuery(['memeServices.getListPushed', dataSearch],
    ({ queryKey }) => memeServices.getListPushed(postId, queryKey[1]),
    {
      keepPreviousData: true,
    });
  const { data: { content: pushers = [], totalElements = 0 } = {} } = data;
  const handlePageChanged = (page, _) => {
    setDataSearch({ ...dataSearch, page: page });
  };

  return (
    <>
      {
        isLoading ? (<Skeleton />) : error ? <p>Some error has occurred</p> : (
          <>
            <AppTable
              columns={pushedListTableColumns}
              data={pushers.map((item, key) => ({ ...item, key: key }))}
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
}
;

export default PushListTab;