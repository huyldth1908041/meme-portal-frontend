import React, { useEffect, useState } from 'react';
import PostItem from '../../components/PostItem';
import './style.scss';
import { useInfiniteQuery, useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Button, List, Menu, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { useSearchState } from '../../states/search';
import styled from 'styled-components';
import { parse, stringify } from 'query-string';
import { useHistory } from 'react-router-dom';
import { privateRoute } from '../../routes';
import TopCreatorItem from '../../components/TopCreatorItem';
import TopTokenItem from '../../components/TopTokenItem';
import { AiOutlineFire, MdOutlineGeneratingTokens } from 'react-icons/all';
import AdvertisementItem from '../../components/AdvertisementItem';

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;
const StyledButton = styled(Button)`
  margin: 0 10px;
  border-radius: 5px;
  height: 40px;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 10px;

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
      isError,
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
        refetchOnWindowFocus: false,
      },
    );
    const listMemes = pages.reduce((previous, current) => previous.concat(current.data.content), []);
    const [isMobile, setIsMobile] = useState(false);
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    useEffect(() => {
      if (window.innerWidth < 992) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    const { data: advertisementData = {}, isLoadingAd, errorAd } = useQuery([memeServices.getAdvertisement],
      () => memeServices.getAdvertisement());

    const { data: advertisement = {} } = advertisementData;

    return (
      <div className='home-body'>
        {
          !isMobile && (
            <div className='body-sideleft'>
              <TopTokenItem />
            </div>
          )
        }
        <div className='body-content'>
          {
            isMobile && (
              <Menu mode='inline' style={{ marginBottom: '20px' }}>
                <Menu.SubMenu key='sub1' title='Top Creators' icon={<AiOutlineFire />}>
                  <TopCreatorItem showHeader={false} />
                </Menu.SubMenu>
                <Menu.SubMenu key='sub2' title='Top Tokens Owners' icon={<MdOutlineGeneratingTokens />}>
                  <TopTokenItem showHeader={false} />
                </Menu.SubMenu>
              </Menu>
            )
          }
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
          {
            isLoadingAd ? <Skeleton /> : errorAd ? '' : (
              advertisement.id && (
                <AdvertisementItem item={advertisement} />
              )
            )
          }
          <>
            {
              isFetching ? (
                Array.from(Array(5).keys()).map((i) => <Skeleton avatar paragraph={{ rows: 4 }} key={i} />)
              ) : isError ? (<p>Some error has occured</p>) : (
                listMemes.length > 0 ? (
                  <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
                    <List dataSource={listMemes}
                          renderItem={(item) => <PostItem item={item} isPreview={false} isPhone={isMobile} />} />
                  </InfiniteScroll>
                ) : (
                  <p>No post found</p>
                )
              )
            }
          </>
        </div>
        {
          !isMobile && (
            <div className='body-sideright'>
              <TopCreatorItem />
            </div>
          )
        }

      </div>
    );
  }
;
export default Home;
