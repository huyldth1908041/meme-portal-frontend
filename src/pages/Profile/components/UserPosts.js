import InfiniteScroll from 'react-infinite-scroller';
import { List, Skeleton } from 'antd';
import PostItem from '../../../components/PostItem';
import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import memeServices from '../../../services/memeServices';

const dataSearch = {
  limit: 10,
  status: 1,
  page: 1,
};

const UserPosts = ({ params, onUpdateCounter }) => {

  const {
    data: { pages = [] } = {},
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery(
    ['memeServices.searchMemes', params],
    ({ queryKey, pageParam: page }) => memeServices.searchMemes({ ...dataSearch, ...queryKey[1], page }),
    {
      getNextPageParam: ({ data: { last, number } }) => {
        if (last === true) return undefined;
        //api page number count from 0
        let pageNumber = number + 1;
        return pageNumber + 1;
      },
    },
  );
  const listMemes = pages.reduce((previous, current) => previous.concat(current.data.content), []);
  useEffect(() => {
    const totalElements = pages[0]?.data.totalElements || undefined;
    onUpdateCounter(totalElements);
  }, [onUpdateCounter, pages]);

  return (
    <>
      {
        isFetching ? (
          Array.from(Array(5).keys()).map((i) => <Skeleton avatar paragraph={{ rows: 4 }} key={i} />)
        ) : isError ? (<p>Some error has occured</p>) : (
          listMemes.length > 0 ? (
            <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
              <List dataSource={listMemes} renderItem={(item) => <PostItem item={item} />} />
            </InfiniteScroll>
          ) : (
            <p>No post found</p>
          )
        )
      }
    </>
  );
};

export default UserPosts;