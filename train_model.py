# train_model.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load dataset
df = pd.read_csv("data/sample_dataset.csv")

# Ensure required columns exist (fallback if missing)
df['sleep_duration'] = df.get('sleep_duration', pd.Series([8] * len(df)))  # default 8 hours
df['diet_quality'] = df.get('diet_quality', pd.Series([2] * len(df)))      # 1=Poor, 2=Avg, 3=Good

# Encode categorical features
for col in ['income', 'location', 'obesity_risk']:
    if df[col].dtype == 'object':
        df[col] = LabelEncoder().fit_transform(df[col])

# Define features and labels
features = ['screen_time', 'physical_activity', 'sleep_duration', 'diet_quality', 'income', 'location']
X = df[features]
y = df['obesity_risk']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and metadata
os.makedirs("models", exist_ok=True)
joblib.dump(model, 'models/classifier.pkl')
joblib.dump(features, 'models/feature_names.pkl')
joblib.dump(model.feature_importances_, 'models/feature_weights.pkl')

print("✅ Model trained and saved.")
