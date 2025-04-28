import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const RiskReturnChart = ({ fundData }) => {
  const chartData = fundData.map(fund => ({
    date: fund.date,
    risk: fund.risk,
    return: fund.return,
  }));

  return (
    <div className="my-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">Risk & Return Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="return" fill="#4f46e5" name="Return" />
          <Bar dataKey="risk" fill="#f59e0b" name="Risk" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function FundExplorer() {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundData, setFundData] = useState([]);
  const [riskLevel, setRiskLevel] = useState('N/A');
  const [averageReturn, setAverageReturn] = useState('N/A');

  // Fetch all mutual funds once the component is mounted
  useEffect(() => {
    axios.get('http://localhost:5000/api/funds')
      .then(response => {
        setFunds(response.data);
      })
      .catch(error => console.error('Error fetching funds:', error));
  }, []);

  // Re-fetch data whenever selectedFund changes
  useEffect(() => {
    if (selectedFund) {
      // Fetch data for selected fund
      axios.get(`http://localhost:5000/api/fund/${selectedFund}`)
        .then(response => {
          const fund = response.data;
          
          // Set the fund's history data
          setFundData(fund.history);

          // Calculate risk level and average return
          const totalReturn = fund.history.reduce((acc, data) => acc + data.return, 0);
          const avgReturn = (totalReturn / fund.history.length).toFixed(2);
          const maxRisk = Math.max(...fund.history.map(data => data.risk));

          setRiskLevel(maxRisk); // Set max risk level
          setAverageReturn(avgReturn); // Set average return
        })
        .catch(error => console.error('Error fetching fund data:', error));
    }
  }, [selectedFund]); // Trigger when selectedFund changes

  return (
    <section id="explorer" className="py-16 px-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Fund Explorer</h2>

      {/* Dropdown to select a fund */}
      <div className="max-w-xl mx-auto mb-8">
        <select
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          value={selectedFund || ''}
          onChange={(e) => setSelectedFund(e.target.value)} // When selection changes, update state
        >
          <option value="" disabled>Select a Mutual Fund</option>
          {funds.map((fund) => (
            <option key={fund.id} value={fund.id}>
              {fund.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Risk Level and Average Return */}
      {selectedFund && (
        <div className="mb-8 text-center">
          <p className="text-lg font-semibold">Risk Level: {riskLevel}</p>
          <p className="text-lg font-semibold">Average Return: {averageReturn}%</p>
        </div>
      )}

      {/* Graph section */}
      {selectedFund && fundData.length > 0 ? (
        <RiskReturnChart fundData={fundData} />
      ) : selectedFund ? (
        <p className="text-center text-gray-500">Loading data for the selected fund...</p>
      ) : (
        <p className="text-center text-gray-500">Please select a mutual fund to see data.</p>
      )}
    </section>
  );
}
