Outcome Modelling – Cost of Healthcare Analysis

This repository contains all code, scripts, and documentation developed for the Outcome Modelling task of the Cost of Healthcare Analysis as part of the Redback project.

The focus of this work was on:
Cleaning healthcare data
Engineering temporal features
Training predictive models
Producing interpretable forecasts of Infant & Young Child Mortality Rates

Features
Data Cleaning
Handled missing values, duplicates, and inconsistent entries in health indicators
Restricted incompatible units to ensure valid modelling inputs
Exploratory Data Analysis (EDA)
Histograms, boxplots, correlation heatmaps, and time-series plots to uncover trends and distributions

Feature Engineering
Restructured dataset into panel format (State × Year)
Created lag features (lag1, lag2) for temporal prediction
Predictive Modelling
Random Forest with RandomizedSearchCV using time-series cross-validation
Evaluation metrics: R² and MAE

Interpretability
Permutation Importance to measure prediction sensitivity
SHAP values to quantify feature contributions
Scenario & Forecasting Analysis
Sensitivity testing (±5%, ±10% adjustments) to assess policy impacts
Short-term forecasts for 2020 based on latest lag values
