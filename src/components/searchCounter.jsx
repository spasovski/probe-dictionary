import React from 'react';


const SearchCounter = props => {
  const { currentPage, pageSize, probesCount } = props;
  let start = 0;
  let end = currentPage * pageSize;
  const parentClasses = ['search-results-counter'];

  if (probesCount) start = (currentPage - 1) * pageSize + 1;

  if (end > probesCount) {
    end = probesCount;
  }
  
  return (
    <div className={parentClasses.join(' ')} id="stats">
      {start} to {end} of {probesCount}
    </div>
  );
}

export default SearchCounter;
