import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    current: 0,
    average: 0,
    peak: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://appdevfinalpit.onrender.com/api/current/all/");
        
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const json = await res.json();
        const formattedData = json.reverse(); // oldest to newest
        
        setData(formattedData);
        
        // Calculate statistics
        if (formattedData.length > 0) {
          const currentValue = formattedData[formattedData.length - 1].current;
          const sum = formattedData.reduce((acc, item) => acc + item.current, 0);
          const avg = sum / formattedData.length;
          const peak = Math.max(...formattedData.map(item => item.current));
          
          setStats({
            current: currentValue.toFixed(2),
            average: avg.toFixed(2),
            peak: peak.toFixed(2)
          });
        }
        
        setError(null);
      } catch (err) {
        setError("Unable to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // every 10s
    return () => clearInterval(interval);
  }, []);

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{new Date(label).toLocaleString()}</p>
          <p className="tooltip-value">
            <span style={{ color: "#4361ee" }}>Current:</span> {payload[0].value.toFixed(2)} Amps
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__welcome">
          <h1>Welcome, {userInfo.first_name}</h1>
          <p className="dashboard__date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="dashboard__actions">
          <button className="btn btn-accent">Export Data</button>
        </div>
      </div>
      
      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-icon current-icon">⚡</div>
          <div className="stat-info">
            <h3>Current Reading</h3>
            <p className="stat-value">{stats.current}<span className="stat-unit">A</span></p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon average-icon">📊</div>
          <div className="stat-info">
            <h3>Average Current</h3>
            <p className="stat-value">{stats.average}<span className="stat-unit">A</span></p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon peak-icon">🔝</div>
          <div className="stat-info">
            <h3>Peak Current</h3>
            <p className="stat-value">{stats.peak}<span className="stat-unit">A</span></p>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-header">
          <h2>Live Current Readings</h2>
          <p className="chart-subtitle">Real-time power consumption monitoring</p>
        </div>
        
        {loading && data.length === 0 ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4361ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4361ee" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} 
                stroke="#8d99ae"
              />
              <YAxis 
                label={{ value: 'Current (Amps)', angle: -90, position: 'insideLeft', style: { textFill: "#8d99ae" } }} 
                stroke="#8d99ae"
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="current" 
                name="Current (A)" 
                stroke="#4361ee" 
                fillOpacity={1} 
                fill="url(#colorCurrent)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="dashboard__footer">
        <p>Last updated: {data.length > 0 ? new Date(data[data.length - 1]?.timestamp).toLocaleString() : "No data available"}</p>
      </div>
    </div>
  );
};

export default Dashboard;