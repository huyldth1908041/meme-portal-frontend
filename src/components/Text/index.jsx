import React from 'react';
import './text.module.scss';

const ElementText = (props) => {
  const { size, html } = props;
  switch (size) {
    case 'heading-xxxl':
      return <h1 {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'heading-xxl':
      return <h2 {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'heading-xl':
      return <h3 {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'heading-l':
      return <h4 {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'heading-m':
      return <h5 {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'heading-s':
    case 'body-m':
    case 'body-s':
      return <p {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'text-m':
    case 'text-s':
      return <p {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    case 'text-link':
      return <a {...props} dangerouslySetInnerHTML={{ __html: html }} />;
    default:
      return <p className={`${'body-m'} ${'text-color-darkest-green'}`} />;
  }
};

function Text({ text, children, size, color, href, fontWeight, hoverColor }) {
  return (
    <ElementText
      size={size}
      className={`${hoverColor ? `text-hover-color-${hoverColor}` : ''} ${size} ${
        fontWeight ? `text-font-weight-${fontWeight}` : ''
      } ${color ? `text-color-${color}` : 'text-color-dark-green'}`}
      href={href}
      html={text || children}
    />
  );
}
export default Text;
