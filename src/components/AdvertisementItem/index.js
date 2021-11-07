import styled from 'styled-components';
import { useQuery } from 'react-query';
import memeServices from '../../services/memeServices';
import { Avatar, Image, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { privateRoute } from '../../routes';
import { AiOutlineInfoCircle } from 'react-icons/all';


const Wrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  border: 1px solid #dbdbdb;
  padding: 10px;
  border-radius: 10px;
`;
const BannerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AdHeader = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CreatorBox = styled.div`
  display: flex;
  align-items: center;

  div.creator {
    margin-left: 10px;

    > div:first-child {
      font-weight: bold;
      font-size: 18px;
    }

    div:nth-child(2) {
      color: grey;
    }
  }
`;
const AdFooter = styled.div`
  width: 100%;
  color: grey;
`;
const AdInf = styled.div`
  margin: 10px 0;
  padding-left: 10px;

  .title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
  }
`;
const AdvertisementItem = () => {
    const { data = {}, isLoading, error } = useQuery([memeServices.getAdvertisement],
      () => memeServices.getAdvertisement());
    const { data: item } = data;
    return (
      <Wrapper>
        {
          isLoading ? (<Skeleton />) : error ? <p>Some error has occurred</p> : (
            <>
              <AdHeader>
                <CreatorBox>
                  <Avatar src={item.creator.avatar || '/images/default-avatar.jpg'} alt='avatar' size={50} />
                  <div className='creator'>
                    <div>{item.creator.fullName}</div>
                    <div>has added an advertisement {moment(item.createdAt, 'YYYY-MM-DD[T]hh:mm:ssZ').fromNow()}</div>
                  </div>
                </CreatorBox>
              </AdHeader>
              <AdInf>
                <div className='title'>{item.title}</div>
                <div className='content'>{item.content}</div>
              </AdInf>
              <BannerWrapper>
                <Link to={{ pathname: item.url }} target='_blank'>
                  <Image src={item.image} preview={false} />
                </Link>
              </BannerWrapper>
              <AdFooter>
                <AiOutlineInfoCircle /> This advertisement will expire in 1 day
                <div>
                  <Link to={privateRoute.createAdvertisement.path}>
                    Create your advertisement
                  </Link>
                </div>
              </AdFooter>
            </>

          )
        }
      </Wrapper>
    );
  }
;

export default AdvertisementItem;