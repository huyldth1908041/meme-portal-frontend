import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineHome, AiOutlineLogin, AiOutlineCloudUpload, AiFillDollarCircle } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link, useHistory } from 'react-router-dom';
import { useAuthentication } from '../../hooks';
import { BiExit, GrTransaction, RiAdvertisementFill } from 'react-icons/all';
import NotificationBar from '../../components/NotificationBar';
import memeServices from '../../services/memeServices';
import SelectDebounce from '../../components/SelectDebounce/SelectDebounce';
import { Divider, Image } from 'antd';
import PostSearchLabel from '../../components/PostSearchLabel';
import UserSearchLabel from '../../components/UserSearchLabel';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100%;
  div:first-child {
    font-weight: bold;
    margin-bottom: 10px;
  }
  svg {
    font-size: 24px;
    margin-right: 6px;
  }

  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
  padding-left: 3px;
`;
const Logo = styled.div`
  font-weight: bold;
  font-size: 26px;
  color: #111;
`
function Header() {
  const { user, logout } = useAuthentication();
  const [openProfile, setOpenProfile] = useState(false);
  const ref = useRef();
  const [postId, setPostId] = useState();
  const history = useHistory();
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
  const fetchPostList = async (title) => {
    try {
      const res = await memeServices.searchMemes({ page: 1, limit: 5, title: title, status: 1 });
      const userRes = await memeServices.getListUsers({ page: 1, limit: 5, fullName: title, status: 1 });
      const listUsers = userRes.data.content.map(item => ({ ...item, type: 'user' }));
      const listPosts = res.data.content.map(item => ({ ...item, type: 'post' }));
      const listSearchRes = listUsers.concat(listPosts);

      return listSearchRes.map(item => {
        if (item.type === 'user') {
          return {
            label: <UserSearchLabel item={item} />,
            value: `user-${item.id}`,
          };
        } else {
          return {
            label: <PostSearchLabel item={item} />,
            value: `post-${item.id}`,
          };
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  const toggleProfile = () => {
    setOpenProfile(!openProfile);
  };
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (openProfile && ref.current && !ref.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [openProfile]);
  return (
    <div className='header-content'>
      <div className='logo'>
        <Link to={privateRoute.home.path} style={{ display: 'flex', alignItems: 'center' }}>
          <Image src='/images/nobg-logo.png' alt='logo' width='75px' height='75px' preview={false} />
          {!isMobile && (<Logo>HÀI CODE</Logo>)}
        </Link>
      </div>
      <div className='search'>
        {/*<input type='text' placeholder='Search' onChange={(e) => onSendSearch(e.target.value)} />*/}
        {!isMobile && (<SelectDebounce
          value={postId}
          placeholder='Search anything..'
          fetchOptions={fetchPostList}
          onChange={(newValue) => {
            const [type, id] = newValue.value.split('-');
            if (type === 'user') {
              history.push(privateRoute.userProfile.url(id));
            } else {
              history.push(privateRoute.postDetail.url(id));
            }
            setPostId(null);
          }}
        />)}
      </div>
      <div className='list-icon'>
        {!isMobile && (<Link to={privateRoute.home.path}>
          <AiOutlineHome />
        </Link>)}
        {user.id > 0 ? (
          <>
            <NotificationBar />
            <div className='d-flex justify-content-center align-items-center'>
              <div ref={ref} className='header-content-container'>
                <button onClick={toggleProfile}>
                  <div className='account'>
                    <img src={user.avatar || '/images/default-avatar.jpg'} height='100%' width='100%' alt='profile' />
                  </div>
                  {!isMobile && (<div className='name'>{user.fullName}</div>)}
                </button>
                {openProfile && (
                  <div className='dropdown-content' onClick={() => setOpenProfile(false)}>
                    <StyledDiv>
                      <div>
                        {user.username}
                      </div>
                      <div>
                        <AiFillDollarCircle />
                        {user.tokenBalance} tokens
                      </div>
                    </StyledDiv>
                    <Link to={privateRoute.profile.path}>
                      <BsPersonCircle /> Profile
                    </Link>
                    <Link to={privateRoute.tokenHistory.path}>
                      <GrTransaction />
                      Token history
                    </Link>
                    <Link to={privateRoute.createAdvertisement.path}>
                      <RiAdvertisementFill />
                      Advertisement
                    </Link>
                    <button onClick={() => logout()}>
                      <BiExit className='button-icon' />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <Link className='header-btn' to={privateRoute.create.path}>
                <AiOutlineCloudUpload className='button-icon' /> Create
              </Link>
            </div>
          </>
        ) : (
          <div>
            <Link className='header-btn' to='/login'>
              <AiOutlineLogin className='button-icon' /> Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
