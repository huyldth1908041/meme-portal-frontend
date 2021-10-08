import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import './style.scss';

const RegisterPage = () => {
  const validationSchema = Yup.object().shape({
    phonenumber: Yup.number()
      .required('Phone number is required number')
      .positive('Phone number is positive number')
      .integer('Phone number is an integer')
      .typeError('Phone number is required number')
      .min(8, 'Phone number must be at least 8 characters')
      .max(15, 'Phone number must not exceed 15 characters'),
    fullname: Yup.string().required('Full Name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
  });
  const {
    register,
    handleSubmit,
    reset,
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
          <h1>Register</h1>
          <p>Enter your details below to continue</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group'>
            <label>Fullname</label>
            <input
              name='fullname'
              type='text'
              {...register('fullname')}
              className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.fullname?.message}</div>
          </div>
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

          <div className='form-group'>
            <label>Confirm Password</label>
            <input
              name='confirmPassword'
              type='password'
              {...register('confirmPassword')}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.confirmPassword?.message}</div>
          </div>

          <div className='form-group'>
            <label>Phone Number</label>
            <input
              name='phonenumber'
              type='number'
              {...register('phonenumber', { required: 'This is required' })}
              className={`form-control ${errors.phonenumber ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.phonenumber?.message}</div>
          </div>

          <div className='button-group'>
            <button type='submit' className='btn btn-primary'>
              Register
            </button>
            <button type='button' onClick={reset} className='btn btn-warning float-right'>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
