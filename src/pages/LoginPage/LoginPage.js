/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import axios from 'axios';
// import { useProfileHandler } from '../../states/profile';
import { Link } from 'react-router-dom';
import validator from 'validator';
import './style.scss';
const LoginPage = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  //demo purpose only
  // const { onLogin } = useProfileHandler();

  const validateInput = (email, password) => {
    if (email === '' || password === '') {
      setMessage('Please insert email and password');
    } else if (!validator.isEmail(email)) {
      console.log(1);
      setMessage('Please enter valid email');
    } else {
      setDisableButton(false);
    }
  };

  const onChangeEmail = (e) => {
    setDisableButton(false);
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setDisableButton(false);
    setPassword(e.target.value);
  };
  const submit = (e) => {
    e.preventDefault();
    validateInput(email, password);
    axios
      .post(
        '/auth/login',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data }) => {
        if (data.success) {
          window.location.href = '/dashboard';
        } else {
          setMessage(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className='wrapper'>
        <div className='container'>
          <div className='title'>
            <h1>Login</h1>
            <p>Enter your details below to continue</p>
          </div>
          <div className='card'>
            <form method='POST' action='/'>
              <input
                id='email'
                type='text'
                name='email'
                required
                autoComplete='email'
                autoFocus
                placeholder='Email'
                onChange={onChangeEmail}
              />
              <input
                id='password'
                type='password'
                name='password'
                placeholder='Password'
                required
                onChange={onChangePassword}
              />
              <p className='invalid-feedback' role='alert'>
                <strong>{message}</strong>
              </p>
              <button type='submit' onClick={submit} disabled={disableButton}>
                LOGIN
              </button>
            </form>
            <div className='signup'>Don't have an account?</div>
            <Link to='/register'>Sign up here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
