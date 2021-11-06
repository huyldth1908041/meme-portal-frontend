import styled from 'styled-components';
import Text from '../../components/Text';
import { Button, Col, DatePicker, Form, Image, Row, Select, Skeleton, Upload } from 'antd';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import { addItemToLocalStorage, getBase64, getLocalStorageObject } from '../../utils';
import { toast } from 'react-hot-toast';
import {
  FloatLabel,
  FormItemWrapper,
  StyledSelect,
  StyledTextInput,
  SubmitBtn,
  Wrapper,
} from '../CreatePost/CreatePost';
import { useAuthentication } from '../../hooks';
import Fire from '../../services/fire';
import memeServices from '../../services/memeServices';
import { PROFILE_STORAGE_KEY } from '../../constants';
import { useHistory } from 'react-router-dom';
import { privateRoute } from '../../routes';
import moment from 'moment';
import { useQuery } from 'react-query';

const StyledDatePicker = styled(DatePicker)`
  border: 1px solid #111;
  border-radius: 7px;
  outline: none;
  height: 50px;
  padding: 0 20px;
  font-weight: 600;
  width: 100%;
`;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

const ProfileUpdate = () => {
    const history = useHistory();
    const { user } = useAuthentication();
    const userId = user.id;
    const { data = {}, isLoading, error } = useQuery(['memeServices.userDetail', userId],
      ({ queryKey }) => memeServices.userDetail(queryKey[1]));
    const { data: apiUser = {} } = data;
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    useEffect(() => {
      setImage(apiUser.avatar);
    }, [apiUser]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const handleChooseFile = ({ file }) => {
      if (ALLOWED_TYPES.includes(file.type)) {
        setFile(file);
        getBase64(file, setImage);
      } else {
        toast.error('File Type is not allowed');
      }
    };

    const onFinish = async (values) => {
      if (!image && !file) {
        toast.error('Please upload avatar image');
      }
      const updateProfilePromise = new Promise(async (resolve, reject) => {
        try {
          setLoading(true);
          let avatar = image;
          if (file) {
            avatar = await Fire.create.uploadImage(file);
          }
          const birthday = values.birthday.format('DD-MM-YYYY');
          const res = await memeServices.updateProfile(user.id, { ...values, avatar, birthday });
          const inLocalStr = getLocalStorageObject(PROFILE_STORAGE_KEY);
          const newProfile = { ...inLocalStr, ...res.data };
          addItemToLocalStorage(PROFILE_STORAGE_KEY, newProfile);
          history.push(privateRoute.profile.path);
          window.location.reload();
          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        } finally {
          setLoading(false);
        }
      });

      await toast.promise(updateProfilePromise, {
        loading: 'Updating profile...',
        success: () => `Updated profile success !!`,
        error: (err) => `Updated failed: ${err.message} !`,
      });
    };
    const onFinishFailed = () => {
      toast.error('Please check form value again!');
    };
    return (
      <Wrapper>
        <Text size='heading-xxl'>Edit Profile</Text>
        {
          isLoading ? (<Skeleton />) : error ? (<p>Some error has occured reload page</p>) : (
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              name='editProfile'
              form={form}
            >
              <Row gutter={24}>
                <Col xs={24} md={24} sm={24} lg={12} xl={12}>
                  <Text size='heading-l'>Avatar</Text>
                  <FormItemWrapper>
                    <Upload.Dragger
                      accept={ALLOWED_TYPES.join(', ')}
                      showUploadList={false}
                      customRequest={handleChooseFile}
                      className='mb-24'
                      height={180}
                    >
                      {image ? (
                        <Image src={image} height={150} preview={false} />
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
                <Col xs={24} md={24} sm={24} lg={12} xl={12}>
                  <Text size='heading-l'>Profile</Text>
                  <Row gutter={24}>
                    <Col xs={24} md={16} sm={24} lg={16} xl={16}>
                      <FormItemWrapper>
                        <Form.Item
                          name='fullName'
                          rules={[{ required: true, message: 'Full name is required' }]}
                          initialValue={apiUser.fullName}
                        >
                          <StyledTextInput
                            type='text'
                            placeholder='Enter full Name...'
                          />
                        </Form.Item>
                        <FloatLabel>Full name *</FloatLabel>
                      </FormItemWrapper>
                    </Col>
                    <Col xs={24} md={8} sm={24} lg={8} xl={8}>
                      <FormItemWrapper>
                        <Form.Item
                          name='gender'
                          rules={[{ required: true, message: 'Please select gender' }]}
                          initialValue={apiUser.gender}
                        >
                          <StyledSelect>
                            <Select.Option value={0}>Female</Select.Option>
                            <Select.Option value={1}>Male</Select.Option>
                          </StyledSelect>
                        </Form.Item>
                        <FloatLabel>Gender *</FloatLabel>
                      </FormItemWrapper>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} md={12} sm={24} lg={12} xl={12}>
                      <FormItemWrapper>
                        <Form.Item
                          name='birthday'
                          rules={[{ required: true, message: 'Please pick a date' }]}
                          initialValue={apiUser.birthday && moment(apiUser.birthday)}
                        >
                          <StyledDatePicker format='DD/MM/YYYY' />
                        </Form.Item>
                        <FloatLabel>Birthday *</FloatLabel>
                      </FormItemWrapper>
                    </Col>
                    <Col xs={24} md={12} sm={24} lg={12} xl={12}>
                      <FormItemWrapper>
                        <Form.Item
                          name='phone'
                          rules={[{ required: true, message: 'phone number is required' }]}
                          initialValue={apiUser.phone}
                        >
                          <StyledTextInput
                            type='text'
                            placeholder='Enter phone number...'
                          />
                        </Form.Item>
                        <FloatLabel>Phone *</FloatLabel>
                      </FormItemWrapper>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Form.Item>
                <SubmitBtn type='submit' disabled={loading}>
                  {loading ? 'updating' : 'Update'}
                </SubmitBtn>
              </Form.Item>
            </Form>
          )
        }
      </Wrapper>
    );
  }
;
export default ProfileUpdate;