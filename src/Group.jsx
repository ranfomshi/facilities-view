import React, { useState } from 'react';

function Group({ title, items, checked, setChecked }) {
  // Count selected
  const selectedCount = checked.filter(Boolean).length;
  // Select all logic
  const allChecked = checked.every(Boolean);
  // Local search state for this group
  const [search, setSearch] = useState('');
  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
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
  // Helper to truncate label
  const truncateLabel = (label) => label.length > 18 ? label.slice(0, 14) + '...' : label;

  return (
    <fieldset className="group-fieldset">
      <div className="group-legend-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow:1, justifyContent:'space-between' }}>
          <span style={{ fontSize: '1.2rem', color: '#3a3a3a' }}>{title} </span>
          <div>{selectedCount > 0 ? <><span className="selected-badge">{selectedCount}</span><span style={{fontSize:'0.75em', color:'#888'}}>/</span></> :  <span style={{fontSize:'0.75em', color:'#888'}}>0/</span>}  <span style={{marginRight:8, fontSize:'0.75em', color:'#888'}}>{items.length}</span></div>
        </div>
        <button
          className="expand-collapse-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
          onClick={() => setShowMore(s => !s)}
          aria-label={showMore ? 'Collapse' : 'Expand'}
        >
          <ShowHideIcon open={showMore} />
        </button>
      </div>
      {showMore ? (
        <>
          {popular.length > 0 && (
            <div className="group-title">Most popular with guests</div>
          )}
          {popular.length > 0 && (
            <div className="options-flex" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '5px 6px',
              alignItems: 'start',
              marginBottom: '0.5em'
            }}>
              {popular.map((i, pidx) => {
                const idx = items.findIndex(it => it.id === i.id);
                const selected = checked[idx] || false;
                return (
                  <span
                    key={i.id}
                    className={`group-pill most-used${selected ? ' group-pill-selected' : ''}`}
                    title={i.name}
                    style={{
                      background: selected ? '#ffe082' : '#fffbe6',
                      border: selected ? '2px solid #dbca10' : '2px solid #dbca10',
                      borderRadius: '8px',
                      padding: '2px 4px',
                      fontSize: '0.72em',
                      fontWeight: 500,
                      color: '#3a3a3a',
                      boxSizing: 'border-box',
                      boxShadow: selected ? '0 2px 6px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.15s, border 0.15s, box-shadow 0.15s'
                    }}
                    onClick={() => {
                      const newChecked = [...checked];
                      newChecked[idx] = !selected;
                      setChecked(newChecked);
                    }}
                  >{truncateLabel(i.name)}</span>
                );
              })}
            </div>
          )}
          {other.length > 0 && (
            <>
              <div className="group-title">All options</div>
              <div className="options-flex" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '6px 8px',
                alignItems: 'start',
                marginBottom: '0.5em'
              }}>
                {other.map((i, oidx) => {
                  const idx = items.findIndex(it => it.id === i.id);
                  const selected = checked[idx] || false;
                  return (
                    <span
                      key={i.id}
                      className={`group-pill${selected ? ' group-pill-selected' : ''}`}
                      title={i.name}
                      style={{
                        background: selected ? '#ffe082' : '#f7f7fa',
                        border: selected ? '2px solid #dbca10' : '2px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '2px 6px',
                        fontSize: '0.8em',
                        fontWeight: 500,
                        color: '#3a3a3a',
                        boxSizing: 'border-box',
                  //      height:'47px',
                        boxShadow: selected ? '0 2px 6px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'background 0.15s, border 0.15s, box-shadow 0.15s'
                      }}
                      onClick={() => {
                        const newChecked = [...checked];
                        newChecked[idx] = !selected;
                        setChecked(newChecked);
                      }}
                    >{truncateLabel(i.name)}</span>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : null}
    </fieldset>
  );
}

export default Group;
