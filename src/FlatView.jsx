import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

const { Option } = Select;

function FlatView() {
    const [dataSource, setDataSource] = useState('facilities.json');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [checkedMap, setCheckedMap] = useState({});
    const [quickSearch, setQuickSearch] = useState('');

    useEffect(() => {
        fetch(`/${dataSource}`)
            .then(r => r.json())
            .then(setData)
            .catch(() => setError(`Could not load ${dataSource}`));
    }, [dataSource]);

    const flatItems = React.useMemo(() => {
        if (!data) return [];
        let items = [];
        Object.entries(data).forEach(([category, arr]) => {
            arr.forEach(item => {
                items.push({ ...item, category });
            });
        });
        return items;
    }, [data]);

    const allCategories = React.useMemo(() => {
        if (!data) return [];
        return Object.keys(data);
    }, [data]);

    const filteredItems = flatItems.filter(item => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const matchesSearch = item.name.toLowerCase().includes(quickSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCheck = (id) => {
        setCheckedMap(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const selectedItemsByCategory = React.useMemo(() => {
        const selected = flatItems.filter(item => checkedMap[item.id]);
        const grouped = {};
        selected.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
        });
        return grouped;
    }, [flatItems, checkedMap]);

    return (
        <div className="container" style={{display:'flex', gap:8}}>
            <div style={{flex:2}}>
                <div style={{
  position: 'sticky',
  top: '1.5rem',
  zIndex: 11,
  background: '#fff',
  padding: '0.5rem 0',
  marginBottom: 24,
}}>
                    <div style={{display:'flex', alignItems:'center', gap:16}}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ minWidth: 220 }}
                            placeholder="Filter by category"
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                        >
                            {allCategories.map(cat => (
                                <Option key={cat} value={cat}>{cat}</Option>
                            ))}
                        </Select>
                        <input
                            type="text"
                            value={quickSearch}
                            onChange={e => setQuickSearch(e.target.value)}
                            placeholder="Quick search..."
                            style={{ minWidth: 160, padding: '4px 8px', border: 'none', borderBottom: '2px solid #e0e0e0', fontSize: '1em', outline: 'none' }}
                        />
                    </div>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {!data ? (
                    <Spin />
                ) : (
                    <div style={{marginTop:24, maxHeight:'60vh', overflowY:'auto', border:'1px solid #eee', borderRadius:8}}>
                        <table style={{width:'100%', borderCollapse:'collapse'}}>
                            {/* <thead>
                                <tr style={{background:'#f0f0f0'}}>
                                    <th style={{textAlign:'left', padding:'8px', borderBottom:'1px solid #ddd'}}></th>
                                    <th style={{textAlign:'left', padding:'8px', borderBottom:'1px solid #ddd'}}>Item</th>
                                    <th style={{textAlign:'left', padding:'8px', borderBottom:'1px solid #ddd'}}>Category</th>
                                </tr>
                            </thead> */}
                            <tbody>
                                {filteredItems.map(item => (
                                    <tr
                                        key={item.id}
                                        className={`flatview-row${checkedMap[item.id] ? ' flatview-row-selected' : ''}`}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onClick={() => handleCheck(item.id)}
                                    >
                                        <td style={{padding:'8px', borderBottom:'1px solid #eee'}}>
                                            <input
                                                type="checkbox"
                                                checked={!!checkedMap[item.id]}
                                                onChange={e => { e.stopPropagation(); handleCheck(item.id); }}
                                            />
                                        </td>
                                        <td style={{padding:'4px', borderBottom:'1px solid #eee'}}>{item.name}</td>
                                        <td style={{padding:'4px', borderBottom:'1px solid #eee', fontSize:'smaller', fontWeight:'bold'}}>{item.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Review panel on the right - pill style with remove button */}
            <div className="review-panel-sticky" style={{
                flex: 1,
                // background: '#fafafa',
                // border: '1px solid #eee',
                borderRadius: 8,
                padding: '1rem 1rem 1rem 1rem',
                minWidth: 220,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'sticky',
                top: '1.5rem',
                alignSelf: 'flex-start',
                zIndex: 10,
                transform:'translateY(95px)'
            }}>
                <h3 style={{marginTop:0, marginBottom:'0.7rem', fontSize:'1.1em', fontWeight:600}}>Selections</h3>
                {Object.keys(selectedItemsByCategory).length === 0 ? (
                    <div style={{color:'#888', fontSize:'0.98em'}}>No items selected.</div>
                ) : (
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        {Object.entries(selectedItemsByCategory).map(([category, items]) => {
                            return (
                                <div key={category} style={{marginBottom:0, borderBottom:'1px solid #eee', paddingBottom:'0.5em'}}>
                                    <div style={{fontWeight:'bold', marginBottom:'0.2rem', fontSize:'1em', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <span>{category}</span>
                                    </div>
                                    <div style={{display:'flex', flexWrap:'wrap', gap:'0.3em'}}>
                                        {items.map(item => {
                                            const handleRemove = () => {
                                                setCheckedMap(prev => ({ ...prev, [item.id]: false }));
                                            };
                                            return (
                                                <span
                                                    key={item.id}
                                                    className={`group-pill group-pill-selected`}
                                                    title={item.name}
                                                    style={{
                                                        display:'inline-flex',
                                                        alignItems:'center',
                                                        gap:'0.3em',
                                                        position:'relative'
                                                    }}
                                                >
                                                    {item.name}
                                                    <button
                                                        onClick={handleRemove}
                                                        style={{
                                                            background:'none',
                                                            border:'none',
                                                            color:'#c00',
                                                            fontWeight:'bold',
                                                            fontSize:'1em',
                                                            marginLeft:'4px',
                                                            cursor:'pointer',
                                                            padding:0,
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

export default FlatView;