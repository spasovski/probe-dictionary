import React from 'react';
import SelectElement from './selectElement';
import SelectVersionElement from './selectVersionElement';
import PrettyCheckbox from './prettyCheckbox';


const ProbeFilters = props => {
  const channels = [props.channels.default, ...props.channels.valid];
  return (
    <div id="probe-filters">
      <div className="probe-filter-controls">
        Filter for 
        <SelectElement
          value={props.selectedProbeConstraint}
          elementId="select_constraint"
          items={[
            {label: 'recorded', value: 'is_in'},
            {label: 'new', value: 'new_in'},
            {label: 'expired', value: 'is_expired'}
          ]}
          onChange={props.doProbeConstraintChange}
        />
        probes in
        <div id="version-selection-element"> 
          <SelectVersionElement
            value={props.selectedVersion}
            elementId="select_version"
            items={props.versions}
            onChange={props.doVersionChange}
          />
        </div>
        version on 
        <SelectElement
          value={props.selectedChannel}
          elementId="select_channel"
          onChange={props.doChannelChange}
          items={channels.map(channel => {return {label: channel, value: channel};})}
        />
        channel
      </div>
      <div id="optout-selection-element" className="release-only-control">
        <PrettyCheckbox
          isDisabled={props.selectedChannel === 'release'}
          classes={props.selectedChannel === 'release' ? ['disabled'] : []}
          doChange={props.doShowReleaseOnlyChange}
          isChecked={props.showReleaseOnly}
          label="release measurements only"
        />
      </div>
    </div>
  );
}

export default ProbeFilters;
