import React, { useState } from 'react';
import axios from 'axios';

const SmartInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [investmentPlan, setInvestmentPlan] = useState('');

  // Fetch recommendations based on user's risk and sector choice
  const fetchRecommendations = async (risk, sector) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/recommendations', { risk, sector });
      setRecommendations(res.data);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
    setLoading(false);
  };

  // Handle section clicks
  const handleClick = (section) => {
    setSelectedInsight(section);

    // Load data based on the section
    if (section === "suggestions") {
      fetchRecommendations("High", "Technology"); // Example, you can customize this
    } else if (section === "risk") {
      setAnalysis("This analysis will show risk assessment data for the selected fund.");
    } else if (section === "planning") {
      setInvestmentPlan("This is a general investment plan tailored to your preferences.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Smart Insights</h2>

      {/* Buttons for Insights */}
      <div className="flex justify-around mb-6">
        <button
          onClick={() => handleClick("suggestions")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out"
        >
          Smart Suggestions
        </button>
        <button
          onClick={() => handleClick("risk")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out"
        >
          Risk Analysis
        </button>
        <button
          onClick={() => handleClick("planning")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out"
        >
          Investor Planning
        </button>
      </div>

      {/* Displaying the content based on selected section */}
      {selectedInsight === "suggestions" && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Smart Suggestions</h3>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : (
            <div>
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gray-100 mb-4 rounded shadow-sm">
                    <h4 className="font-semibold">{rec.name}</h4>
                    <p>{rec.description}</p>
                    <p>Risk: {rec.risk}</p>
                    <p>Returns: {rec.returns}%</p>
                  </div>
                ))
              ) : (
                <p>No recommendations found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {selectedInsight === "risk" && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Risk Analysis</h3>
          <p>{analysis}</p>
        </div>
      )}

      {selectedInsight === "planning" && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Investor Planning</h3>
          <p>{investmentPlan}</p>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;
