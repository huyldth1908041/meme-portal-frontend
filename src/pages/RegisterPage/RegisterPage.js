import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from 'yup';
import './style.scss';
import { useAuthentication } from '../../hooks';
import { useHistory } from 'react-router-dom';
import { privateRoute } from '../../routes';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const { isLoggedIn, registerUser, login } = useAuthentication();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isLoggedIn) history.push(privateRoute.home.path);
  }, [isLoggedIn, history]);
  const validationSchema = Yup.object().shape({
    phonenumber: Yup.string()
      .required('Phone number is required'),
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
  const onSubmit = async (data) => {
    const registerPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const registerData = {
          fullName: data.fullname,
          username: data.email,
          phone: data.phonenumber,
          password: data.password,
        };
        const newUser = await registerUser(registerData);
        await login(data.email, data.password);
        history.push(privateRoute.home.path);
        resolve(newUser);
      } catch (err) {
        reject(err.message || "");
      } finally {
        setLoading(false);
      }
    });
    await toast.promise(registerPromise, {
      loading: 'Registering...',
      error: (msg) => `Register failed ${msg.toString()}`,
      success: 'Register Success',
    });
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
            <label>Full Name</label>
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
            <label>Phone Number</label>
            <input
              name='phonenumber'
              type='text'
              {...register('phonenumber')}
              className={`form-control ${errors.phonenumber ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.phonenumber?.message}</div>
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


          <div className='button-group'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {loading ? 'loading' : 'Register'}
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
