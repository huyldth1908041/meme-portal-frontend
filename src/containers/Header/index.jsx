import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineHome, AiOutlineLogin, AiOutlineCloudUpload } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './style.scss';
import { privateRoute } from '../../routes';
import { Link, useHistory } from 'react-router-dom';
import { useAuthentication } from '../../hooks';
import { BiExit, GrTransaction } from 'react-icons/all';
import NotificationBar from '../../components/NotificationBar';
import memeServices from '../../services/memeServices';
import SelectDebounce from '../../components/SelectDebounce/SelectDebounce';
import logo from "./logo.jpeg";

function Header() {
  const { user, logout } = useAuthentication();
  const [openProfile, setOpenProfile] = useState(false);
  const ref = useRef();
  const [postId, setPostId] = useState();
  const history = useHistory();
  const fetchPostList = async (title) => {
    try {
      const res = await memeServices.searchMemes({ page: 1, limit: 10, title: title, status: 1 });
      return res.data.content.map((post) => ({
        label: `${post.title}`,
        value: post.id,
      }));
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
        <Link to={privateRoute.home.path}>
          <img src={logo} alt='' width="35" height="35"/>
        </Link>
      </div>
      <div className='search'>
        {/*<input type='text' placeholder='Search' onChange={(e) => onSendSearch(e.target.value)} />*/}
        <SelectDebounce
          value={postId}
          placeholder='Search post..'
          fetchOptions={fetchPostList}
          onChange={(newValue) => {
            setPostId(newValue);
            history.push(privateRoute.postDetail.url(newValue.value));
          }}
        />
      </div>
      <div className='list-icon'>
        <Link to={privateRoute.home.path}>
          <AiOutlineHome />
        </Link>
        {user ? (
          <>
            <NotificationBar />
            <div className='d-flex justify-content-center align-items-center'>
              <div ref={ref} className='header-content-container'>
                <button onClick={toggleProfile}>
                  <div className='account'>
                    <img src={user.avatar || '/images/default-avatar.jpg'} height='100%' width='100%' alt='profile' />
                  </div>
                  <div className='name'>{user.fullName}</div>
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
