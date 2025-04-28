import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ['#4ade80', '#60a5fa', '#f87171', '#facc15', '#a78bfa'];

const Dashboard = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [fundDataMap, setFundDataMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

  const handleExport = async (type) => {
    const element = document.getElementById("dashboard");  // Capture the dashboard
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.addImage(imgData, "PNG", 0, 0);
      doc.save("fund-dashboard.pdf");
    } else if (type === "png") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "fund-dashboard.png";
      link.click();
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/funds')
      .then(res => setFunds(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchAnalysis = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/analyze/${id}`);
      setFundDataMap(prev => ({ ...prev, [id]: res.data }));
    } catch (err) {
      console.error("Analysis fetch failed", err);
    }
  };

  const toggleFund = (fund) => {
    const isSelected = selectedFunds.includes(fund.id);
    const updatedSelection = isSelected
      ? selectedFunds.filter(fid => fid !== fund.id)
      : [...selectedFunds, fund.id];

    setSelectedFunds(updatedSelection);

    if (!fundDataMap[fund.id]) {
      setLoading(true);
      fetchAnalysis(fund.id).finally(() => setLoading(false));
    }
  };

  const riskReturnData = selectedFunds.map(id => {
    const data = fundDataMap[id];
    return data ? { name: data.name, Risk: data.riskScore, Return: data.returns } : null;
  }).filter(Boolean);

  const toggleChartType = () => {
    setChartType(prev => (prev === 'bar' ? 'line' : 'bar'));
  };

  return (
    <div id="dashboard" className="p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10 animate-bounce">📊 Mutual Fund Dashboard</h1>

      {/* Fund Selection */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {funds.map(fund => (
          <button
            key={fund.id}
            onClick={() => toggleFund(fund)}
            className={`px-4 py-2 rounded-md border transition ${selectedFunds.includes(fund.id)
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800'
              }`}
          >
            {fund.name}
          </button>
        ))}
      </div>

      {/* Risk vs Return Comparison */}
      {riskReturnData.length > 0 && (
        <div className="bg-indigo-50 p-6 rounded-lg shadow mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📈 Risk vs Return Comparison</h2>
            <button
              onClick={toggleChartType}
              className="text-sm bg-indigo-200 hover:bg-indigo-300 px-3 py-1 rounded-md text-indigo-800 transition"
            >
              📊 Chart Type: {chartType === 'bar' ? 'Bar' : 'Line'}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={riskReturnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Risk" fill="#f87171" />
                <Bar dataKey="Return" fill="#4ade80" />
              </BarChart>
            ) : (
              <LineChart data={riskReturnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Risk" stroke="#f87171" />
                <Line type="monotone" dataKey="Return" stroke="#4ade80" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <p className="text-center text-indigo-600 mb-6">Analyzing data...</p>}

      {/* Data for Selected Funds */}
      {selectedFunds.map(fundId => {
        const data = fundDataMap[fundId];
        if (!data) return null;

        return (
          <div key={fundId} className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Market Correlation Chart */}
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">🔗 Market Correlation - {data.name}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.correlationHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="correlation" stroke="#60a5fa" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sector Allocation Pie Chart */}
            {data.sectorBreakdown && (
              <div className="bg-yellow-50 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">📊 Sector Allocation - {data.name}</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.sectorBreakdown}
                      dataKey="value"
                      nameKey="sector"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {data.sectorBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* AI Insights & Suggested Action */}
            <div className="col-span-2 text-center mt-6">
              <h3 className="text-2xl font-semibold text-indigo-700">🧠 AI Insights Summary for {data.name}</h3>
              <p className="mt-2 text-lg text-gray-700">{data.aiInsights || "AI insights coming soon..."}</p>
            </div>

            <div className="col-span-2 text-center mt-6">
              <h3 className="text-2xl font-semibold text-indigo-700">💡 Suggested Action for {data.name}</h3>
              <p className="mt-2 text-lg text-gray-700">{data.action}</p>
            </div>
          </div>
        );
      })}

      {/* Export Buttons */}
      <div className="text-center mt-10">
        <button
          onClick={() => handleExport("pdf")}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 mr-4"
        >
          Download PDF
        </button>
        <button
          onClick={() => handleExport("png")}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
