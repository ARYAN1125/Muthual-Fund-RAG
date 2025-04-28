# backend/api/flask_app.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load('../model/risk_prediction_model.pkl')

@app.route('/')
def index():
    return "✅ Mutual Fund Risk Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array([
        data['historical_returns'],
        data['sector_growth'],
        data['volatility']
    ]).reshape(1, -1)
    
    prediction = model.predict(features)[0]
    risk_label = {1: 'Low', 2: 'Medium', 3: 'High'}
    
    return jsonify({'prediction': risk_label[prediction]})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
