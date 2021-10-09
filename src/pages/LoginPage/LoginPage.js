import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';

const LoginPage = () => {
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
  const onSubmit = (data) => {
    console.log(JSON.stringify(data, null, 2));
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
            <button type='submit' className='btn btn-primary' style={{width: '100%' }}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
