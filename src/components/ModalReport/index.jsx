import React, { useState } from 'react';
import './style.scss';
import { Button, Form, Modal, Skeleton } from 'antd';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { toast } from 'react-hot-toast';

const ModalReport = ({ postItem, pusherId, visible, handleOk, handleCancel }) => {
  const { isLoading, error } = useQuery(['memeServices.userDetail', pusherId], ({ queryKey }) =>
    memeServices.userDetail(queryKey[1]),
  );
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const sendReport = async (values) => {};
  const handleFinish = async (values) => {};
  const handleFinishFailed = (err) => {
    toast.error('Please check form value then try again');
  };

  return (
    <Modal
      title='Report Post'
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          <Button key='back' onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button key='submit' type='primary' onClick={sendReport} disabled={loading}>
            Send
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <p>Some error has occurred</p>
      ) : (
        <div className='modal-content-token'>
          <div className='modal-title'>The reason you want to report this post</div>
          <Form name='transferToken' onFinish={handleFinish} onFinishFailed={handleFinishFailed} form={form}>
            <Form.Item name='amount' rules={[{ required: true, message: 'Please enter amount' }]}>
              <div className='modal-input-token'>
                <input type='text' placeholder='Enter the reason' />
              </div>
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default ModalReport;
