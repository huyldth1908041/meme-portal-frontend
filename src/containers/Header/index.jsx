import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineHome, AiOutlineLogin, AiOutlineCloudUpload } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link, useHistory } from 'react-router-dom';
import { useAuthentication } from '../../hooks';
import { BiExit, GrTransaction, RiAdvertisementFill } from 'react-icons/all';
import NotificationBar from '../../components/NotificationBar';
import memeServices from '../../services/memeServices';
import SelectDebounce from '../../components/SelectDebounce/SelectDebounce';
import { Image } from 'antd';
import PostSearchLabel from '../../components/PostSearchLabel';
import UserSearchLabel from '../../components/UserSearchLabel';

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
          <Image src='/images/nobg-logo.png' alt='logo' width='auto' height='75px' preview={false} />
          <div>HÀI CODE</div>
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
        {user ? (
          <>
            {!isMobile && (<NotificationBar />)}
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
