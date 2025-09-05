import React, { useEffect, useState } from 'react';
import './App.css';
import Group from './Group';

function FacilitiesView() {
  // Search state for each section
  const [facilitiesSearch, setFacilitiesSearch] = useState('');
  const [servicesSearch, setServicesSearch] = useState('');
  // Selection state management for all groups
  const [checkedMap, setCheckedMap] = useState({});
  const useCheckedState = (key, length) => checkedMap[key] || Array(length).fill(false);
  const getSetChecked = (key, length) => (newChecked) => {
    setCheckedMap(prev => ({ ...prev, [key]: newChecked }));
  };
  const [dataSource, setDataSource] = useState('facilities.json');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/${dataSource}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setError(`Could not load ${dataSource}`));
  }, [dataSource]);

  // Groupings and questions as per user pattern
  const [barRestaurantCamping, setBarRestaurantCamping] = useState(false);
  const [transportBusinessCatering, setTransportBusinessCatering] = useState(false);

  // Facilities groups
  const facilitiesMain = [
    { key: 'Ground facilities', label: 'Ground facilities' },
    { key: 'Parking facilities', label: 'Parking facilities' },
    { key: 'On-premise facilities', label: 'On-premise facilities' },
    { key: 'Sustainability', label: 'Sustainability' },
    { key: 'Accessibility & Safety', label: 'Accessibility & Safety' }, // Placeholder, not in JSON
  ];
  const facilitiesQuestion = {
    text: 'Do you offer Bar, Restaurant, or Camping facilities, or Equipment or Car Rental services?',
    state: barRestaurantCamping,
    setState: setBarRestaurantCamping,
    groups: [
      { key: 'Bars & Restaurants', label: 'Bars & Restaurants' },
      { key: 'Campsites', label: 'Campsites' },
      { key: 'Equipment & Car Rental', label: 'Equipment & Car Rental' },
      { key: 'Activities & Experiences nearby', label: 'Activities & Experiences nearby' },
    ],
  };

  // Services groups
  const servicesMain = [
    { key: 'Guest services', label: 'Guest Services' },
    { key: 'Children services', label: 'Children Services' },
    { key: 'Pets', label: 'Pets' }, // Placeholder, not in JSON
    { key: 'Cleaning services', label: 'Cleaning Services' },
    { key: 'Breakfast options', label: 'Breakfast options' },
  ];
  const servicesQuestion = {
    text: 'Do your provide Transport, Ticketing, Business, or Catering services?',
    state: transportBusinessCatering,
    setState: setTransportBusinessCatering,
    groups: [
      { key: 'Transport & Ticketing', label: 'Transport and ticketing' },
      { key: 'Business services', label: 'Business Services' },
      { key: 'Meals & catering', label: 'Meals and Catering' },
      { key: 'Hygiene Security', label: 'Hygiene Security' },
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
      <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:24}}>
        <span style={{fontWeight:'bold', fontSize:'1.1em'}}>Facilities View</span>
        <button onClick={() => setDataSource(dataSource === 'facilities.json' ? 'facilities-all-unpopular.json' : 'facilities.json')} style={{padding:'4px 12px', fontSize:'0.95em', borderRadius:4, border:'1px solid #ccc', background:'#f9f9f9', cursor:'pointer'}}>
          Switch to {dataSource === 'facilities.json' ? 'Unpopular Version' : 'Popular Version'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && (
        <>
          {/* Facilities Section: Only show if at least one group has results */}
          <section className="top-section facilities-section">
            <div className="top-section-header">
              <h2 className="top-section-title">Facilities</h2>
              <input
                type="text"
                className="section-search"
                placeholder="Quick search..."
                value={facilitiesSearch}
                onChange={e => setFacilitiesSearch(e.target.value)}
                style={{ marginLeft: 'auto', minWidth: 180, border: 'none', borderBottom: '2px solid #e0e0e0' }}
              />
            </div>
            {facilitiesMain.map(({ key, label }) => {
              const filtered = data[key] || [];
              return <Group key={key} title={label} items={filtered} checked={useCheckedState(key, filtered.length)} setChecked={getSetChecked(key, filtered.length)} />;
            })}
            <div className="question-row">
              <span>{facilitiesQuestion.text}</span>
              <YesNoToggle value={facilitiesQuestion.state} setValue={facilitiesQuestion.setState} />
            </div>
            {facilitiesQuestion.state === true && facilitiesQuestion.groups.map(({ key, label }) => {
              const filtered = data[key] || [];
              return <Group key={key} title={label} items={filtered} checked={useCheckedState(key, filtered.length)} setChecked={getSetChecked(key, filtered.length)} />;
            })}
          </section>

          {/* Services Section: Only show if at least one group has results */}
          <section className="top-section services-section">
            <div className="top-section-header">
              <h2 className="top-section-title">Services</h2>
            </div>
            {servicesMain.map(({ key, label }) => {
              const filtered = data[key] || [];
              return <Group key={key} title={label} items={filtered} checked={useCheckedState(key, filtered.length)} setChecked={getSetChecked(key, filtered.length)} />;
            })}
            <div className="question-row">
              <span>{servicesQuestion.text}</span>
              <YesNoToggle value={servicesQuestion.state} setValue={servicesQuestion.setState} />
            </div>
            {servicesQuestion.state === true && servicesQuestion.groups.map(({ key, label }) => {
              const filtered = data[key] || [];
              return <Group key={key} title={label} items={filtered} checked={useCheckedState(key, filtered.length)} setChecked={getSetChecked(key, filtered.length)} />;
            })}
          </section>
        </>
      )}
    </div>
  );
}

export default FacilitiesView;
