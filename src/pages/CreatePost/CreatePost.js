import styled from 'styled-components';
import Text from '../../components/Text';
import { Button, Col, Form, Image, Input, Row, Select, Upload } from 'antd';
import { useMemo, useState } from 'react';
import { getBase64 } from '../../utils';
import { toast } from 'react-hot-toast';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import PostItem from '../../components/PostItem';
import { useAuthentication } from '../../hooks';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import Fire from '../../services/fire,js';
import moment from 'moment';

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;

const StyledTextInput = styled(Input)`
  border: 1px solid #111;
  border-radius: 7px;
  outline: none;
  height: 50px;
  padding: 0 20px;
  font-weight: 600;
`;

const StyledTextArea = styled(Input.TextArea)`
  border: 1px solid #111;
  border-radius: 15px;
  padding: 10px 20px;
  font-weight: 600;
  height: 500px;
`;

const StyledSelect = styled(Select)`
  outline: none;
  height: 50px;

  .ant-select-selector, .ant-select-selection-search-input {
    height: 50px !important;
    border-radius: 7px !important;
    padding-top: 10px !important;
  }
`;

const FloatLabel = styled.label`
  position: absolute;
  top: -15px;
  left: 25px;
  background: #fff;
  padding: 0 7px;
  font-weight: 600;
`;

const FormItemWrapper = styled.div`
  margin-bottom: 40px;
  margin-top: 30px;
  position: relative;
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 50px;
  background: #cfb675;
  border-radius: 7px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  outline: none;
  transition: background-color .5s;

  &:hover, &:disabled {
    background: #907F51;
  }

`;

const CreatePost = () => {
  const { user } = useAuthentication();
  const emptyPreview = useMemo(() => ({
    id: 1,
    creator: {
      fullName: user.fullName,
      avatar: user.avatar || '/images/default-avatar.jpg',
    },
    createdAt: moment(),
    title: '',
    description: '',
    image:
      '',
    likeCounts: 0,
  }), [user]);
  const [form] = Form.useForm();
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [preview, setPreview] = useState(emptyPreview);
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
  const [loading, setLoading] = useState(false);
  const { data = {} } = useQuery(['memeServices.getCategories'], () => memeServices.getCategories());
  const { data: categories = {} } = data;
  const handleChooseFile = ({ file }) => {
    if (ALLOWED_TYPES.includes(file.type)) {
      setFile(file);
      getBase64(file, setImage);
    } else {
      toast.error('File Type is not allowed');
    }
  };

  const onFinish = async (values) => {
    if (!file) {
      toast.error('Please upload image!');
      return;
    }
    const createPostPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const uploadedImageUrl = await Fire.create.uploadImage(file);
        const res = await memeServices.createPost({ ...values, image: uploadedImageUrl });
        if (res.status === 201) {
          form.resetFields();
          setImage('');
          setFile({});
          setPreview(emptyPreview);
          resolve();
        }
      } catch (err) {
        console.error(err);
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(createPostPromise, {
      loading: 'Saving post...',
      success: () => `Saved success !!`,
      error: (err) => `Creat post failed: ${err.message} !`,
    });

  };
  const onFinishFailed = () => {
    toast.error('Check form value');
  };


  return (
    <Wrapper>
      <Text size='heading-xxxl'>Post meme</Text>
      <Row gutter={24}>
        <Col span={12}>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            name='createMeme'
            form={form}
          >
            <Text size='heading-m'>Upload File</Text>
            <FormItemWrapper>
              <Upload.Dragger
                accept={ALLOWED_TYPES.join(', ')}
                showUploadList={false}
                customRequest={handleChooseFile}
                className='mb-24'
                height={160}
              >
                {image ? (
                  <Image src={image} height={120} preview={false} />
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
            <Text size='heading-m'>Information</Text>
            <Row gutter={24}>
              <Col span={16}>
                <FormItemWrapper>
                  <Form.Item
                    name='title'
                    rules={[{ required: true, message: 'Title is required' }]}
                  >
                    <StyledTextInput
                      type='text'
                      placeholder='Enter meme title...'
                      onChange={e => setPreview({ ...preview, title: e.target.value })}
                    />
                  </Form.Item>
                  <FloatLabel>Title *</FloatLabel>
                </FormItemWrapper>
              </Col>
              <Col span={8}>
                <FormItemWrapper>
                  <Form.Item
                    name='categoryId'
                    rules={[{ required: true, message: 'Category is required' }]}
                  >
                    <StyledSelect
                      placeholder='Categories'
                    >
                      {
                        categories.length &&
                        categories.map(cat => <Select.Option value={cat.id} key={cat.id}>{cat.name}</Select.Option>)
                      }
                    </StyledSelect>
                  </Form.Item>
                  <FloatLabel>Category *</FloatLabel>
                </FormItemWrapper>
              </Col>
            </Row>
            <FormItemWrapper>
              <Form.Item
                name='description'
              >
                <StyledTextArea
                  placeholder='Enter Description...'
                  rows={4}
                  onChange={e => setPreview({ ...preview, description: e.target.value })}
                />
              </Form.Item>
              <FloatLabel>Description *</FloatLabel>
            </FormItemWrapper>
            <FormItemWrapper>
              <Form.Item>
                <SubmitBtn type='submit' disabled={loading}>
                  {loading ? 'Saving...' : 'Create'}
                </SubmitBtn>
              </Form.Item>
            </FormItemWrapper>
          </Form>
        </Col>
        <Col span={12}>
          <div style={{ paddingLeft: 20 }}>
            <Text size='heading-m'>Preview</Text>
          </div>
          <PostItem item={{ ...preview, image: image }} />
        </Col>
      </Row>
    </Wrapper>
  );
};


export default CreatePost;