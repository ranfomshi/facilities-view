import React, { useEffect, useState } from 'react';
import './App.css';

function Group({ title, items }) {
  const popular = items.filter(i => i.popular);
  const other = items.filter(i => !i.popular);
  const [showMore, setShowMore] = useState(false);

  return (
    <fieldset className="group-fieldset">
      <legend>{title}</legend>
      {popular.length > 0 && (
        <>
          <div className="group-title">Most popular with guests</div>
          <ul>
            {popular.map(i => (
              <li className="most-used" key={i.id}>
                <label>
                  <input type="checkbox" value={i.name} data-id={i.id} />
                  {i.name}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
      {other.length > 0 && (
        <>
          <button type="button" className="show-more-btn" onClick={() => setShowMore(s => !s)}>
            {showMore ? 'Hide options' : 'Show more options'}
          </button>
          {showMore && (
            <ul className="more-options">
              {other.map(i => (
                <li key={i.id}>
                  <label>
                    <input type="checkbox" value={i.name} data-id={i.id} />
                    {i.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </fieldset>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/facilities.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Could not load facilities.json'));
  }, []);

  return (
    <div className="container">
      <h1>Facilities & Services</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && Object.entries(data).map(([group, items]) => {
        let title = group.replace(/\d+\/\d+/, '').replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\s+/, ' ').trim();
        return <Group key={group} title={title} items={items} />;
      })}
    </div>
  );
}

export default App;
