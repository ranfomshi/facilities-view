import FacilitiesView from './FacilitiesView';
import FlatView from './FlatView';
import React, { useState } from 'react';
import './App.css';



function App() {
	const [selectedView, setSelectedView] = useState('facilities');

	return (
		<div className="menu-container" style={{ padding: '2rem', position:'absolute', top:0 }}>
			<h1 style={{ marginBottom: '2rem' }}>Facilities App Menu</h1>
					<div style={{ marginBottom: '2rem' }}>
						<button
							onClick={() => setSelectedView('facilities')}
							style={{
								marginRight: 12,
								padding: '8px 20px',
								fontSize: '1em',
								borderRadius: 6,
								border: '1px solid #ccc',
								background: selectedView === 'facilities' ? '#e0e0ff' : '#f9f9f9',
								cursor: 'pointer'
							}}
						>
							Facilities View
						</button>
						<button
							onClick={() => setSelectedView('flat')}
							style={{
								marginRight: 12,
								padding: '8px 20px',
								fontSize: '1em',
								borderRadius: 6,
								border: '1px solid #ccc',
								background: selectedView === 'flat' ? '#e0e0ff' : '#f9f9f9',
								cursor: 'pointer'
							}}
						>
							Flat
						</button>
					</div>
					<div style={{ marginTop: '2rem' }}>
						{selectedView === 'facilities' && <FacilitiesView />}
						{selectedView === 'flat' && <FlatView />}
					</div>
		</div>
	);
}

export default App;
