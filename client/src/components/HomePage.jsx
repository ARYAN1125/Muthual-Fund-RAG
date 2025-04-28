import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FundExplorer from './FundExplorer';
import PredictionForm from './PredictionForm';
import FundPrediction from './FundPrediction';
import SmartInsights from './SmartInsights'; // Import SmartInsights Component

function HomePage() {
  const [data, setData] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showSmartInsights, setShowSmartInsights] = useState(false); // State to toggle insights
  const fundRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error('There was an error fetching the data!', error));
  }, []);

  const handleGetStartedClick = () => {
    fundRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePredictionSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      setPredictionResult(response.data);
    } catch (error) {
      console.error('Error with prediction:', error);
    }
  };

  // Function to show Smart Insights
  const handleInsightsClick = () => {
    setShowSmartInsights(true);
  };

  return (
    <div className="font-sans text-gray-800">
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-indigo-600">Mutual Fund RAG</h1>
        <nav className="space-x-4 text-sm md:text-base">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <Link to="/explorer" className="hover:text-indigo-600">Fund Explorer</Link>
        </nav>
      </header>

      <section className="text-center py-20 px-4 bg-indigo-50">
        <h2 className="text-4xl font-bold mb-4">Smart Investing Starts Here</h2>
        <p className="max-w-xl mx-auto text-lg text-gray-600 mb-6">
          Let RAG analyze and guide your mutual fund decisions based on real-time data and risk profiling.
        </p>
        <button
          onClick={handleGetStartedClick}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Get Started
        </button>
      </section>

      <section id="data" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Fetched Data</h2>
        <p>{data ? data.message : "Loading data..."}</p>
      </section>

      <div ref={fundRef}>
        <FundExplorer />
      </div>

      <section id="prediction-form" className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold mb-4 text-center">Get Your Fund Prediction</h2>
        <PredictionForm onSubmit={handlePredictionSubmit} />
      </section>

      {predictionResult && (
        <section id="prediction-results" className="py-16 px-6 bg-indigo-100 text-center">
          <h3 className="text-2xl font-semibold">Prediction Results</h3>
          <FundPrediction riskLevel={predictionResult.riskLevel} returns={predictionResult.returns} />
        </section>
      )}

      {/* Features section with clickable areas */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <button
              onClick={handleInsightsClick} // Click handler to show Smart Insights
              className="text-xl font-semibold mb-2 text-indigo-600 hover:underline"
            >
              Smart Suggestions
            </button>
            <p>Get fund recommendations backed by AI based on your preferences and trends.</p>
          </div>
          <div>
            <button
              onClick={handleInsightsClick} // Click handler to show Smart Insights
              className="text-xl font-semibold mb-2 text-indigo-600 hover:underline"
            >
              Risk Analysis
            </button>
            <p>Understand the risk behind each fund and align them with your goals.</p>
          </div>
          <div>
            <button
              onClick={handleInsightsClick} // Click handler to show Smart Insights
              className="text-xl font-semibold mb-2 text-indigo-600 hover:underline"
            >
              Investor Planning
            </button>
            <p>Build a portfolio with guided insights on performance, safety, and returns.</p>
          </div>
        </div>
      </section>

      {/* Conditionally render SmartInsights based on button click */}
      {showSmartInsights && (
        <section id="smart-insights" className="py-16 px-6 bg-indigo-100">
          <SmartInsights />
        </section>
      )}

      <section id="cta" className="py-16 px-6 bg-indigo-100 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to make smarter investments?</h2>
        <Link to="/explorer">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            Explore Now
          </button>
        </Link>
      </section>

      <footer className="text-center py-6 text-sm text-gray-500 bg-white">
        © 2025 Unstoppable.
      </footer>
    </div>
  );
}

export default HomePage;
