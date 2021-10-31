import AppImageEditor from '../../components/ImageEditor/AppImageEditor';
import styled from 'styled-components';
import Text from '../../components/Text';
import { useState } from 'react';
import { Card, Image, List } from 'antd';

const Wrapper = styled.div`
  padding: 20px 40px;
`;
const ImageEditorWrapper = styled.div`
  width: 80%;
  margin: 30px auto;
`;
const SampleImageWrapper = styled.div`
  width: 80%;
  margin: 30px auto;
`;
const StyledCard = styled(Card)`
  margin-bottom: 20px;

  img {
    width: 100%;
    height: 300px;
  }
`;
const listSampleImages = [
  '/images/sample1.jpg',
  '/images/sample2.jpg',
  '/images/sample3.jpg',
  '/images/sample4.jpg',
  '/images/sample5.jpg',
  '/images/sample6.jpg',
  '/images/sample8.jpg',
  '/images/sample9.jpg',
];
const MemeEditor = () => {
  const [sampleImage, setSampleImage] = useState('/images/sample1.jpg');
  return (
    <Wrapper>
      <Text size='heading-xl'>Meme Editor</Text>
      <p>Click load image to add image to editor or you can pick sample meme from the list below</p>
      <p>Double click in image to add text then download your meme when complete</p>
      <ImageEditorWrapper>
        <AppImageEditor defaultImage={sampleImage} />
      </ImageEditorWrapper>
      <Text size='heading-xl'>Sample meme</Text>
      <SampleImageWrapper>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={listSampleImages}
          renderItem={item => (
            <List.Item onClick={() => setSampleImage(item)}>
              <StyledCard
                hoverable={true}
                style={{ width: 240 }}
                cover={<Image alt='example' src={item} preview={false} />}
              />
            </List.Item>
          )}
        />,
      </SampleImageWrapper>
    </Wrapper>
  );
};

export default MemeEditor;