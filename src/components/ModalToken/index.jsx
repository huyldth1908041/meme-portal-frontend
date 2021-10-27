import React from 'react';
import './style.scss';
import OtpInput from 'react-otp-input';

const ModalToken = ({ type, user }) => {
  let content;
  const [otp, setOtp] = React.useState('');
  const handleChange = (otp) => setOtp(otp);
  switch (type) {
    case 'otp':
      content = (
        <div className='modal-content-otp'>
          <div className='modal-title'>Please enter the verification OTP sent to your mobile</div>
          <OtpInput
            value={otp}
            onChange={handleChange}
            separator={
              <span>
                <strong></strong>
              </span>
            }
            numInputs={6}
            inputStyle={{
              width: '3rem',
              height: '3rem',
              margin: '0 1rem',
              fontSize: '2rem',
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.3)',
            }}
          />
        </div>
      );
      break;
    case 'send-token':
      content = (
        <div className='modal-content-token'>
          <div className='modal-avatar'>
            <img src={user?.avatar || '/images/default-avatar.jpg'} alt='avatar' />
          </div>
          <div className='modal-user'>{user?.fullName || 'No name'}</div>
          <div className='modal-valid-token'>Valid Token: {user?.tokenBalance}</div>
          Insert tokens number you want to send
          <div className='modal-input-token'>
            <input name='content' type='text' placeholder='50 tokens' />
          </div>
          <div className='modal-input-message'>
            <input name='content' type='text' placeholder='Content transfer token' />
          </div>
        </div>
      );
      break;
    case 'up-post':
      content = <div>up-post</div>;
      break;

    default:
      break;
  }
  return content;
};

export default ModalToken;
