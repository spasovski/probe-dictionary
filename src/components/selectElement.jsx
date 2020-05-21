import React from 'react';


const SelectElement = props => (
  <select
    id={props.elementId}
    value={props.value}
    onChange={props.onChange}
  >
    {props.items.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
  </select>
);

export default SelectElement;
