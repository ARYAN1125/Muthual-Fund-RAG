const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse incoming JSON bodies

// Sample mutual fund data
const funds = [
  { id: 1, name: "Axis Bluechip Fund", description: "Large cap fund focused on bluechip companies.", risk: "Moderate", sector: "Bluechip", returns: 12.5 },
  { id: 2, name: "HDFC Small Cap Fund", description: "Invests in small cap companies for long-term growth.", risk: "High", sector: "Small Cap", returns: 18.2 },
  { id: 3, name: "ICICI Prudential Equity & Debt Fund", description: "Balanced hybrid fund combining equity and debt.", risk: "Low", sector: "Hybrid", returns: 8.3 },
  { id: 4, name: "SBI Technology Opportunities Fund", description: "Focuses on technology sector stocks.", risk: "High", sector: "Technology", returns: 19.7 },
  { id: 5, name: "Kotak Debt Hybrid Fund", description: "Invests in debt and equity to balance risk.", risk: "Low", sector: "Debt", returns: 7.1 },
];

// Default route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Get all mutual funds
app.get('/api/funds', (req, res) => {
  res.json(funds);
});

// Basic API data check
app.get('/api/data', (req, res) => {
  res.json({ message: 'Data fetched successfully!' });
});

// AI-based recommendations (basic filtering)
app.post('/api/recommendations', (req, res) => {
  const { risk, sector } = req.body;

  const recommendations = funds.filter(fund => {
    return (
      fund.risk.toLowerCase() === risk.toLowerCase() &&
      fund.sector.toLowerCase().includes(sector.toLowerCase())
    );
  });

  res.json(recommendations.length > 0 ? recommendations : [
    { message: "No exact match found. Try adjusting your risk or sector preferences." }
  ]);
});

// All mutual funds (can be used for dashboard)
app.get('/api/mutual-funds', (req, res) => {
  try {
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mutual fund data' });
  }
});

// Fund analysis (basic summary)
app.get('/api/analyze/:fundId', (req, res) => {
  const fundId = parseInt(req.params.fundId);
  const fund = funds.find(f => f.id === fundId);

  if (!fund) {
    return res.status(404).json({ message: 'Fund not found' });
  }

  const analysis = `This fund typically performs well in ${fund.sector} sectors with a ${fund.risk} risk profile.`;
  res.json({ summary: analysis });
});

// Individual fund with simulated history
app.get('/api/fund/:fundId', (req, res) => {
  const fundId = parseInt(req.params.fundId);
  const fund = funds.find(f => f.id === fundId);

  if (!fund) {
    return res.status(404).json({ message: 'Fund not found' });
  }

  const history = [
    { date: '2024-01-01', risk: 2, return: fund.returns - 2 },
    { date: '2024-02-01', risk: 3, return: fund.returns - 1 },
    { date: '2024-03-01', risk: 2, return: fund.returns },
    { date: '2024-04-01', risk: 3, return: fund.returns + 1 },
    { date: '2024-05-01', risk: 2, return: fund.returns + 0.5 },
  ];

  res.json({ ...fund, history });
});
// Prediction endpoint (dummy logic for now)
app.post('/api/predict', (req, res) => {
  const { fundType, sector, historicalReturns, volatility } = req.body;

  // Dummy prediction logic (replace with ML model later)
  const risk = parseFloat(volatility) > 15 ? 'High' : 'Moderate';
  const predictedReturns = parseFloat(historicalReturns) + 1.5;

  res.json({ riskLevel: risk, returns: predictedReturns });
});

// Global error handler to prevent crashes
app.use((err, req, res, next) => {
  console.error('❌ Backend Error:', err.stack);
  res.status(500).send('Something broke!');
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
