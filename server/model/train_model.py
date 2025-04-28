# train_model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Load data
df = pd.read_csv("../data/funds_data.csv")

# Features to use
features = [
    'returns_1yr', 'returns_3yr', 'returns_5yr',
    'expense_ratio', 'fund_size_cr', 'fund_age_yr',
    'alpha', 'beta', 'sd', 'sharpe', 'sortino'
]

# Include target
required_cols = features + ['risk_level']
df = df[required_cols]

# Replace '-' with NaN
df.replace('-', np.nan, inplace=True)

# Convert features to numeric
for col in features:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Drop rows with any NaNs
df.dropna(inplace=True)

# Features and target
X = df[features]
y = df['risk_level'].astype(int)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("📊 Classification Report:\n", classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "risk_prediction_model.pkl")
print("✅ Model saved as 'risk_prediction_model.pkl'")
