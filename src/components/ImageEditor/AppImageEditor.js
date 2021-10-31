import 'file-saver';
import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import ImageEditor from '@toast-ui/react-image-editor';
import { useEffect, useRef } from 'react';

const theme = {
  'common.bi.image':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg',
  'common.bisize.width': '50px',
  'common.bisize.height': '50px',
};
const AppImageEditor = ({ defaultImage }) => {
  const ref = useRef();
  useEffect(() => {
    const editorInstance = ref.current.getInstance();
    editorInstance.loadImageFromURL(defaultImage, defaultImage).then(res => {
      window.scrollTo({
        top: 60,
        behavior: 'smooth',
      })
    }).catch(err => {
      console.log(err);
    });
  }, [defaultImage]);
  return (
    <>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: defaultImage,
            name: 'SampleImage',
          },
          theme: theme,
          menu: ['text'],
          initMenu: 'text',
          uiSize: {
            width: '100%',
            height: '800px',
          },
          menuBarPosition: 'bottom',

        }}
        cssMaxHeight={500}
        cssMaxWidth={700}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
        ref={ref}
      />
    </>
  );
};

export default AppImageEditor;