import React from 'react';


// Variants: 'plain'
const Button = ({classes, doClick, link, label, variants}) => {
  let classNames = 'btn';
  if (variants) {
    variants.forEach(variant => {
      classNames += ` btn-variant-${variant} `;
    })
  }
  classNames += classes && classes.length ? classes.join(' ') : '';
  
  if (link) {
    if (link.newTab) {
      return (
        <a className={classNames} href={link.href} rel="noopener noreferrer" target="_blank">{label}</a>
      );
    }
    return (
      <a className={classNames} href={link.href}>{label}</a>
    );
  }
  return (
    <button
      className={classNames}
      onClick={doClick}
    >
      {label}
    </button>
  );
}
 
export default Button;