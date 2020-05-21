import React from 'react';


const PrettyCheckbox = ({doChange, isChecked, isDisabled, label, classes}) => {
  let classNames = 'pretty-checkbox ';
  classNames += classes && classes.length ? classes.join(' ') : '';

  return (
    <label className={classNames}>
      <input
        disabled={isDisabled}
        onChange={doChange}
        checked={isChecked}
        id="optout"
        type="checkbox"
      />
      <span className="custom-checkbox" />
      <span className="text-label">{label}</span>
    </label>
  );
}
 
export default PrettyCheckbox;