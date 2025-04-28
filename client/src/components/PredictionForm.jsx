// frontend/src/components/PredictionForm.jsx
import React, { useState } from 'react';

const PredictionForm = ({ onSubmit }) => {
  const [fundType, setFundType] = useState('');
  const [sector, setSector] = useState('');
  const [historicalReturns, setHistoricalReturns] = useState('');
  const [volatility, setVolatility] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);  // Track the submission status

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Disable the button while submitting to prevent multiple clicks
    setIsSubmitting(true);

    // Construct the form data to send to parent
    const formData = {
      fundType,
      sector,
      historicalReturns,
      volatility,
    };

    // Trigger the parent onSubmit function to send the data to the backend
    await onSubmit(formData);

    // Re-enable the button after submission
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fundType">Fund Type:</label>
        <input
          id="fundType"
          type="text"
          value={fundType}
          onChange={(e) => setFundType(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="sector">Sector:</label>
        <input
          id="sector"
          type="text"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="historicalReturns">Historical Returns:</label>
        <input
          id="historicalReturns"
          type="number"
          value={historicalReturns}
          onChange={(e) => setHistoricalReturns(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="volatility">Volatility:</label>
        <input
          id="volatility"
          type="number"
          value={volatility}
          onChange={(e) => setVolatility(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        disabled={isSubmitting}  // Disable the button when submitting
      >
        {isSubmitting ? 'Submitting...' : 'Get Prediction'}
      </button>
    </form>
  );
};

export default PredictionForm;
