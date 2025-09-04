

import React, { useEffect, useState } from 'react';
import './App.css';

function Group({ title, items, checked, setChecked }) {
  // Count selected
  const selectedCount = checked.filter(Boolean).length;
  // Select all logic
  const allChecked = checked.every(Boolean);
  const popularIndexes = items.map((i, idx) => i.popular ? idx : null).filter(idx => idx !== null);
  const allPopularChecked = popularIndexes.length > 0 && popularIndexes.every(idx => checked[idx]);
  const handleSelectAllPopular = () => {
    const newChecked = [...checked];
    const shouldCheck = !allPopularChecked;
    popularIndexes.forEach(idx => {
      newChecked[idx] = shouldCheck;
    });
    setChecked(newChecked);
  };
  const handleSelectAll = () => {
    setChecked(Array(items.length).fill(!allChecked));
  };
  // Icon SVG for show/hide
  const ShowHideIcon = ({ open }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ verticalAlign: 'middle' }}>
      <path d={open ? "M6 12l4-4 4 4" : "M6 8l4 4 4-4"} stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const popular = items.filter(i => i.popular);
  const other = items.filter(i => !i.popular);
  const [showMore, setShowMore] = useState(false);
  const showAll = items.length < 12;
  // ...existing code...

  // Helper to truncate label
  const truncateLabel = (label) => label.length > 24 ? label.slice(0, 21) + '...' : label;

  return (
    <fieldset className="group-fieldset">
      <legend className="group-legend-row">
        <span>
          {title} <span className="section-count">({items.length})</span>
          {selectedCount > 0 ? <span className="selected-badge">{selectedCount}</span> : null}
        </span>
        <div className="legend-actions">
          <button
            type="button"
            className={`select-all-btn${allChecked ? ' active' : ''}`}
            onClick={handleSelectAll}
            title={allChecked ? 'Deselect all options' : 'Select all options'}
          >
            Select All
          </button>
{popular.length > 0 &&  <button
                  type="button"
                  className={`select-all-popular-btn${allPopularChecked ? ' active' : ''}`}
                  onClick={handleSelectAllPopular}
                  title={allPopularChecked ? 'Deselect all popular options' : 'Select all popular options'}
                >
                  Select Popular
                </button>}
         
          {!showAll && (
            <button
              type="button"
              className="show-more-icon-btn"
              onClick={() => setShowMore(s => !s)}
              aria-label={showMore ? 'Hide options' : 'Show more options'}
            >
              <ShowHideIcon open={showMore} />
            </button>
          )}
        </div>
      </legend>
      {showAll ? (
        <div className="options-flex">
          {items.map((i, idx) => (
            <div className={i.popular ? "most-used option-item" : "option-item"} key={i.id}>
              <label className="custom-checkbox-label" title={i.name}>
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  value={i.name}
                  data-id={i.id}
                  checked={checked[idx] || false}
                  onChange={e => {
                    const newChecked = [...checked];
                    newChecked[idx] = e.target.checked;
                    setChecked(newChecked);
                  }}
                />
                <span className="custom-checkbox-box">
                  {checked[idx] && (
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <polyline points="4,8 7,12 12,4" style={{ fill: 'none', stroke: '#000', strokeWidth: 2 }} />
                    </svg>
                  )}
                </span>
                <span title={i.name}>{truncateLabel(i.name)}</span>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <>
          {popular.length > 0 && (
            <>
              <div className="group-title">
                Most popular with guests
                
              </div>
              <div className="options-flex">
                {popular.map((i, pidx) => {
                  const idx = items.findIndex(it => it.id === i.id);
                  return (
                    <div className="most-used option-item" key={i.id}>
                      <label className="custom-checkbox-label" title={i.name}>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          value={i.name}
                          data-id={i.id}
                          checked={checked[idx] || false}
                          onChange={e => {
                            const newChecked = [...checked];
                            newChecked[idx] = e.target.checked;
                            setChecked(newChecked);
                          }}
                        />
                        <span className="custom-checkbox-box">
                          {checked[idx] && (
                            <svg width="16" height="16" viewBox="0 0 16 16">
                              <polyline points="4,8 7,12 12,4" style={{ fill: 'none', stroke: '#000', strokeWidth: 2 }} />
                            </svg>
                          )}
                        </span>
                        <span title={i.name}>{truncateLabel(i.name)}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {other.length > 0 && (
            <>
              {/* If no popular options, show first 12 by default, rest on show more */}
              {popular.length === 0 ? (
                <>
                  <div className="options-flex">
                    {other.slice(0, 12).map((i, oidx) => {
                      const idx = items.findIndex(it => it.id === i.id);
                      return (
                        <div className="option-item" key={i.id}>
                          <label className="custom-checkbox-label" title={i.name}>
                            <input
                              type="checkbox"
                              className="custom-checkbox"
                              value={i.name}
                              data-id={i.id}
                              checked={checked[idx] || false}
                              onChange={e => {
                                const newChecked = [...checked];
                                newChecked[idx] = e.target.checked;
                                setChecked(newChecked);
                              }}
                            />
                            <span className="custom-checkbox-box">
                              {checked[idx] && (
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                  <polyline points="4,8 7,12 12,4" style={{ fill: 'none', stroke: '#000', strokeWidth: 2 }} />
                                </svg>
                              )}
                            </span>
                            <span title={i.name}>{truncateLabel(i.name)}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {other.length > 12 && showMore && (
                    <div className="options-flex">
                      {other.slice(12).map((i, oidx) => {
                        const idx = items.findIndex(it => it.id === i.id);
                        return (
                          <div className="option-item" key={i.id}>
                            <label className="custom-checkbox-label" title={i.name}>
                              <input
                                type="checkbox"
                                className="custom-checkbox"
                                value={i.name}
                                data-id={i.id}
                                checked={checked[idx] || false}
                                onChange={e => {
                                  const newChecked = [...checked];
                                  newChecked[idx] = e.target.checked;
                                  setChecked(newChecked);
                                }}
                              />
                              <span className="custom-checkbox-box">
                                {checked[idx] && (
                                  <svg width="16" height="16" viewBox="0 0 16 16">
                                    <polyline points="4,8 7,12 12,4" style={{ fill: 'none', stroke: '#000', strokeWidth: 2 }} />
                                  </svg>
                                )}
                              </span>
                              <span title={i.name}>{truncateLabel(i.name)}</span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {showMore && (
                    <div className="options-flex">
                      {other.map((i, oidx) => {
                        const idx = items.findIndex(it => it.id === i.id);
                        return (
                          <div className="option-item" key={i.id}>
                            <label className="custom-checkbox-label" title={i.name}>
                              <input
                                type="checkbox"
                                className="custom-checkbox"
                                value={i.name}
                                data-id={i.id}
                                checked={checked[idx] || false}
                                onChange={e => {
                                  const newChecked = [...checked];
                                  newChecked[idx] = e.target.checked;
                                  setChecked(newChecked);
                                }}
                              />
                              <span className="custom-checkbox-box">
                                {checked[idx] && (
                                  <svg width="16" height="16" viewBox="0 0 16 16">
                                    <polyline points="4,8 7,12 12,4" style={{ fill: 'none', stroke: '#000', strokeWidth: 2 }} />
                                  </svg>
                                )}
                              </span>
                              <span title={i.name}>{truncateLabel(i.name)}</span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </fieldset>
  );
}

function App() {
  // Selection state management for all groups
  const [checkedMap, setCheckedMap] = useState({});
  const useCheckedState = (key, length) => checkedMap[key] || Array(length).fill(false);
  const getSetChecked = (key, length) => (newChecked) => {
    setCheckedMap(prev => ({ ...prev, [key]: newChecked }));
  };
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/facilities.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Could not load facilities.json'));
  }, []);

  // Groupings and questions as per user pattern
  const [barRestaurantCamping, setBarRestaurantCamping] = useState(null);
  const [transportBusinessCatering, setTransportBusinessCatering] = useState(null);

  // Facilities groups
  const facilitiesMain = [
    { key: 'Ground facilities0/46', label: 'Ground facilities' },
    { key: 'Parking facilities1/15', label: 'Parking facilities' },
    { key: 'On-premise facilities1/27', label: 'On-premise facilities' },
    { key: 'Sustainability6/20', label: 'Sustainability' },
    { key: 'Accessibility & Safety', label: 'Accessibility & Safety' }, // Placeholder, not in JSON
  ];
  const facilitiesQuestion = {
    text: 'Do you offer Bar, Restaurant, or Camping facilities, or Equipment or Car Rental services?',
    state: barRestaurantCamping,
    setState: setBarRestaurantCamping,
    groups: [
      { key: 'Bars & Restaurants0/8', label: 'Bars & Restaurants' },
      { key: 'Campsites0/6', label: 'Campsites' },
      { key: 'Equipment0/14', label: 'Equipment & Car Rental' },
      { key: 'Activities and Experiences3/93', label: 'Activities & Experiences nearby' },
    ],
  };

  // Services groups
  const servicesMain = [
    { key: 'Guest services3/18', label: 'Guest Services' },
    { key: 'Children services1/13', label: 'Children Services' },
    { key: 'Pets', label: 'Pets' }, // Placeholder, not in JSON
    { key: 'Cleaning services2/9', label: 'Cleaning Services' },
    { key: 'Breakfast options1/14', label: 'Breakfast options' },
  ];
  const servicesQuestion = {
    text: 'Do your provide Transport, Ticketing, Business, or Catering services?',
    state: transportBusinessCatering,
    setState: setTransportBusinessCatering,
    groups: [
      { key: 'Transport & Ticketing0/9', label: 'Transport and ticketing' },
      { key: 'Business services2/13', label: 'Business Services' },
      { key: 'Meals & catering0/23', label: 'Meals and Catering' },
      { key: 'Hygiene Security2/29', label: 'Hygiene Security' },
    ],
  };

  // Yes/No toggle button group
  const YesNoToggle = ({ value, setValue }) => (
    <div className="yesno-toggle">
      <button type="button" className={value === true ? 'active' : ''} onClick={() => setValue(true)}>Yes</button>
      <button type="button" className={value === false ? 'active' : ''} onClick={() => setValue(false)}>No</button>
    </div>
  );

  return (
    <div className="container">
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && (
        <>
          <section className="top-section facilities-section">
            <div className="top-section-header">
              <h2 className="top-section-title">FACILITIES</h2>
            </div>
            {facilitiesMain.map(({ key, label }) =>
              data[key] ? (
                <Group
                  key={key}
                  title={label}
                  items={data[key]}
                  checked={useCheckedState(key, data[key].length)}
                  setChecked={getSetChecked(key, data[key].length)}
                />
              ) : null
            )}
            <div className="question-row">
              <span>{facilitiesQuestion.text}</span>
              <YesNoToggle value={facilitiesQuestion.state} setValue={facilitiesQuestion.setState} />
            </div>
            {facilitiesQuestion.state === true && facilitiesQuestion.groups.map(({ key, label }) =>
              data[key] ? (
                <Group
                  key={key}
                  title={label}
                  items={data[key]}
                  checked={useCheckedState(key, data[key].length)}
                  setChecked={getSetChecked(key, data[key].length)}
                />
              ) : null
            )}
          </section>
          <section className="top-section services-section">
            <div className="top-section-header">
              <h2 className="top-section-title">SERVICES</h2>
            </div>
            {servicesMain.map(({ key, label }) =>
              data[key] ? (
                <Group
                  key={key}
                  title={label}
                  items={data[key]}
                  checked={useCheckedState(key, data[key].length)}
                  setChecked={getSetChecked(key, data[key].length)}
                />
              ) : null
            )}
            <div className="question-row">
              <span>{servicesQuestion.text}</span>
              <YesNoToggle value={servicesQuestion.state} setValue={servicesQuestion.setState} />
            </div>
            {servicesQuestion.state === true && servicesQuestion.groups.map(({ key, label }) =>
              data[key] ? (
                <Group
                  key={key}
                  title={label}
                  items={data[key]}
                  checked={useCheckedState(key, data[key].length)}
                  setChecked={getSetChecked(key, data[key].length)}
                />
              ) : null
            )}

          </section>
        </>
      )}
    </div>
  );
}

export default App;
