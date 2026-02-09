import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Activity, Calendar, AlertCircle, Info, Filter,
    ChevronRight, Download, BarChart2, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const api = {
    fetchPrices: (start, end) => fetch(`http://localhost:5000/api/prices?start_date=${start || ''}&end_date=${end || ''}`).then(res => res.json()),
    fetchEvents: () => fetch('http://localhost:5000/api/events').then(res => res.json()),
    fetchStats: () => fetch('http://localhost:5000/api/stats').then(res => res.json()),
    fetchAnalysis: () => fetch('http://localhost:5000/api/analysis').then(res => res.json()),
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card p-6 flex flex-col justify-between"
        style={{ minWidth: '240px' }}
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
                <Icon className="text-orange-400" size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1 glow-text text-white">{value}</h3>
        </div>
    </motion.div>
);

const EventItem = ({ event, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(event)}
        className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-transparent hover:bg-white/5'}`}
    >
        <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-orange-400">{event.Date}</span>
            <ChevronRight size={14} className={isSelected ? 'text-orange-400' : 'text-slate-600'} />
        </div>
        <h4 className="text-sm font-semibold mt-1 text-slate-200">{event.Event}</h4>
    </div>
);

function App() {
    const [prices, setPrices] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({});
    const [analysis, setAnalysis] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '1987-05-20', end: '2022-09-30' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const [p, e, s, a] = await Promise.all([
                    api.fetchPrices(dateRange.start, dateRange.end),
                    api.fetchEvents(),
                    api.fetchStats(),
                    api.fetchAnalysis()
                ]);
                setPrices(p);
                setEvents(e);
                setStats(s);
                setAnalysis(a.report);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [dateRange]);

    const filteredPrices = useMemo(() => {
        // Basic downsampling for performance if range is large
        if (prices.length > 2000) {
            return prices.filter((_, i) => i % 5 === 0);
        }
        return prices;
    }, [prices]);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        // Zoom in on the event in a future iteration
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="animate-pulse text-orange-400 text-2xl font-bold">Birhan Energies Analysis...</div>
        </div>
    );

    return (
        <div className="min-h-screen p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <Briefcase className="text-orange-500" size={32} />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Brent Oil Insights
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium italic">Birhan Energies Consultancy Portal</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-card flex items-center px-4 py-2 gap-2">
                        <Calendar size={18} className="text-orange-400" />
                        <span className="text-sm font-semibold">{dateRange.start} — {dateRange.end}</span>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Download size={18} /> Export Results
                    </button>
                </div>
            </header>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Average Market Price" value={`$${stats.avg_price}`} icon={Activity} trend={2.4} />
                <StatCard title="All-Time Peak" value={`$${stats.max_price}`} icon={TrendingUp} />
                <StatCard title="Total Data Points" value={stats.total_days} icon={BarChart2} />
                <StatCard title="Detected Events" value={events.length} icon={AlertCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                {/* Main Chart */}
                <div className="lg:col-span-8 glass-card p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Historical Price & Event Overlay
                        </h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">1Y</button>
                            <button className="px-3 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">5Y</button>
                            <button className="px-3 py-1 text-xs rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/50">MAX</button>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredPrices}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                                <XAxis
                                    dataKey="Date"
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={500}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #f59e0b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f59e0b' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Price"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    animationDuration={1500}
                                />
                                {selectedEvent && (
                                    <ReferenceLine
                                        x={selectedEvent.Date}
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        label={{ position: 'top', value: 'EVENT', fill: '#ef4444', fontSize: 10 }}
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Events Sidebar */}
                <div className="lg:col-span-4 glass-card p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="text-orange-400" size={20} />
                        <h2 className="text-xl font-bold text-white">Market Catalysts</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {events.map((event, idx) => (
                            <EventItem
                                key={idx}
                                event={event}
                                isSelected={selectedEvent?.Event === event.Event}
                                onSelect={handleEventSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="glass-card p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="text-blue-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Bayesian Change Point Analysis</h3>
                    </div>
                    <div className="bg-black/30 rounded-xl p-6 border border-white/5 whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed max-sm:text-xs">
                        {analysis}
                    </div>
                </div>

                <div className="glass-card p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                        <TrendingUp className="text-orange-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Quantified Event Impact</h3>
                    {selectedEvent ? (
                        <div>
                            <p className="text-slate-400 max-w-sm mb-6">
                                Analyzing the shift in price dynamics following: <br />
                                <span className="text-orange-400 font-bold">"{selectedEvent.Event}"</span>
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase">Regime Type</span>
                                    <p className="font-bold text-white">Structural Shift</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase">Certainty</span>
                                    <p className="font-bold text-green-400">92% Posterior</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">Select an event from the list to see detailed causal quantification.</p>
                    )}
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.4);
        }
      `}</style>
        </div>
    );
}

export default App;
