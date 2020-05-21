import React from 'react';
import Button from './button';


async function handleShortLinkClick() {
  const url = 'https://api-ssl.bitly.com/v3/shorten?';
  // To test this locally either edit your local hosts file or
  // replace window.location.href with any url string.
  const params = `longUrl=${encodeURIComponent(window.location.href)}&access_token=48ecf90304d70f30729abe82dfea1dd8a11c4584&format=json`;

  const response = await fetch(url + params);
  if (response.status !== 200) {
    console.error(`Bitly API response error. Status Code: ${response.status}`);
    return;
  }

  const { data } = await response.json();
  if (data.url) {
    const linkInputElm = document.querySelector('#short-url-input');
    linkInputElm.value = data.url;
    document.querySelector('.short-url-control').classList.add('active');
  }
}

function handleCopy() {
  const copyText = document.querySelector('#short-url-input');
  copyText.select();
  document.execCommand('copy');
}

const ShortURLControl = ({label}) => {
  return (
    <div className="short-url-control">
      <Button
        doClick={handleShortLinkClick}
        label="get short link"
        classes={['nav-icon', 'nav-shorten']}
        variants={['plain']}
      />
      
      <div className="short-url-details">
        <input type="text" id="short-url-input" className="short-url-input" />
        <button className="btn-copy" onClick={handleCopy}>
          copy
        </button>
      </div>
    </div>
  );
}
 
export default ShortURLControl;