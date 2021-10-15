import React, { useEffect } from 'react';
import PostItem from '../../components/PostItem';
import './style.scss';
import { useInfiniteQuery, useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Button, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { useSearchState } from '../../states/search';
import styled from 'styled-components';
import { parse, stringify } from 'query-string';
import { useHistory } from 'react-router-dom';
import { privateRoute } from '../../routes';
import TopCreatorItem from '../../components/TopCreatorItem';

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const StyledButton = styled(Button)`
  margin: 0 10px;
  border-radius: 5px;
  height: 40px;
  font-weight: 600;
  text-transform: capitalize;

  &.active {
    background: black;
    color: #fff;
    border: none;
  }
`;
const Home = () => {
  const history = useHistory();
  const { category } = parse(window.location.search);
  const tab = window.location.pathname.replace('/', '');
  const searchQuery = useSearchState();
  const { data: categoryData = {} } = useQuery(['memeServices.getCategories'], () => memeServices.getCategories());
  const { data: categories = [] } = categoryData;
  const tabs = [
    { label: 'Hot Memes', postStatus: 2, url: privateRoute.hotPost.path, code: 'hot' },
    { label: 'New Memes', postStatus: 1, url: privateRoute.newPost.path, code: 'new' },
  ];

  const handleChangeCategory = (category) => {
    setDataSearch((prevState) => ({ ...prevState, categoryId: category.id }));
    window.history.replaceState(null, null, '?' + stringify({ category: category.name }));
  };
  const [dataSearch, setDataSearch] = React.useState({
    limit: 10,
    status: tabs.find((item) => item.code === tab).postStatus ?? 2,
    page: 1,
  });
  useEffect(() => {
    setDataSearch((prevState) => ({ ...prevState, title: searchQuery.query }));
  }, [searchQuery]);
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

  const lisPerson = [
    {
      fullName: 'JohnJohnJohnJohnJohn John',
      follower: 'Mike + 2',
    },
    {
      fullName: 'John',
      follower: 'Mike + 2',
    },
  ];
  return (
    <div className='home-body'>
      <div className='body-sideleft' />
      <div className='body-content'>
        <ButtonWrapper>
          {tabs.map((item) => {
            return (
              <StyledButton
                key={item.postStatus}
                onClick={() => {
                  history.push(item.url);
                }}
                className={item.code === tab && 'active'}
              >
                {item.label}
              </StyledButton>
            );
          })}
        </ButtonWrapper>
        <ButtonWrapper>
          <StyledButton
            onClick={() => {
              window.history.replaceState(null, null, window.location.href.split('?')[0]);
              setDataSearch((prevState) => ({ ...prevState, categoryId: null }));
            }}
            className={!category && 'active'}
          >
            All
          </StyledButton>
          {categories.length > 0 &&
            categories.map((cat) => (
              <StyledButton
                onClick={() => handleChangeCategory(cat)}
                key={cat.id}
                className={category === cat.name && 'active'}
              >
                {cat.name}
              </StyledButton>
            ))}
        </ButtonWrapper>
        <>
          {listMemes.length > 0 && (
            <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
              <List dataSource={listMemes} renderItem={(item) => <PostItem item={item} />} />
            </InfiniteScroll>
          )}
          {isFetching
            ? Array.from(Array(5).keys()).map((i) => <Skeleton avatar paragraph={{ rows: 4 }} key={i} />)
            : !listMemes.length && <p>No post found</p>}
        </>
      </div>
      <div className='body-sideright'>
        <TopCreatorItem lisPerson={lisPerson} />
      </div>
    </div>
  );
};
export default Home;
