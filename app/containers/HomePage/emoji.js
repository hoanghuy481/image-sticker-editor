import makeStyles from '@material-ui/core/styles/makeStyles';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
import EmojiTransportationOutlinedIcon from '@material-ui/icons/EmojiTransportationOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import PetsOutlinedIcon from '@material-ui/icons/PetsOutlined';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
// menu icon
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import SportsSoccerOutlinedIcon from '@material-ui/icons/SportsSoccerOutlined';
import AtomPaper from 'components/Paper';
import AtomTab from 'components/Tab';
import AtomTabs from 'components/Tabs';
import { decode } from 'he'; // thư viện nodejs có sẵn để decode html entities
// import _trim from 'lodash/trim';
import PropTypes from 'prop-types';
import React from 'react';
import emojiMenu from './json/emoji/emojiMenu';
import jsonEmoji1 from './json/emoji/jsonEmoji_1';
import jsonEmoji2 from './json/emoji/jsonEmoji_2';
import jsonEmoji3 from './json/emoji/jsonEmoji_3';
import jsonEmoji4 from './json/emoji/jsonEmoji_4';
import jsonEmoji5 from './json/emoji/jsonEmoji_5';
import jsonEmoji6 from './json/emoji/jsonEmoji_6';
import jsonEmoji7 from './json/emoji/jsonEmoji_7';
import jsonEmoji8 from './json/emoji/jsonEmoji_8';
// data emoji

const cdn = {
  default: `http://t-newsfeed.hahalolo.com/public/image/`,
  emoji: `http://t-newsfeed.hahalolo.com/public/image/emoji/`,
  sticker: 'https://media-cdn.hahalolo.com/',
};
function getMediaCdn({ type, name }) {
  return cdn[type] + name;
}

const useStyles = makeStyles(theme => ({
  attachList: {
    '--font-emoji':
      'apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol',
    flex: '1 1 auto',
    display: 'block',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    padding: '.25rem',
    backgroundColor: theme.palette.type === 'dark' ? '#212121' : '#FAFAFB',
  },
  attachItem: {
    display: 'inline-block',
    width: 'calc(100% / 8)',
    padding: '0.25rem',
    fontFamily: 'var(--font-emoji)',
    fontSize: '1.25rem',
    textAlign: 'center',
    lineHeight: 0,
    borderRadius: '0.25rem',
    cursor: 'pointer',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  tabItem: {
    flex: '1 1 auto',
    minWidth: 'auto',
    padding: '.25rem .5rem',
    '& svg': {
      width: 18,
    },
  },
  tabMenu: {},
}));

/* get menu icon */
function GetIcon(props) {
  const icons = {
    1: <SentimentSatisfiedOutlinedIcon />,
    2: <PetsOutlinedIcon />,
    3: <RestaurantOutlinedIcon />,
    4: <SportsSoccerOutlinedIcon />,
    5: <EmojiTransportationOutlinedIcon />,
    6: <FavoriteBorderOutlinedIcon />,
    7: <EmojiObjectsOutlinedIcon />,
    8: <FlagOutlinedIcon />,
  };
  return icons[props.index];
}

/* get list emoji */
function EmojiList(props) {
  const classes = useStyles();
  const data = {
    1: jsonEmoji1,
    2: jsonEmoji2,
    3: jsonEmoji3,
    4: jsonEmoji4,
    5: jsonEmoji5,
    6: jsonEmoji6,
    7: jsonEmoji7,
    8: jsonEmoji8,
  };
  const handleClick = (e, item) => {
    console.log(getMediaCdn({ type: 'emoji', name: item.image }));
    props.onStickerSelected(getMediaCdn({ type: 'emoji', name: item.image }));
  };

  return data[props.type + 1].map(item => (
    <div
      className={classes.attachItem}
      key={item.code_decimal}
      onClick={e => handleClick(e, item)}
      onKeyDown={e => handleClick(e, item)}
      role="button"
      tabIndex={0}
    >
      <img
        alt={decode(item.code_decimal)}
        src={getMediaCdn({ type: 'emoji', name: item.image })}
        title={item.title}
        loading="lazy"
      />
    </div>
  ));
}

/* tab panel: danh sách list item */
function TabPanel(props) {
  const classes = useStyles();
  const { value, onStickerSelected, ...other } = props;

  return (
    <div className={classes.attachList} role="tabpanel" {...other}>
      <EmojiList onStickerSelected={onStickerSelected} type={value} />
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  onStickerSelected: PropTypes.any,
};

/* phần nội dung bao gồm tab panel và tab menu */
function Content(props) {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <TabPanel
        value={value}
        index={value}
        onStickerSelected={props.onStickerSelected}
      />
      <AtomPaper>
        <AtomTabs
          className={classes.tabMenu}
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="Emoji menu"
        >
          {emojiMenu.map(item => (
            <AtomTab
              className={classes.tabItem}
              icon={<GetIcon index={item.menu} />}
              key={item.menu}
              title={item.title}
            />
          ))}
        </AtomTabs>
      </AtomPaper>
    </>
  );
}

Content.propTypes = {
  onStickerSelected: PropTypes.any,
};

export default function EmojiContainer(props) {
  return <Content onStickerSelected={props.onStickerSelected} />;
}

EmojiContainer.propTypes = {
  onStickerSelected: PropTypes.any,
};
