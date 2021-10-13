import React from 'react';
import PostItem from '../../components/PostItem';
import './style.scss';
import { useInfiniteQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import SimpleTabs from '../../components/TabMaterial';
import DropdownMenu from '../../components/Dropdown';
import { List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

const Home = () => {
  const [dataSearch] = React.useState({
    limit: 10,
    status: 1,
    page: 1,
  });
  const {
    data: { pages = [] } = {},
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery(
    ['memeServices.searchMemes', dataSearch],
    ({ queryKey, pageParam: page }) => memeServices.searchMemes({ ...queryKey[1], page }),
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
  const content = (
    <>
      {listMemes.length && (
        <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
          <List dataSource={listMemes} renderItem={(item) => <PostItem item={item} />} />
        </InfiniteScroll>
      )}
      {isFetching
        ? Array.from(Array(5).keys()).map((i) => <Skeleton avatar paragraph={{ rows: 4 }} key={i} />)
        : listMemes.length === 0 && <p>No post found</p>}
    </>
  );
  const tabs = [
    { label: 'Hot Memes', tab: 'hot-memes' },
    { label: 'New Memes', tab: 'new-memes' },
  ];
  return (
    <div className='home-body'>
      <div className='body-sideleft' />
      <div className='body-content'>
        <SimpleTabs tabs={tabs} contents={[content, content]} />
      </div>
      <div className='body-sideright' />
    </div>
  );
};

export default Home;
