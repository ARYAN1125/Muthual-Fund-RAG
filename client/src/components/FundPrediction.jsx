// frontend/src/components/FundPrediction.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FundPrediction = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictRisk = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/predict', {
        fundType: "Equity",
        sector: "Technology",
        historicalReturns: 12.5,
        volatility: 18
      });
      setResult(res.data);
    } catch (err) {
      console.error("Prediction failed:", err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white max-w-md mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Fund Risk & Return Predictor</h2>
      <button
        onClick={predictRisk}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Predicting..." : "Get Prediction"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 border border-blue-200 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-800">📈 Predicted Returns: <span className="text-blue-600">{result.returns.toFixed(2)}%</span></p>
          <p className="text-lg font-semibold text-gray-800 mt-2">⚠️ Risk Level: <span className={`font-bold ${result.riskLevel === 'High' ? 'text-red-500' : 'text-yellow-600'}`}>{result.riskLevel}</span></p>
        </div>
      )}
    </div>
  );
};

export default FundPrediction;
