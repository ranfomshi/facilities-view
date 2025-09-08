import React, { useEffect, useState } from 'react';
import './App.css';
import Group from './Group';
// Accept dataSource and setDataSource as props
function FacilitiesView({ dataSource, setDataSource }) {
  // Search state for each section
  const [facilitiesSearch, setFacilitiesSearch] = useState('');
  const [servicesSearch, setServicesSearch] = useState('');
  // Selection state management for all groups
  const [checkedMap, setCheckedMap] = useState({});
  const useCheckedState = (key, length) => checkedMap[key] || Array(length).fill(false);
  const getSetChecked = (key, length) => (newChecked) => {
    setCheckedMap(prev => ({ ...prev, [key]: newChecked }));
  };
  // dataSource and setDataSource are now passed as props from App.jsx
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

  // Collect selected items by group
  const selectedItemsByGroup = React.useMemo(() => {
    if (!data) return {};
    const result = {};
    Object.entries(data).forEach(([key, items]) => {
      const checkedArr = checkedMap[key] || [];
      const selected = items.filter((item, idx) => checkedArr[idx]);
      if (selected.length > 0) result[key] = selected;
    });
    return result;
  }, [data, checkedMap]);

  // Helper to get group label from key
  const getLabel = (key) => {
    const allGroups = [...facilitiesMain, ...facilitiesQuestion.groups, ...servicesMain, ...servicesQuestion.groups];
    const found = allGroups.find(g => g.key === key);
    return found ? found.label : key;
  };

  return (
    <div className="container" style={{display:'flex', gap:8}}>
      <div style={{flex:2}}>
   
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
      {/* Review panel on the right */}
      <div className="review-panel-sticky" style={{
        flex: 1,
        background: '#fafafa',
        border: '1px solid #eee',
        borderRadius: 8,
        padding: '1rem 1rem 1rem 1rem',
        minWidth: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'sticky',
        top: '1.5rem',
        alignSelf: 'flex-start',
        zIndex: 10
      }}>
        <h3 style={{marginTop:0, marginBottom:'0.7rem', fontSize:'1.1em', fontWeight:600}}>Review Selections</h3>
        {Object.keys(selectedItemsByGroup).length === 0 ? (
          <div style={{color:'#888', fontSize:'0.98em'}}>No items selected.</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            {Object.entries(selectedItemsByGroup).map(([key, items]) => {
              const total = data[key]?.length || 0;
              return (
                <div key={key} style={{marginBottom:0, borderBottom:'1px solid #eee', paddingBottom:'0.5em'}}>
                  <div style={{fontWeight:'bold', marginBottom:'0.2rem', fontSize:'1em', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span>{getLabel(key)}</span>
                    <span style={{color:'#888', fontWeight:'normal', fontSize:'0.95em'}}>({items.length}/{total})</span>
                  </div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'0.3em'}}>
                    {items.map(item => {
                      // Remove handler
                      const handleRemove = () => {
                        const checkedArr = checkedMap[key] || [];
                        const idx = data[key].findIndex(i => i.id === item.id);
                        if (idx !== -1) {
                          const newChecked = [...checkedArr];
                          newChecked[idx] = false;
                          setCheckedMap(prev => ({ ...prev, [key]: newChecked }));
                        }
                      };
                      return (
                        <span key={item.id} style={{
                          background:'#fff',
                          border:'1px solid #e0e0e0',
                          borderRadius:'8px',
                          padding:'1px 4px',
                          fontSize:'0.8em',
                          marginBottom:'2px',
                          color:'#333',
                          boxShadow:'0 1px 2px rgba(0,0,0,0.04)',
                          display:'inline-flex',
                          alignItems:'center',
                          gap:'0.3em',
                          position:'relative'
                        }}>
                          {item.name}
                          <button
                            onClick={handleRemove}
                            style={{
                              background:'none',
                              border:'none',
                              color:'rgba(0, 0, 0, 1)',
                              fontWeight:'bold',
                              fontSize:'1em',
                              marginLeft:'4px',
                              cursor:'pointer',
                              padding:0,
                              lineHeight:'1',
                              position:'relative',
                            }}
                            title="Remove"
                          >×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacilitiesView;
