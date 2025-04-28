import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FundExplorer = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('returns');
  const [uniqueRisks, setUniqueRisks] = useState([]);
  const [uniqueSectors, setUniqueSectors] = useState([]);
  
  // New: State for real-time analysis results
  const [analysisResults, setAnalysisResults] = useState({});
  const [analyzingFundId, setAnalyzingFundId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/funds')
      .then((response) => {
        const data = response.data;
        setFunds(data);
        setLoading(false);

        const risks = [...new Set(data.map(f => f.risk))];
        const sectors = [...new Set(data.map(f => f.sector))];
        setUniqueRisks(risks);
        setUniqueSectors(sectors);
        if (risks.length) setSelectedRisk(risks[0]);
        if (sectors.length) setSelectedSector(sectors[0]);
      })
      .catch(() => {
        setError('Failed to load fund data.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedRisk || !selectedSector) return;
    axios.post('http://localhost:5000/api/recommendations', {
      risk: selectedRisk,
      sector: selectedSector
    })
      .then((response) => setRecommendations(response.data))
      .catch(() => console.error('Recommendation fetch failed.'));
  }, [selectedRisk, selectedSector]);

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-200 text-green-800';
      case 'moderate':
      case 'medium': return 'bg-yellow-200 text-yellow-800';
      case 'high': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const sortedFunds = [...funds]
    .filter(fund => fund.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortBy === 'returns'
      ? b.returns - a.returns
      : a.risk.localeCompare(b.risk)
    );

  // New: Function to fetch analysis
  const handleAnalysisClick = async (fundId) => {
    setAnalyzingFundId(fundId);
    try {
      const response = await axios.get(`http://localhost:5000/api/analyze/${fundId}`);
      setAnalysisResults((prev) => ({ ...prev, [fundId]: response.data }));
    } catch (err) {
      setAnalysisResults((prev) => ({ ...prev, [fundId]: { error: 'Analysis failed' } }));
    } finally {
      setAnalyzingFundId(null);
    }
  };

  if (loading) return <div className="text-center py-10">🔄 Loading funds...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="py-16 px-6 bg-white min-h-screen">
      <h2 className="text-4xl font-bold mb-10 text-center text-indigo-700 animate-pulse">🚀 Mutual Fund RAG Explorer</h2>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-5xl mx-auto mb-10">
        <input
          type="text"
          placeholder="🔍 Search fund by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/2"
        />
        <select
          className="p-2 border rounded-md"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="returns">Sort by Returns</option>
          <option value="risk">Sort by Risk</option>
        </select>
      </div>

      {/* Fund Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {sortedFunds.map(fund => (
          <div
            key={fund.id}
            className="bg-indigo-50 hover:scale-105 transition-all duration-300 p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-1">{fund.name}</h3>
            <span className={`px-2 py-1 text-xs rounded ${getRiskColor(fund.risk)}`}>
              Risk: {fund.risk}
            </span>
            <p className="mt-2 text-gray-800"><strong>Returns:</strong> {fund.returns}%</p>
            <p className="text-sm mt-2 text-gray-600">{fund.description}</p>

            {/* Real-time Analysis Button */}
            <button
              onClick={() => handleAnalysisClick(fund.id)}
              className="mt-4 text-sm bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
            >
              {analyzingFundId === fund.id ? 'Analyzing...' : '📊 Run Real-Time Analysis'}
            </button>

            {/* Display Analysis Results */}
            {analysisResults[fund.id] && (
              <div className="mt-3 p-3 bg-white border rounded text-sm">
                {analysisResults[fund.id].error ? (
                  <span className="text-red-500">{analysisResults[fund.id].error}</span>
                ) : (
                  <>
                    <p><strong>Risk Impact:</strong> {analysisResults[fund.id].riskImpact}</p>
                    <p><strong>Market Correlation:</strong> {analysisResults[fund.id].correlation}</p>
                    <p><strong>Suggested Action:</strong> {analysisResults[fund.id].action}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendation Filters */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h3 className="text-3xl font-semibold mb-4 text-green-600">🤖 AI-based Fund Recommendations</h3>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            {uniqueRisks.map((risk, i) => (
              <option key={i} value={risk}>{risk}</option>
            ))}
          </select>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {uniqueSectors.map((sector, i) => (
              <option key={i} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {recommendations.length > 0 ? (
          recommendations.map(fund => (
            <div
              key={fund.id}
              className="bg-green-50 hover:scale-105 transition-all duration-300 p-6 rounded-xl shadow"
            >
              <h4 className="text-xl font-semibold text-green-700 mb-2">{fund.name}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getRiskColor(fund.risk)}`}>
                Risk: {fund.risk}
              </span>
              <p className="text-sm mt-2 text-gray-700">{fund.description}</p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No matching recommendations found.</p>
        )}
      </div>
    </div>
  );
};

export default function FundExplorer() {
    return (
      <section id="explorer" className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Fund Explorer</h2>
        {/* Your Dropdown, Risk & Return chart, etc. */}
      </section>
    );
  }
  
