import React from 'react';
import Button from './button';
import ShortURLControl from './shortURLControl';


const Navigation = ({doStatsLinkClick, doResetSearchClick, datePublished}) => {
  let dateString = '';
  if (datePublished) {
    dateString = (new Date(datePublished.lastUpdate)).toDateString();
  }

  return (
    <header className="primary-header">
      <h1><a className="primary-header-main-heading" href="/">Probe Dictionary</a></h1>      
      <nav>
        <ul className="primary-navigation-list">
          <li>
            <Button
              doClick={doResetSearchClick}
              classes={['nav-icon', 'nav-reset-search']}
              variants={['plain']} label="reset search" />
          </li>
          <li>
            <Button
              doClick={doStatsLinkClick}
              classes={['nav-icon', 'nav-stats']}
              variants={['plain']}
              label="stats"
            />
          </li>
          <li>
            <Button 
              link={{href: 'https://github.com/mozilla/probe-dictionary/issues/new', newTab: true}}
              label="file a bug"
              classes={['nav-icon', 'nav-file-bug']}
              variants={['plain']}
            />
          </li>
          <li>
            <Button
              link={{href: 'https://telemetry.mozilla.org/', newTab: true}}
              label="telemetry portal"
              classes={['nav-icon', 'nav-telemetry']}
              variants={['plain']}
            />
          </li>
          <li>
            <ShortURLControl />
          </li>
        </ul>
      </nav>
      <dl className="last-updated">
        <dt>updated</dt>
        <dd>{dateString}</dd>
      </dl>
    </header>
  );
}

export default Navigation;
