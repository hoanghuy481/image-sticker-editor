import React from 'react';
import pizaa from '../../../sticker/pizaa.png';
import AddPhotoFrame from '../../../sticker/AddPhotoFrame';
import AffiliateMarketingIcon from '../../../sticker/AffiliateMarketingIcon';
import ArrowDownIcon from '../../../sticker/ArrowDownIcon';
export default function StickerRow({ onStickerSelected }) {
  const stickers = [pizaa];

  return (
    <>
      <p>Choose a sticker</p>
      <div className="sticker-container">
        {stickers.map((path, i) => (
          <img
            key={i}
            onClick={() => onStickerSelected(path)}
            src={path}
            alt="sticker"
          />
        ))}
      </div>
    </>
  );
}
