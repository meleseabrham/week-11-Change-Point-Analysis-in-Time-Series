import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
    TrendingUp, Activity, Calendar, AlertCircle, Info, Filter,
    ChevronRight, Download, BarChart2, Briefcase, RefreshCcw, Search
} from 'lucide-react';

const api = {
    fetchPrices: (start, end) => fetch(`http://localhost:5000/api/prices?start_date=${start || ''}&end_date=${end || ''}`).then(res => res.json()),
    fetchEvents: () => fetch('http://localhost:5000/api/events').then(res => res.json()),
    fetchStats: () => fetch('http://localhost:5000/api/stats').then(res => res.json()),
    fetchAnalysis: () => fetch('http://localhost:5000/api/analysis').then(res => res.json()),
};

const StatCard = ({ title, value, icon: Icon, colorClass = "" }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div className="icon-box">
                <Icon size={20} className={colorClass} />
            </div>
        </div>
        <div>
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
        </div>
    </div>
);

function App() {
    const [prices, setPrices] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({});
    const [analysis, setAnalysis] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Custom Date Filters
    const [startDate, setStartDate] = useState('1987-05-20');
    const [endDate, setEndDate] = useState('2022-11-14');
    const [activeRange, setActiveRange] = useState('MAX');

    const loadData = async (start = startDate, end = endDate) => {
        try {
            const [p, e, s, a] = await Promise.all([
                api.fetchPrices(start, end),
                api.fetchEvents(),
                api.fetchStats(),
                api.fetchAnalysis()
            ]);
            setPrices(p);
            setEvents(e);
            setStats(s);
            setAnalysis(a.report);
        } catch (err) {
            console.error("Data error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const chartData = useMemo(() => {
        if (!prices.length) return [];
        // Dynamic downsampling: If range is large, downsample. If small (zoomed), show all.
        const step = prices.length > 2000 ? 5 : 1;
        return prices.filter((_, i) => i % step === 0);
    }, [prices]);

    const handleApplyFilter = () => {
        setActiveRange('CUSTOM');
        loadData(startDate, endDate);
    };

    const handleQuickRange = (range) => {
        setActiveRange(range);
        const end = '2022-11-14';
        let start = '1987-05-20';

        if (range === '1Y') {
            start = '2021-11-14';
        } else if (range === '5Y') {
            start = '2017-11-14';
        }

        setStartDate(start);
        setEndDate(end);
        loadData(start, end);
    };

    const handleDownloadReport = () => {
        const element = document.createElement("a");
        const file = new Blob([analysis], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Birhan_Energies_Impact_Report.txt";
        document.body.appendChild(element);
        element.click();
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold' }}>
            BIRHAN INTELLIGENCE...
        </div>
    );

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <div className="logo-section">
                    <div className="logo-box">
                        <Activity size={24} color="black" />
                    </div>
                    <div className="logo-text">
                        Birhan <span>Energies</span>
                    </div>
                </div>
                <div className="header-meta">
                    <div className="date-input-group">
                        <Calendar size={14} color="#fbbf24" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min="1987-05-20"
                            max="2022-11-14"
                        />
                        <span style={{ color: '#52525b' }}>→</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min="1987-05-20"
                            max="2022-11-14"
                        />
                        <button
                            onClick={handleApplyFilter}
                            style={{ background: '#fbbf24', color: 'black', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer' }}
                        >
                            APPLY
                        </button>
                    </div>
                    <button className="btn-premium" onClick={handleDownloadReport} title="Export Analysis">
                        <Download size={16} />
                    </button>
                    <button className="btn-premium" onClick={() => loadData()}>
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </header>

            {/* Stats */}
            <section className="stats-grid">
                <StatCard title="Selected Range Avg" value={`$${prices.length ? (prices.reduce((a, b) => a + b.Price, 0) / prices.length).toFixed(2) : '0.00'}`} icon={BarChart2} colorClass="text-amber" />
                <StatCard title="Historical Cycle Peak" value={`$${stats.max_price}`} icon={TrendingUp} colorClass="text-green" />
                <StatCard title="Visible Window" value={`${prices.length} days`} icon={Activity} colorClass="text-amber" />
                <StatCard title="Market Catalysts" value={events.length} icon={AlertCircle} colorClass="text-red" />
            </section>

            {/* Main Analysis */}
            <main className="main-layout">
                <div className="chart-panel">
                    <div className="panel-header">
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Brent Crude Market Dynamics</h2>
                            <p style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: '700', marginTop: '0.25rem' }}>
                                Regime Analysis: {startDate} to {endDate}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => handleQuickRange('1Y')}
                                style={{ padding: '4px 12px', fontSize: '0.7rem', background: activeRange === '1Y' ? '#fbbf24' : '#000', color: activeRange === '1Y' ? '#000' : '#71717a', border: '1px solid #27272a', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                1Y
                            </button>
                            <button
                                onClick={() => handleQuickRange('5Y')}
                                style={{ padding: '4px 12px', fontSize: '0.7rem', background: activeRange === '5Y' ? '#fbbf24' : '#000', color: activeRange === '5Y' ? '#000' : '#71717a', border: '1px solid #27272a', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                5Y
                            </button>
                            <button
                                onClick={() => handleQuickRange('MAX')}
                                style={{ padding: '4px 12px', fontSize: '0.7rem', background: activeRange === 'MAX' ? '#fbbf24' : '#000', color: activeRange === 'MAX' ? '#000' : '#71717a', border: '1px solid #27272a', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div style={{ flex: 1, width: '100%', minHeight: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="coolGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="Date"
                                    stroke="#52525b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={60}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={v => `$${v}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #fbbf24', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Price"
                                    stroke="#fbbf24"
                                    strokeWidth={2}
                                    fill="url(#coolGradient)"
                                    animationDuration={300}
                                    isAnimationActive={false}
                                />

                                {selectedEvent && (
                                    <ReferenceLine
                                        x={selectedEvent.Date}
                                        stroke="#ef4444"
                                        strokeWidth={4}
                                        label={{
                                            position: 'top',
                                            fill: '#ef4444',
                                            value: `🚨 ${selectedEvent.Event}`,
                                            fontSize: 12,
                                            fontWeight: '900',
                                            dy: -10
                                        }}
                                        strokeDasharray="3 3"
                                    />
                                )}
                                {selectedEvent && (
                                    <ReferenceLine
                                        x={selectedEvent.Date}
                                        stroke="rgba(239, 68, 68, 0.2)"
                                        strokeWidth={20}
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <aside className="catalyst-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <Filter size={18} color="#fbbf24" />
                        <h2 style={{ fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase' }}>Market Catalysts</h2>
                    </div>
                    <div className="event-list">
                        {events.map((e, idx) => (
                            <div
                                key={idx}
                                className={`event-card ${selectedEvent?.Event === e.Event ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedEvent(e);
                                    // If event is outside current visible range, we might want to reset to MAX
                                    // But for now just show and let user adjust if they want
                                }}
                            >
                                <p className="event-date">{e.Date}</p>
                                <h4 className="event-name">{e.Event}</h4>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>

            {/* Analysis Details */}
            <section className="analysis-grid">
                <div className="analysis-box">
                    <div className="flex-center">
                        <Info size={20} color="#60a5fa" />
                        <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800' }}>Bayesian Impact Insights</h3>
                    </div>
                    <div className="analysis-content" style={{ fontSize: '0.75rem' }}>
                        {analysis}
                    </div>
                </div>
                <div className="analysis-box" style={{ borderLeft: '4px solid #fbbf24' }}>
                    <div className="flex-center">
                        <Briefcase size={20} color="#fbbf24" />
                        <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800' }}>Causal Breakdown</h3>
                    </div>
                    <p style={{ marginTop: '1rem', color: '#a1a1aa', fontSize: '0.875rem' }}>
                        {selectedEvent ? (
                            <>
                                Analysis for <strong>"{selectedEvent.Event}"</strong> indicates a significant structural break.
                                Our model quantification suggests a probabilistic shift in market regime following this date.
                                <br /><br />
                                <span style={{ color: 'white', fontWeight: '700' }}>Context:</span> {selectedEvent.Description}
                            </>
                        ) : (
                            "Select a market catalyst from the sidebar to view detailed causal breakdown and regime shift quantification."
                        )}
                    </p>
                </div>
            </section>

            <footer style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #18181b', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#ffffffff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    © 2026 Birhan Energies Consultant Portal — Proprietary Insight
                </p>
            </footer>
        </div>
    );
}

export default App;
