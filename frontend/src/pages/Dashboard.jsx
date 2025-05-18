import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/current/all/");
      const json = await res.json();
      setData(json.reverse()); // oldest to newest
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Welcome, {userInfo.first_name}</h1>
      <h2>Live Current Readings</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
          <YAxis label={{ value: 'Amps', angle: -90, position: 'insideLeft' }} />
          <CartesianGrid stroke="#ccc" />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
          <Line type="monotone" dataKey="current" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
