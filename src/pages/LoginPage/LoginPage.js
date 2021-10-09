import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import { useAuthentication } from '../../hooks';
import { toast } from 'react-hot-toast';
import { Link, useHistory } from 'react-router-dom';
import { privateRoute } from '../../routes';

const LoginPage = () => {
  const { login, isLoggedIn } = useAuthentication();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isLoggedIn) history.push(privateRoute.home.path);
  }, [isLoggedIn, history]);
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = async (data) => {
    const loginPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        await login(data.email, data.password);
        history.push(privateRoute.home.path);
        resolve();
      } catch (err) {
        const msg = err.message || 'wrong username or password';
        reject(msg);
      } finally {
        setLoading(false);
      }
    });
    await toast.promise(loginPromise, {
      loading: 'Logging in...',
      success: (res) => `login success !`,
      error: (err) => `login failed: ${err.toString()} !`,
    });
  };

  return (
    <div className='register-form'>
      <div className='container'>
        <div className='title'>
          <h1>Login</h1>
          <p>Enter your details below to continue</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group'>
            <label>Email</label>
            <input
              name='email'
              type='text'
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.email?.message}</div>
          </div>

          <div className='form-group'>
            <label>Password</label>
            <input
              name='password'
              type='password'
              {...register('password')}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.password?.message}</div>
          </div>
          <div className='button-group'>
            <button type='submit' className='btn btn-primary' style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging In' : 'Log In '}
            </button>
          </div>
          <div>
            New here ?
            <Link to='/register'>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
