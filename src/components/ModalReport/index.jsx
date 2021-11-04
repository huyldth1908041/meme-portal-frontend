import React, { useState } from 'react';
import './style.scss';
import { Button, Form, Modal, notification } from 'antd';
import { toast } from 'react-hot-toast';
import memeServices from '../../services/memeServices';
import { useAuthentication } from '../../hooks';

const ModalReport = ({ visible, handleOk, handleCancel, post }) => {
  const { user } = useAuthentication();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const sendReport = async () => {
    form.submit();
  };
  const handleFinish = async (values) => {
    if (!user) {
      toast.error('please login to continue');
      return;
    }
    try {
      setLoading(true);
      await memeServices.reportAPost({
        postId: post.id,
        content: values.content,
      });
      form.resetFields();
      const successNotification = {
        message: 'Report success',
        description: `Thank you for your report, we will review your report. Don't abuse this function please`
        ,
        duration: 3,
      };
      notification.success(successNotification);
    } catch (err) {
      const successNotification = {
        message: 'Report failed',
        description: `Report failed: ${err.message}`
        ,
        duration: 3,
      };
      notification.error(successNotification);
    } finally {
      setLoading(false);
    }
  };
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
      <div className='modal-content-token'>
        <div className='modal-title'>The reason you want to report this post</div>
        <Form name='transferToken' onFinish={handleFinish} onFinishFailed={handleFinishFailed} form={form}>
          <Form.Item name='content' rules={[{ required: true, message: 'Please enter report reason' }]}>
            <div className='modal-input-token'>
              <input type='text' placeholder='Enter the reason' />
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalReport;
