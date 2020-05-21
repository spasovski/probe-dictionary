import React, { Component } from 'react';
import jqParam from 'jquery-param';
import ReactMarkdown from 'react-markdown';
import ReactJSON from 'react-json-view';

import {
  getVersionRange,
  getVersionRangeFromHistory,
  getFriendlyExpiryDescriptionForHistory
} from '../lib/utils';


// Used quite heavily in getDatasetInfo() below.
const getNewTabLink = (link, label) => (
  <React.Fragment>
    <a href={link} rel="noopener noreferrer" target="_blank"><i className="fa fa-external-link" /> {label}</a>
  </React.Fragment>
);

function getFriendlyRecordingRangeForAllChannels(history) {
  let result = [];
  
  ['nightly', 'beta', 'release'].forEach(channel => {
    const rangeText = getVersionRangeFromHistory(history[channel], channel);
    if (rangeText) {
      result.push(
        <dl className="probe-version-item" key={channel}>
          <dt>{channel}</dt>
          <dd>{rangeText}</dd>
        </dl>
      );
    }
  });

  return result;
}

// ported from explore.js
function getTelemetryDashboardURL(dashType, name, type, channel, min_version='null', max_version='null') {
  if (!['dist', 'evo'].includes(dashType)) {
    console.error('wrong dashType');
    return '';
  }

  if (!['histogram', 'scalar', 'simpleMeasurements'].includes(type)) {
    return '';
  }

  // The aggregator/TMO data uses different naming schemes for non-histograms probes.
  if (type === 'scalar') {
    name = 'SCALARS_' + name.toUpperCase();
  } else if (type === 'simpleMeasurements') {
    name = 'SIMPLE_MEASURES_' + name.toUpperCase();
  }

  return `https://telemetry.mozilla.org/new-pipeline/${dashType}.html#!` +
          `max_channel_version=${channel}%252F${max_version}&`+
          `min_channel_version=${channel}%252F${min_version}&` +
          `measure=${name}` +
          `&product=Firefox`;
}


function getProbeDocumentationURI(type) {
  const sourceDocs = 'https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/';
  const links = {
    environment: sourceDocs + 'data/environment.html',
    histogram: sourceDocs + 'collection/histograms.html',
    scalar: sourceDocs + 'collection/scalars.html',
    event: sourceDocs + 'collection/events.html',
  };

  return links[type] || sourceDocs;
}

// ported from explore.js (was getDatasetInfos())
function getDatasetInfo(revisions, channelInfo, probeId, probe, channel, state) {
  const last = array => array[array.length - 1];

  // Available documentation.
  const dataDocs = {
    main_summary: 'https://docs.telemetry.mozilla.org/concepts/choosing_a_dataset.html#mainsummary',
    events: 'https://docs.telemetry.mozilla.org/datasets/batch_view/events/reference.html',
  };

  // Helper for code markup.
  const code = s => <span className="code">{s}</span>;

  const stmoLink = <a href="https://sql.telemetry.mozilla.org">STMO</a>;
  const datasetInfo = [];

  // TMO dashboard links.
  if (['histogram', 'scalar'].includes(probe.type) ||
      (probe.type === 'simpleMeasurements' && ['number', 'bool'].includes(state.details.kind))) {
    const versions = getVersionRange(revisions, channelInfo, channel, state.revisions);
    const distURL = getTelemetryDashboardURL('dist', probe.name, probe.type, channel, versions.first, versions.last);
    datasetInfo.push(getNewTabLink(distURL, 'Measurements Dashboard'));
  }

  // Use counter dashboard links.
  if ((probe.type === 'histogram') && probe.name.startsWith('USE_COUNTER2_')) {
    const base = 'https://georgf.github.io/usecounters/';
    const tokenizedName = probe.name.split('_');
    const params = {
      group: tokenizedName[2],
      kind: last(tokenizedName).toLowerCase(),
    };
    const url = base + '#' + jqParam(params);
    datasetInfo.push(getNewTabLink(url, 'Use Counter Dashboard'));
  }

  // All events are available in main_summary and the events table.
  if (probe.type === 'event') {
    const dataset = 'events';
    let datasetText = dataset;
    if (dataset in dataDocs) {
      datasetText = getNewTabLink(dataDocs[dataset], dataset);
    }
    datasetInfo.push(<React.Fragment>{stmoLink}: in the {code(datasetText)} table</React.Fragment>);
  }

  // main_summary includes all scalars.
  if (probe.type === 'scalar') {
    const dataset = 'main_summary';
    let datasetText = dataset;
    if (dataset in dataDocs) {
      datasetText = getNewTabLink(dataDocs[dataset], dataset);
    }
    const name = <React.Fragment>{code(<React.Fragment>scalar_<i>&lt;process&gt;</i>_{probe.name.toLowerCase().replace(/\./g, '_')}</React.Fragment>)}</React.Fragment>;
    datasetInfo.push(<React.Fragment>{stmoLink}: in {datasetText} as {name}</React.Fragment>);
  }

  // main_summary includes a whitelist of histograms dynamically.
  const mainSummaryHistogramWhitelist = [
    'A11Y_INSTANTIATED_FLAG',
    'A11Y_CONSUMERS',
    'CERT_VALIDATION_SUCCESS_BY_CA',
    'CYCLE_COLLECTOR_MAX_PAUSE',
    'FX_SEARCHBAR_SELECTED_RESULT_METHOD',
    'FX_URLBAR_SELECTED_RESULT_INDEX',
    'FX_URLBAR_SELECTED_RESULT_INDEX_BY_TYPE',
    'FX_URLBAR_SELECTED_RESULT_METHOD',
    'FX_URLBAR_SELECTED_RESULT_TYPE',
    'GC_MAX_PAUSE_MS',
    'GC_MAX_PAUSE_MS_2',
    'GHOST_WINDOWS',
    'HTTP_CHANNEL_DISPOSITION',
    'HTTP_PAGELOAD_IS_SSL',
    'INPUT_EVENT_RESPONSE_COALESCED_MS',
    'SEARCH_RESET_RESULT',
    'SSL_HANDSHAKE_RESULT',
    'SSL_HANDSHAKE_VERSION',
    'SSL_TLS12_INTOLERANCE_REASON_PRE',
    'SSL_TLS13_INTOLERANCE_REASON_PRE',
    'TIME_TO_DOM_COMPLETE_MS',
    'TIME_TO_DOM_CONTENT_LOADED_END_MS',
    'TIME_TO_DOM_CONTENT_LOADED_START_MS',
    'TIME_TO_DOM_INTERACTIVE_MS',
    'TIME_TO_DOM_LOADING_MS',
    'TIME_TO_FIRST_CLICK_MS',
    'TIME_TO_FIRST_INTERACTION_MS',
    'TIME_TO_FIRST_KEY_INPUT_MS',
    'TIME_TO_FIRST_MOUSE_MOVE_MS',
    'TIME_TO_FIRST_SCROLL_MS',
    'TIME_TO_LOAD_EVENT_END_MS',
    'TIME_TO_LOAD_EVENT_START_MS',
    'TIME_TO_NON_BLANK_PAINT_MS',
    'TIME_TO_RESPONSE_START_MS',
    'TOUCH_ENABLED_DEVICE',
    'TRACKING_PROTECTION_ENABLED',
    'UPTAKE_REMOTE_CONTENT_RESULT_1',
    'WEBVR_TIME_SPENT_VIEWING_IN_2D',
    'WEBVR_TIME_SPENT_VIEWING_IN_OCULUS',
    'WEBVR_TIME_SPENT_VIEWING_IN_OPENVR',
    'WEBVR_USERS_VIEW_IN',
  ];

  if ((probe.type === 'histogram') && mainSummaryHistogramWhitelist.includes(probe.name)) {
    const dataset = 'main_summary';
    let datasetText = dataset;
    if (dataset in dataDocs) {
      datasetText = getNewTabLink(dataDocs[dataset], dataset);
    }
    let name = <React.Fragment>{code(<React.Fragment>histogram_<i>&lt;process&gt;</i>_{probe.name.toLowerCase()}</React.Fragment>)}</React.Fragment>;
    datasetInfo.push(<React.Fragment>{datasetText} as {name}</React.Fragment>);
  }

  return datasetInfo;
}

function getInfoList(list) {
  // super brittle if number of release channels grows
  const releaseSort = (a, b) => {
    if (a.constructor !== String) return 0;

    if (a.indexOf('nightly') > -1) { // a is nightly
      if (b.indexOf('nightly') > -1) {
        return 0;
      }
      return -1;
    } else if (a.indexOf('beta') > -1) { // a is beta
      if (b.indexOf('nightly') > -1) {
        return 1;
      } else if (b.indexOf('beta') > -1) {
        return 0;
      }
      return -1;
    } else { // a is release
      if (b.indexOf('release') > -1) {
        return 0;
      }
      return 1;
    }
  }

  return (
    <ul className="infolist">
      {list.sort(releaseSort).map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function getExtraProbeDetails(probe, probeInfo) {
  const DETAILSLIST = [
    ['kind', 'Kind', ['histogram', 'scalar', 'environment', 'info', 'simpleMeasurements']],
    ['keyed', 'Keyed', ['histogram', 'scalar']],
    ['record_in_processes', 'Recorded in processes', ['scalar', 'event']],

    ['low', 'Low', ['histogram']],
    ['high', 'High', ['histogram']],
    ['n_buckets', 'Bucket count', ['histogram']],

    ['methods', 'Methods', ['event']],
    ['objects', 'Objects', ['event']],
    ['extra_keys', 'Extra keys', ['event']],
  ];

  const details = [];

  // ported from explore.js (was pretty())
  const getFormattedDetail = prop => {
    if (prop === undefined) {
      return '';
    } else if (prop === false) {
      return 'false';
    } else if (Array.isArray(prop)) {
      return prop.join(', ');
    }
    return prop;
  };

  for (let [property, label, types] of DETAILSLIST) {
    if (types.includes(probe.type)) {
      details.push({label, content: getFormattedDetail(probeInfo.details[property])});
    }
  }
  return details;
}

class ProbeDetails extends Component {
  // TODO: This is an imprefect solution to back button click closing the modal.
  // The next iteration should implement react-router-dom and have move localized components state.
  componentDidMount() {
    window.addEventListener('popstate', this.props.doCloseProbeDetails);
  }
  render() {
    const {revisions, channelInfo, selectedChannel, selectedProbe, doCloseProbeDetails, activeView} = this.props;

    if (!selectedProbe.id) return null;

    const probe = selectedProbe.probe;
    const channel = selectedChannel === 'any' ? 'nightly' : selectedChannel;
    const probeInfo = probe.history[channel][0]; // was 'state' in explore.js
    const populationLabel = probeInfo.optout ? 'release' : 'prerelease';
    const categoryLabels = probeInfo.details.labels;

    const expiryText = {};
    for (let [ch, history] of Object.entries(probe.history)) {
      if (!history[0].optout && (ch === 'release')) {
        continue;
      }

      expiryText[ch] = getFriendlyExpiryDescriptionForHistory(channelInfo, history, ch);
    }

    const datasetInfo = getDatasetInfo(revisions, channelInfo, selectedProbe.id, probe, channel, probeInfo);
    const bugs = probeInfo['bug_numbers'] || [];
    const parentClasses = ['probe-details--content'];
    if (activeView !== 'detail') parentClasses.push('hidden');
    let expWarning = 'This was computed from the history object in the JSON below.';
    expWarning += ' If the range seems incorrect please file a bug (link in header).';

    return (
      <React.Fragment>
        <div className={activeView !== 'detail' ? 'overlay-mask hidden' : 'overlay-mask'} onClick={doCloseProbeDetails} />
        
        <section className={parentClasses.join(' ')} id="probe-detail-view">
          
          <header className="probe-details--header">
            <div>
              <h2>{probe.name}</h2>
              <p className="probe-meta-details">
                <a href={getProbeDocumentationURI(probe.type)}>{probe.type}</a> in 
                the <span className="probe-details--highlight">{populationLabel}</span> population.
              </p>
            </div>
            <div className="probe-details--recording-range" title={expWarning}>
              {getFriendlyRecordingRangeForAllChannels(probe.history)}
            </div>
          </header>
          
          <div className="probe-details--body">

            <div className="probe-details--description">
              <ReactMarkdown source={probeInfo.description} />
            </div>

            <footer className="probe-details--footer">
              <div className="probe-details--expiry">
                {['nightly', 'beta', 'release'].map(ch => (
                  <dl className="probe-version-item probe-version-item--compact" key={ch}>
                    <dt>{ch}</dt>
                    <dd>{expiryText[ch]}</dd>
                  </dl>
                ))}
              </div>
              
              <div className="probe-details--extra-info">
                <div>
                  <dl className="probe-details--group">
                    <dt>find this probe in</dt>
                    <dd>
                      {getInfoList(datasetInfo)}
                      {getNewTabLink(`https://dxr.mozilla.org/mozilla-central/search?q=${probe.name}`, 'DXR')},{' '}
                      {getNewTabLink(`https://searchfox.org/mozilla-central/search?q=${probe.name}`, 'Searchfox')},{' '}
                      {bugs.map(bugNumber => (
                        <React.Fragment key={bugNumber}>
                        <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${bugNumber}`}>bug {bugNumber}</a>,{' '}
                        </React.Fragment>
                      ))}
                    </dd>
                  </dl>
                  
                  {probeInfo.details.record_into_store && (
                    <dl className="probe-details--group">
                      <dt>stores</dt>
                      <dd>
                        {probeInfo.details.record_into_store.join(', ')}
                      </dd>
                    </dl>
                  )}
                  
                  {probeInfo.details.record_in_processes && (
                    <dl className="probe-details--group">
                      <dt>processes</dt>
                      <dd>{probeInfo.details.record_in_processes.join(', ')}</dd>
                    </dl>
                  )}
                  
                  {probeInfo.cpp_guard && (
                    <dl className="probe-details--group">
                      <dt>CPP guard</dt>
                      <dd>{probeInfo.cpp_guard}</dd>
                    </dl>
                  )}

                  {categoryLabels && (
                    <dl className="probe-details--group">
                      <dt>labels</dt>
                      <dd>
                        {categoryLabels.join(', ')}
                      </dd>
                    </dl>
                  )}
                </div>

                <div>
                  <ul className="probe-details--list">
                    {getExtraProbeDetails(probe, probeInfo).map(detail => (
                      <li key={detail.label}>
                        {detail.label}: {detail.content}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <dl className="probe-details--group">
                <dt>JSON</dt>
                <dd><ReactJSON collapsed={true} src={probe} /></dd>
              </dl>
            </footer>

          </div>

          
          <button className="btn-overlay-close" onClick={doCloseProbeDetails} />
        </section>
      </React.Fragment>
    );
  }
}

export default ProbeDetails;
