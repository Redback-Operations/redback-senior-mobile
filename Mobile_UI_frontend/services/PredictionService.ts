import { PredictionResults, UserFormData } from '@/types';

export interface SHAPValue {
  feature: string;
  value: number;
  impact: number;
  description: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export class PredictionService {
  /**
   * Calculate BMI using the standard formula
   */
  static calculateBMI(weight: number, height: number): number {
    return weight / Math.pow(height / 100, 2);
  }

  /**
   * Determine BMI category based on WHO standards
   */
  static getBMICategory(bmi: number): {
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
    description: string;
    color: string;
  } {
    if (bmi < 18.5) {
      return {
        category: 'underweight',
        description: 'Underweight - Consider gaining weight healthily',
        color: '#FF9800'
      };
    } else if (bmi < 25) {
      return {
        category: 'normal',
        description: 'Normal weight - Great job maintaining a healthy weight!',
        color: '#4CAF50'
      };
    } else if (bmi < 30) {
      return {
        category: 'overweight',
        description: 'Overweight - Consider lifestyle changes to reduce weight',
        color: '#FF5722'
      };
    } else {
      return {
        category: 'obese',
        description: 'Obese - Consult a healthcare professional for guidance',
        color: '#F44336'
      };
    }
  }

  /**
   * Calculate risk factors and their weights
   */
  static calculateRiskFactors(data: UserFormData): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // BMI Risk
    const bmi = this.calculateBMI(data.weight, data.height);
    const bmiCategory = this.getBMICategory(bmi);
    if (bmiCategory.category !== 'normal') {
      factors.push({
        name: 'BMI Level',
        score: bmiCategory.category === 'underweight' ? -15 : -25,
        weight: 0.3,
        description: `BMI of ${bmi.toFixed(1)} is ${bmiCategory.category}`
      });
    }

    // Physical Activity Risk
    const activityScores = {
      sedentary: -20,
      light: -10,
      moderate: 0,
      active: 5,
      very_active: 10
    };
    factors.push({
      name: 'Physical Activity',
      score: activityScores[data.physicalActivity],
      weight: 0.2,
      description: `${data.physicalActivity.replace('_', ' ')} activity level`
    });

    // Screen Time Risk
    const screenTimeScore = data.screenTime > 8 ? -15 : data.screenTime > 6 ? -8 : 0;
    factors.push({
      name: 'Screen Time',
      score: screenTimeScore,
      weight: 0.15,
      description: `${data.screenTime} hours daily screen time`
    });

    // Sleep Risk
    const sleepScore = data.sleepHours < 6 || data.sleepHours > 9 ? -15 : 0;
    factors.push({
      name: 'Sleep Quality',
      score: sleepScore,
      weight: 0.15,
      description: `${data.sleepHours} hours of sleep per night`
    });

    // Diet Risk
    let dietScore = 0;
    if (data.dietHabits) {
      const dietScores = {
        never: 5,
        rarely: 2,
        sometimes: 0,
        often: -5,
        daily: -10
      };
      
      dietScore += dietScores[data.dietHabits.fastFood] || 0;
      dietScore += dietScores[data.dietHabits.vegetables] || 0;
      dietScore += dietScores[data.dietHabits.fruits] || 0;
      dietScore += dietScores[data.dietHabits.water] || 0;
    }
    factors.push({
      name: 'Diet Habits',
      score: dietScore,
      weight: 0.1,
      description: 'Overall diet quality assessment'
    });

    // Family History Risk
    const hasFamilyHistory = data.familyHistory && !data.familyHistory.none;
    factors.push({
      name: 'Family History',
      score: hasFamilyHistory ? -10 : 0,
      weight: 0.1,
      description: hasFamilyHistory ? 'Family history of health conditions' : 'No significant family history'
    });

    return factors;
  }

  /**
   * Generate mock SHAP values for explainability
   */
  static generateSHAPValues(data: UserFormData): SHAPValue[] {
    const bmi = this.calculateBMI(data.weight, data.height);
    const bmiCategory = this.getBMICategory(bmi);
    
    const shapValues: SHAPValue[] = [
      {
        feature: 'BMI Level',
        value: bmi,
        impact: bmiCategory.category !== 'normal' ? (bmiCategory.category === 'underweight' ? -15 : -25) : 0,
        description: `BMI of ${bmi.toFixed(1)} (${bmiCategory.category})`
      },
      {
        feature: 'Physical Activity',
        value: this.getActivityNumericValue(data.physicalActivity),
        impact: this.getActivityImpact(data.physicalActivity),
        description: `${data.physicalActivity.replace('_', ' ')} activity level`
      },
      {
        feature: 'Sleep Hours',
        value: data.sleepHours,
        impact: data.sleepHours < 6 || data.sleepHours > 9 ? -15 : 0,
        description: `${data.sleepHours} hours per night`
      },
      {
        feature: 'Screen Time',
        value: data.screenTime,
        impact: data.screenTime > 8 ? -15 : data.screenTime > 6 ? -8 : 0,
        description: `${data.screenTime} hours daily`
      },
      {
        feature: 'Diet Quality',
        value: this.calculateDietScore(data.dietHabits),
        impact: this.calculateDietImpact(data.dietHabits),
        description: 'Overall diet quality score'
      }
    ];

    // Sort by absolute impact value
    return shapValues.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }

  /**
   * Calculate overall health score
   */
  static calculateHealthScore(data: UserFormData): number {
    const riskFactors = this.calculateRiskFactors(data);
    let baseScore = 100;

    riskFactors.forEach(factor => {
      baseScore += factor.score * factor.weight;
    });

    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  /**
   * Calculate confidence score based on data completeness and consistency
   */
  static calculateConfidenceScore(data: UserFormData): number {
    let confidence = 100;

    // Check data completeness
    const requiredFields = ['age', 'gender', 'height', 'weight', 'physicalActivity', 'screenTime', 'sleepHours'];
    const missingFields = requiredFields.filter(field => !data[field as keyof UserFormData]);
    confidence -= missingFields.length * 10;

    // Check for inconsistent data
    if (data.age && (data.age < 13 || data.age > 100)) confidence -= 15;
    if (data.height && (data.height < 50 || data.height > 250)) confidence -= 15;
    if (data.weight && (data.weight < 20 || data.weight > 300)) confidence -= 15;
    if (data.screenTime && data.screenTime > 24) confidence -= 10;
    if (data.sleepHours && data.sleepHours > 24) confidence -= 10;

    return Math.max(60, Math.min(100, confidence));
  }

  /**
   * Generate personalized recommendations
   */
  static generateRecommendations(data: UserFormData, riskFactors: RiskFactor[]): string[] {
    const recommendations: string[] = [];

    // BMI recommendations
    const bmi = this.calculateBMI(data.weight, data.height);
    const bmiCategory = this.getBMICategory(bmi);
    if (bmiCategory.category !== 'normal') {
      if (bmiCategory.category === 'underweight') {
        recommendations.push('Consider consulting a nutritionist for healthy weight gain strategies');
      } else {
        recommendations.push('Focus on a balanced diet and regular exercise for weight management');
      }
    }

    // Physical activity recommendations
    if (data.physicalActivity === 'sedentary') {
      recommendations.push('Start with 30 minutes of moderate exercise daily');
    } else if (data.physicalActivity === 'light') {
      recommendations.push('Gradually increase exercise intensity and duration');
    }

    // Screen time recommendations
    if (data.screenTime && data.screenTime > 8) {
      recommendations.push('Reduce screen time and take regular breaks every 30 minutes');
    }

    // Sleep recommendations
    if (data.sleepHours && (data.sleepHours < 6 || data.sleepHours > 9)) {
      recommendations.push('Aim for 7-9 hours of quality sleep per night');
    }

    // Diet recommendations
    if (data.dietHabits) {
      if (data.dietHabits.fastFood === 'often' || data.dietHabits.fastFood === 'daily') {
        recommendations.push('Reduce fast food consumption and cook more meals at home');
      }
      if (data.dietHabits.vegetables === 'rarely' || data.dietHabits.vegetables === 'never') {
        recommendations.push('Increase daily vegetable consumption to at least 5 servings');
      }
      if (data.dietHabits.water === 'rarely' || data.dietHabits.water === 'never') {
        recommendations.push('Drink at least 8 glasses of water daily');
      }
    }

    // Family history recommendations
    if (data.familyHistory && !data.familyHistory.none) {
      recommendations.push('Schedule regular health checkups and monitoring');
    }

    return recommendations;
  }

  /**
   * Main prediction method
   */
  static predict(data: UserFormData): PredictionResults {
    const bmi = this.calculateBMI(data.weight, data.height);
    const bmiCategory = this.getBMICategory(bmi);
    const riskFactors = this.calculateRiskFactors(data);
    const healthScore = this.calculateHealthScore(data);
    const confidenceScore = this.calculateConfidenceScore(data);
    const recommendations = this.generateRecommendations(data, riskFactors);

    // Generate risk factors list
    const riskFactorNames = riskFactors
      .filter(factor => factor.score < 0)
      .map(factor => factor.description);

    return {
      bmi,
      bmiCategory: bmiCategory.category,
      healthScore,
      riskFactors: riskFactorNames,
      recommendations,
      confidenceScore,
      timestamp: new Date(),
    };
  }

  // Helper methods
  private static getActivityNumericValue(activity: string): number {
    const values = { sedentary: 1, light: 2, moderate: 3, active: 4, very_active: 5 };
    return values[activity as keyof typeof values] || 3;
  }

  private static getActivityImpact(activity: string): number {
    const impacts = { sedentary: -20, light: -10, moderate: 0, active: 5, very_active: 10 };
    return impacts[activity as keyof typeof impacts] || 0;
  }

  private static calculateDietScore(dietHabits: any): number {
    if (!dietHabits) return 0;
    
    const scores = { never: 5, rarely: 2, sometimes: 0, often: -5, daily: -10 };
    let score = 0;
    
    score += scores[dietHabits.fastFood] || 0;
    score += scores[dietHabits.vegetables] || 0;
    score += scores[dietHabits.fruits] || 0;
    score += scores[dietHabits.water] || 0;
    
    return score;
  }

  private static calculateDietImpact(dietHabits: any): number {
    return this.calculateDietScore(dietHabits);
  }
}
