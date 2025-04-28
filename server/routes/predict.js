const express = require('express');
const { PythonShell } = require('python-shell');
const router = express.Router();

// Prediction route
router.post('/predict', (req, res) => {
    const { fundType, sector, historicalReturns, volatility } = req.body;

    const options = {
        mode: 'text',
        pythonPath: 'python',  // Adjust this if Python is in a different path
        pythonOptions: ['-u'],
        scriptPath: './predict',  // Path to where your Python model is
        args: [fundType, sector, historicalReturns, volatility],
    };

    PythonShell.run('predict_model.py', options, (err, results) => {
        if (err) {
            return res.status(500).send('Error with prediction model.');
        }

        const [riskLevel, returns] = results[0].split(',');
        res.json({ riskLevel, returns });
    });
});

module.exports = router;
