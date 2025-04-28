import sys
import pickle

# Load your pre-trained model
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Get user input from arguments
fund_type = sys.argv[1]
sector = sys.argv[2]
historical_returns = float(sys.argv[3])
volatility = float(sys.argv[4])

# Make the prediction based on the input
features = [fund_type, sector, historical_returns, volatility]
prediction = model.predict([features])

# Return the predicted risk level and returns
risk_level = prediction[0][0]  # Adjust based on your model output
returns = prediction[0][1]  # Adjust based on your model output

print(f'{risk_level},{returns}')
