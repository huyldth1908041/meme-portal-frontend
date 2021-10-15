import { FaArrowCircleUp } from 'react-icons/all';
import styled from 'styled-components';
import { useState } from 'react';

const Button = styled.div`
  position: fixed;
  width: 100px;
  right: 0;
  bottom: 60px;
  height: 20px;
  font-size: 3rem;
  z-index: 1;
  cursor: pointer;
  color: green;
`;
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <Button>
      <FaArrowCircleUp onClick={scrollToTop}
                       style={{ display: visible ? 'inline' : 'none' }} />
    </Button>
  );
};

export default ScrollToTopButton;