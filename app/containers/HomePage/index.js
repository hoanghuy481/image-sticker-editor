/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useRef } from 'react';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ImageEditor from '@toast-ui/react-image-editor';
import { makeStyles } from '@material-ui/styles';
import 'tui-image-editor/dist/tui-image-editor.css';
import Compress from 'compress.js';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
// import huypic from 'app/containers/HomePage/pic/huypic.jpg';
import huypic from './pic/huypic.jpg';
import EmojiContainer from './emoji';

import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const icona = require('tui-image-editor/dist/svg/icon-a.svg');
const iconb = require('tui-image-editor/dist/svg/icon-b.svg');
const iconc = require('tui-image-editor/dist/svg/icon-c.svg');
const icond = require('tui-image-editor/dist/svg/icon-d.svg');

const key = 'home';

const useStyle = makeStyles(() => ({
  ImageEditor: {
    '& .tui-image-editor': {
      width: '300px',
      height: ' 90px',
      overflow: 'hidden',
    },
    '& .tui-image-editor-container': {
      margin: 0,
      padding: 0,
      boxSizing: ' border-box',
      minHeight: '300px',
      height: '100%',
      position: 'relative',
      backgroundColor: '#282828',
      overflow: 'hidden',
      letterSpacing: '0.3px',
    },
    '& .tui-colorpicker-clearfix': {
      flexWrap: 'wrap',
      display: 'flex',
      '& .tui-colorpicker-palette-hex': {
        marginTop: 0,
        order: 2,
        paddingLeft: '8px',
      },
      '& .tui-colorpicker-palette-preview': {
        overflow: 'hidden',
      },
      '& li': {
        '& .tui-colorpicker-palette-button': {
          width: '16px',
          height: '16px',
        },
      },
    },
  },
}));

export function HomePage({ username, onSubmitForm }) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const [image, setImage] = React.useState('');
  const classes = useStyle();

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (username && username.trim().length > 0) onSubmitForm();
  }, []);

  const editorRef = useRef();

  // style for theme
  const myTheme = {
    'common.bi.image': null,
    // 'common.bisize.width': '251px',
    // 'Common.bisize.height': '21px',
    'common.bisize.width': 0,
    'common.bisize.height': 0,
    'common.backgroundColor': '#fff',
    // 'header.display': 'none',
    // 'common.border': '1px solid #c1c1c1',
    'menu.backgroundColor': 'white',
    'downloadButton.backgroundColor': 'white',
    'downloadButton.borderColor': 'white',
    'downloadButton.color': 'black',
    'menu.normalIcon.path': icond,
    'menu.activeIcon.path': iconb,
    'menu.disabledIcon.path': icona,
    'menu.hoverIcon.path': iconc,
  };

  // handle add sticker
  const addSticker = path => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.addImageObject(path);
  };

  // convert base 64 to url
  const b64toBlobs = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  // handle save image url
  const saveImg = () => {
    const wrapper = editorRef.current.getInstance();
    const imgBase64 = wrapper.toDataURL();
    const imgUrl = imgBase64.split(',');
    const b64Data = imgUrl[1];
    const contentType = imgUrl[0].split(':')[1].split(';');
    const blob = b64toBlobs(b64Data, contentType[0]);
    const blobUrl = URL.createObjectURL(blob);
    setImage(blobUrl);
  };

  // handle add text
  const addText = () => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.addText('');
  };

  // handle draw image
  const getDrawingMode = () => {
    const editorInstance = editorRef.current.getInstance();
    if (editorInstance.getDrawingMode() === 'FREE_DRAWING') {
      editorInstance.stopDrawingMode();
    } else {
      editorInstance.startDrawingMode('FREE_DRAWING');
    }
  };

  // resize image
  async function resizeImageFn(file) {
    const compress = new Compress();
    const resizedImage = await compress.compress([file], {
      maxWidth: 1200, // the max width of the output image, defaults to 1920px
      maxHeight: 800, // the max height of the output image, defaults to 1920px
      resize: true, // defaults to true, set false if you do not want to resize the image width and height
    });
    const img = resizedImage[0];
    const base64str = img.data;
    const imgExt = img.ext;
    const blob = b64toBlobs(base64str, imgExt[0]);
    const blobUrl = URL.createObjectURL(blob);
    const editorInstance = editorRef.current.getInstance();
    editorInstance.loadImageFromURL(blobUrl, 'blobUrl');
  }

  // handle update image
  const handleUpdate = e => {
    const file = e.target.files[0];
    resizeImageFn(file);
  };

  const urlToObject = async imageToObject => {
    const response = await fetch(imageToObject);
    // here image is url/location of image
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    resizeImageFn(file);
  };

  useEffect(() => {
    if (!_isEmpty(huypic)) urlToObject(huypic);
  }, [huypic]);

  return (
    <>
      <div className={classes.ImageEditor}>
        <input
          type="file"
          name="file"
          id="file"
          accept="image/png, image/jpeg"
          onChange={handleUpdate}
        />
        <ImageEditor
          ref={editorRef}
          includeUI={{
            theme: myTheme,
            menu: ['resize', 'crop', 'flip', 'rotate', 'draw', 'shape', 'text'],
            initMenu: 'filter',
            uiSize: {
              width: '1100px',
              height: '800px',
            },
            menuBarPosition: 'bottom',
          }}
          cssMaxHeight={800}
          cssMaxWidth={1100}
          selectionStyle={{
            cornerSize: 10,
            rotatingPointOffset: 60,
            cornerColor: '#FFFFFF',
            cornerStrokeColor: '#FFFFFF',
            borderColor: '#FFFFFF',
          }}
          usageStatistics={false}
        />
      </div>
      <button type="button" onClick={saveImg}>
        save
      </button>
      <EmojiContainer onStickerSelected={path => addSticker(path)} />
      <button type="button" onClick={addText}>
        Add Text
      </button>
      <button type="button" onClick={getDrawingMode}>
        draw
      </button>
      <img src={image} alt="pics" />
    </>
  );
}

HomePage.propTypes = {
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
