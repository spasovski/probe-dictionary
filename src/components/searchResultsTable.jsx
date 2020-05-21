import React from 'react';
import SearchResultsRow from './searchResultsRow';


const SearchResultsTable = props => (
  <table id="search-results-table" className="search-results">
    <thead>
      <tr>
        <th className="search-results--probe-name">probe</th>
        <th className="search-results--probe-type">type</th>
        <th className="search-results--probe-population">population</th>
        <th className="search-results--probe-recorded-in">recorded ({props.selectedChannel === 'any' ? 'nightly' : props.selectedChannel})</th>
        <th className="search-results--probe-description">description</th>
      </tr>
    </thead>
    <tbody>
      {props.paginatedProbeKeys.map(key => props.probes[key] && (
        <SearchResultsRow
          key={key}
          selectedChannel={props.selectedChannel}
          rowData={props.probes[key]}
          probeId={key}
          doExposeProbeDetails={props.doExposeProbeDetails}
        />
      ))}
    </tbody>
  </table>
);

export default SearchResultsTable;
