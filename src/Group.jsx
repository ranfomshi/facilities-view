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
  const showAll = items.length < 12;
  // Helper to truncate label
  const truncateLabel = (label) => label.length > 24 ? label.slice(0, 21) + '...' : label;

  return (
    <fieldset className="group-fieldset">
      {showAll ? (
        <>
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
        </>
      ) : (
        <>
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
          {showMore && (
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
                        <>
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
                        </>)}
                    </>
                  ) : (
                    <>
                      {showMore && (
                        <>
                          <div style={{marginTop:8}} className="group-title">All options</div>
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
                        </>
                      )}
                    </>
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

export default Group;
