import React, { useState } from 'react';
import axios from 'axios';

const RiskPrediction = () => {
  const [fundType, setFundType] = useState('');
  const [sector, setSector] = useState('');
  const [historicalReturns, setHistoricalReturns] = useState('');
  const [volatility, setVolatility] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/predict', {
        fundType,
        sector,
        historicalReturns,
        volatility,
      });

      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction({ error: 'Failed to get prediction. Try again.' });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Predict Fund Risk & Return</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Fund Type"
          className="w-full border px-3 py-2 rounded"
          value={fundType}
          onChange={(e) => setFundType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sector"
          className="w-full border px-3 py-2 rounded"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        />
        <input
          type="number"
          placeholder="Historical Returns (%)"
          className="w-full border px-3 py-2 rounded"
          value={historicalReturns}
          onChange={(e) => setHistoricalReturns(e.target.value)}
        />
        <input
          type="number"
          placeholder="Volatility (%)"
          className="w-full border px-3 py-2 rounded"
          value={volatility}
          onChange={(e) => setVolatility(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Prediction
        </button>
      </form>

      {prediction && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          {prediction.error ? (
            <p className="text-red-600">{prediction.error}</p>
          ) : (
            <>
              <p><strong>Predicted Risk Level:</strong> {prediction.riskLevel}</p>
              <p><strong>Predicted Returns:</strong> {prediction.returns}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskPrediction;
