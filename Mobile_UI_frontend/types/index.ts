// Import error handling types
import { AppError } from '@/utils/errorHandling';

// User form data interfaces
export interface UserFormData {
  // Screen 1: Basic Info
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  
  // Screen 2: Family History
  familyHistory: {
    diabetes: boolean;
    heartDisease: boolean;
    highBloodPressure: boolean;
    cancer: boolean;
    none: boolean;
  };
  
  // Screen 3: Physical Activity
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  
  // Screen 4: Screen Time
  screenTime: number; // hours per day
  
  // Screen 5: Diet Habits
  dietHabits: {
    fastFood: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
    vegetables: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
    fruits: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
    water: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
    alcohol: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
  };
  
  // Screen 6: Sleep
  sleepHours: number; // hours per night
}

// Prediction results interface
export interface PredictionResults {
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
  healthScore: number; // 0-100
  riskFactors: string[];
  recommendations: string[];
  confidenceScore: number; // 0-100
  timestamp: Date;
}

// Assessment history entry
export interface AssessmentHistoryEntry {
  id: string;
  timestamp: Date;
  formData: UserFormData;
  results: PredictionResults;
  completedAt: Date;
}

// Form state management
export interface FormState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  data: Partial<UserFormData>;
  history: AssessmentHistoryEntry[];
  error: AppError | null;
}

// Form step configuration
export interface FormStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isRequired: boolean;
}

// Validation rules
export interface ValidationRules {
  age: {
    min: number;
    max: number;
    required: boolean;
  };
  height: {
    min: number;
    max: number;
    required: boolean;
  };
  weight: {
    min: number;
    max: number;
    required: boolean;
  };
  screenTime: {
    min: number;
    max: number;
    required: boolean;
  };
  sleepHours: {
    min: number;
    max: number;
    required: boolean;
  };
}

// Constants
export const VALIDATION_RULES: ValidationRules = {
  age: { min: 13, max: 100, required: true },
  height: { min: 50, max: 200, required: true },
  weight: { min: 20, max: 200, required: true },
  screenTime: { min: 0, max: 24, required: true },
  sleepHours: { min: 0, max: 24, required: true },
};

export const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Tell us about yourself',
    fields: ['age', 'gender', 'height', 'weight'],
    isRequired: true,
  },
  {
    id: 2,
    title: 'Family History',
    description: 'Any family health history?',
    fields: ['familyHistory'],
    isRequired: true,
  },
  {
    id: 3,
    title: 'Physical Activity',
    description: 'How active are you?',
    fields: ['physicalActivity'],
    isRequired: true,
  },
  {
    id: 4,
    title: 'Screen Time',
    description: 'How much screen time daily?',
    fields: ['screenTime'],
    isRequired: true,
  },
  {
    id: 5,
    title: 'Diet Habits',
    description: 'Tell us about your eating habits',
    fields: ['dietHabits'],
    isRequired: true,
  },
  {
    id: 6,
    title: 'Sleep Patterns',
    description: 'How much do you sleep?',
    fields: ['sleepHours'],
    isRequired: true,
  },
  {
    id: 7,
    title: 'Review & Submit',
    description: 'Review your information',
    fields: [],
    isRequired: false,
  },
];


