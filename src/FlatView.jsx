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
        <div className="container" style={{display:'flex', gap:32}}>
            <div style={{flex:2}}>
                <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:24}}>
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
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {!data ? (
                    <Spin />
                ) : (
                    <div style={{marginTop:24, maxHeight:'60vh', overflowY:'auto', border:'1px solid #eee', borderRadius:8}}>
                        <table style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead>
                                <tr style={{background:'#f0f0f0'}}>
                                    <th style={{textAlign:'left', padding:'8px', borderBottom:'1px solid #ddd'}}></th>
                                    <th style={{textAlign:'left', padding:'8px', borderBottom:'1px solid #ddd'}}>Item</th>
                                    <th style={{textAlign:'left', padding:'8px', borderBottom:'1px solid #ddd'}}>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(item => (
                                    <tr key={item.id}>
                                        <td style={{padding:'8px', borderBottom:'1px solid #eee'}}>
                                            <input
                                                type="checkbox"
                                                checked={!!checkedMap[item.id]}
                                                onChange={() => handleCheck(item.id)}
                                            />
                                        </td>
                                        <td style={{padding:'8px', borderBottom:'1px solid #eee'}}>{item.name}</td>
                                        <td style={{padding:'8px', borderBottom:'1px solid #eee'}}>{item.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Review panel on the right */}
            <div style={{flex:1, background:'#fafafa', border:'1px solid #eee', borderRadius:8, padding:'1.5rem', minWidth:260, maxHeight:'80vh', overflowY:'auto'}}>
                <h3 style={{marginTop:0, marginBottom:'1rem'}}>Review Selections</h3>
                {Object.keys(selectedItemsByCategory).length === 0 ? (
                    <div style={{color:'#888'}}>No items selected.</div>
                ) : (
                    Object.entries(selectedItemsByCategory).map(([category, items]) => {
                        const total = flatItems.filter(i => i.category === category).length;
                        return (
                            <div key={category} style={{marginBottom:'1.2rem'}}>
                                <div style={{fontWeight:'bold', marginBottom:'0.5rem'}}>
                                    {category} <span style={{color:'#888', fontWeight:'normal'}}>({items.length}/{total})</span>
                                </div>
                                <ul style={{margin:0, paddingLeft:'1.2em', listStyleType: 'none'}}>
                                    {items.map(item => (
                                        <li key={item.id}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default FlatView;