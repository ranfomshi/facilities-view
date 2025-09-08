import FacilitiesView from './FacilitiesView';
import FlatView from './FlatView';
import React, { useState } from 'react';
import './App.css';



function App() {

		const [selectedView, setSelectedView] = useState('facilities');
		const [dataSource, setDataSource] = useState('facilities.json');

	return (
		<div className="menu-container" style={{ padding: '2rem', position:'absolute', top:0 }}>
				
					<div style={{ marginBottom: '2rem' }}>	<button onClick={() => setDataSource(dataSource === 'facilities.json' ? 'facilities-all-unpopular.json' : 'facilities.json')} >
						Switch to {dataSource === 'facilities.json' ? 'Unpopular Version' : 'Popular Version'}
					</button>
						<button
							onClick={() => setSelectedView('facilities')}
					
						>
							Grouped View
						</button>
						<button
							onClick={() => setSelectedView('flat')}
				
						>
							Flat
						</button>
					</div>
					<div style={{ marginTop: '2rem' }}>
					{selectedView === 'facilities' && <FacilitiesView dataSource={dataSource} setDataSource={setDataSource} />}
						{selectedView === 'flat' && <FlatView />}
					</div>
		</div>
	);
}

export default App;
