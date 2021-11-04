import {
  FloatLabel,
  FormItemWrapper,
  StyledTextInput,
  SubmitBtn,
  Wrapper,
} from '../CreatePost/CreatePost';
import Text from '../../components/Text';
import { Button, Col, Form, Image, Input, Modal, notification, Row, Upload } from 'antd';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getBase64 } from '../../utils';
import Fire from '../../services/fire';
import memeServices from '../../services/memeServices';
import OtpInput from 'react-otp-input';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const CreateAdvertisement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [visible, setVisible] = useState(false);
  const [transactionId, setTransactionId] = useState(0);
  const [otp, setOtp] = useState('');
  const onFinishFailed = () => {
    toast.error('please check form value then try again');
  };
  const onFinish = async (values) => {
    if (!file) {
      toast.error('Please upload image!');
      return;
    }
    const createAdvertisementPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const uploadedImageUrl = await Fire.create.uploadImage(file);
        const resp = await memeServices.createAdvertisement({ ...values, image: uploadedImageUrl });
        const txId = resp.data.id;
        setTransactionId(+txId);
        form.resetFields();
        setImage('');
        setFile({});
        setVisible(true)
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(createAdvertisementPromise, {
      loading: 'Saving advertisement...',
      success: () => `Saved success !!`,
      error: (err) => `Creat advertisement failed: ${err.message} !`,
    });

  };
  const handleChooseFile = ({ file }) => {
    if (ALLOWED_TYPES.includes(file.type)) {
      setFile(file);
      getBase64(file, setImage);
    } else {
      toast.error('File Type is not allowed');
    }
  };

  function handleOk() {
    setVisible(false);
  }

  function handleCancel() {
    setVisible(false);
  }

  const handleVerifyTransaction = async () => {
    if (otp.length < 6) {
      toast.error('please enter otp');
      return;
    }
    if (transactionId === 0) {
      toast.error('transaction not found');
      return;
    }
    const verifyTxPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        await memeServices.verifyTransaction({
          txId: transactionId,
          verifyCode: otp,
        });
        handleOk();
        const args = {
          message: 'Process transaction success',
          description: `Your advertisement is sent for admin to verify, we'll return token if your advertisement is not approved`,
          duration: 2,
        };
        notification.success(args);
        setOtp('')
        resolve();
      } catch (err) {
        reject(err);
        const args = {
          message: 'Process transaction failed',
          description: `${err.message}`,
          duration: 2,
        };
        notification.error(args);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(verifyTxPromise, {
      loading: 'processing...',
      error: (err) => `error: ${err.message}`,
      success: 'Transaction completed successfully',
    });
  };

  return (
    <Wrapper>
      <Text size='heading-xxl'>Create advertisement</Text>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        name='createAdvertisement'
        form={form}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Text size='heading-l'>Advertisement banner</Text>
            <FormItemWrapper>
              <Upload.Dragger
                accept={ALLOWED_TYPES.join(', ')}
                showUploadList={false}
                customRequest={handleChooseFile}
                className='mb-24'
                height={220}
              >
                {image ? (
                  <Image src={image} height={190} preview={false} />
                ) : (
                  <div className='flex-row justify-content-center'>
                    <Text size='body-m'>
                      PNG, JPG, WEBP or GIF. Max 10mb.
                    </Text>
                    <Button icon={<AiOutlineCloudUpload style={{ marginRight: '10px' }} />}>
                      Choose File
                    </Button>
                  </div>
                )}
              </Upload.Dragger>
            </FormItemWrapper>
          </Col>
          <Col span={12}>
            <Text size='heading-l'>Advertisement Information</Text>
            <Row gutter={24}>
              <Col span={12}>
                <FormItemWrapper>
                  <Form.Item
                    name='title'
                    rules={[{ required: true, message: 'Title is required' }]}
                  >
                    <StyledTextInput
                      type='text'
                      placeholder='Enter title...'
                    />
                  </Form.Item>
                  <FloatLabel>Title *</FloatLabel>
                </FormItemWrapper>
              </Col>
              <Col span={12}>
                <FormItemWrapper>
                  <Form.Item
                    name='url'
                    rules={[{ required: true, message: 'Please enter url' }]}
                  >
                    <StyledTextInput
                      type='text'
                      placeholder='Enter url...'
                    />
                  </Form.Item>
                  <FloatLabel>Url *</FloatLabel>
                </FormItemWrapper>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItemWrapper>
                  <Form.Item
                    name='content'
                  >
                    <Input.TextArea rows={3} placeholder='enter some description if you have' />
                  </Form.Item>
                  <FloatLabel>Content</FloatLabel>
                </FormItemWrapper>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item>
          <SubmitBtn type='submit' disabled={loading}>
            {loading ? 'Saving' : 'Create'}
          </SubmitBtn>
        </Form.Item>
      </Form>
      <Modal
        title='Verify transaction code'
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='submit' type='primary' onClick={handleVerifyTransaction} disabled={loading}>
            {loading ? 'Verifying...' : 'Send'}
          </Button>,
        ]}>
        <>
          <div className='modal-title'>
            Please enter the verification OTP sent to your email:
          </div>
          <OtpInput
            value={otp}
            onChange={(values) => setOtp(values)}
            separator={<span><strong></strong></span>}
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
        </>
      </Modal>
    </Wrapper>
  );
};

export default CreateAdvertisement;