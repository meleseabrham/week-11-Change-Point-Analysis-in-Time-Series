import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
    TrendingUp, Activity, Calendar, AlertCircle, Info, Filter,
    ChevronRight, Download, BarChart2, Briefcase, RefreshCcw
} from 'lucide-react';

const api = {
    fetchPrices: () => fetch(`http://localhost:5000/api/prices`).then(res => res.json()),
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
    const [timeRange, setTimeRange] = useState('MAX');

    const loadData = async () => {
        try {
            const [p, e, s, a] = await Promise.all([
                api.fetchPrices(),
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

    const filteredPrices = useMemo(() => {
        if (!prices.length) return [];
        let data = [...prices];
        const lastDate = new Date(data[data.length - 1].Date);

        if (timeRange === '1Y') {
            const cutoff = new Date(lastDate);
            cutoff.setFullYear(cutoff.getFullYear() - 1);
            data = data.filter(p => new Date(p.Date) >= cutoff);
        } else if (timeRange === '5Y') {
            const cutoff = new Date(lastDate);
            cutoff.setFullYear(cutoff.getFullYear() - 5);
            data = data.filter(p => new Date(p.Date) >= cutoff);
        }

        // Downsample for performance if needed
        const step = data.length > 3000 ? 5 : 1;
        return data.filter((_, i) => i % step === 0);
    }, [prices, timeRange]);

    // Find the closest date in filteredPrices to the selected event
    const closestDate = useMemo(() => {
        if (!selectedEvent || !filteredPrices.length) return null;
        const target = selectedEvent.Date;
        // If it exists exactly, return it
        if (filteredPrices.find(p => p.Date === target)) return target;

        // Otherwise find closest for visual pinning
        const targetTs = new Date(target).getTime();
        let closest = filteredPrices[0].Date;
        let minDiff = Math.abs(new Date(closest).getTime() - targetTs);

        for (const p of filteredPrices) {
            const diff = Math.abs(new Date(p.Date).getTime() - targetTs);
            if (diff < minDiff) {
                minDiff = diff;
                closest = p.Date;
            }
        }
        return closest;
    }, [selectedEvent, filteredPrices]);

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', background: '#18181b', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: '700' }}>
                        <Calendar size={14} color="#fbbf24" />
                        {timeRange === 'MAX' ? '1987 — 2022' : timeRange + ' View'}
                    </div>
                    <button className="btn-premium" onClick={loadData}>
                        <RefreshCcw size={16} /> Refresh
                    </button>
                </div>
            </header>

            {/* Stats */}
            <section className="stats-grid">
                <StatCard title="Average Market Price" value={`$${stats.avg_price}`} icon={BarChart2} colorClass="text-amber" />
                <StatCard title="Historical Cycle Peak" value={`$${stats.max_price}`} icon={TrendingUp} colorClass="text-green" />
                <StatCard title="Analyzed Horizon" value={`${prices.length} days`} icon={Activity} colorClass="text-amber" />
                <StatCard title="Market Catalysts" value={events.length} icon={AlertCircle} colorClass="text-red" />
            </section>

            {/* Main Analysis */}
            <main className="main-layout">
                <div className="chart-panel">
                    <div className="panel-header">
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Brent Crude Market Dynamics</h2>
                            <p style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', fontWeight: '700', marginTop: '0.25rem' }}>
                                Long-term structural evolution & pricing regimes
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['1Y', '5Y', 'MAX'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    style={{
                                        padding: '4px 12px',
                                        fontSize: '0.75rem',
                                        background: timeRange === t ? '#fbbf24' : '#000',
                                        border: timeRange === t ? 'none' : '1px solid #27272a',
                                        color: timeRange === t ? '#000' : '#71717a',
                                        borderRadius: '6px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, width: '100%', minHeight: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredPrices} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
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
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #fbbf24', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="Price" stroke="#fbbf24" strokeWidth={2} fill="url(#coolGradient)" animationDuration={500} isAnimationActive={false} />
                                {selectedEvent && closestDate && (
                                    <ReferenceLine x={closestDate} stroke="#ef4444" strokeWidth={3} label={{ position: 'top', fill: '#ef4444', value: 'EVENT', fontSize: 10, fontWeight: 'bold' }} />
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
                                    if (timeRange !== 'MAX') setTimeRange('MAX'); // Switch to MAX to see historic events
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
                    <div className="analysis-content">
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
                <p style={{ fontSize: '0.7rem', color: '#ededf4ff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    © 2026 Birhan Energies Consultant Portal — Proprietary Insight
                </p>
            </footer>
        </div>
    );
}

export default App;
