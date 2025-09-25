import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';
import { PredictionService } from '../services/PredictionService';
import { AssessmentHistoryEntry, FormState, PredictionResults, UserFormData } from '../types';
import { AppError, ERROR_CODES, ERROR_MESSAGES, ErrorHandler } from '../utils/errorHandling';

// Form actions
type FormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: Partial<UserFormData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_FORM' }
  | { type: 'SET_COMPLETE' }
  | { type: 'SET_VALID'; payload: boolean }
  | { type: 'ADD_HISTORY_ENTRY'; payload: AssessmentHistoryEntry }
  | { type: 'LOAD_HISTORY'; payload: AssessmentHistoryEntry[] }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'CLEAR_ERROR' };

// Initial form state
const initialFormState: FormState = {
  currentStep: 1,
  totalSteps: 7,
  isComplete: false,
  isValid: false,
  errors: {},
  data: {},
  history: [],
  error: null,
};

// Form reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };
    case 'RESET_FORM':
      return {
        ...initialFormState,
        history: state.history, // Preserve history
      };
    case 'SET_COMPLETE':
      return {
        ...state,
        isComplete: true,
      };
    case 'SET_VALID':
      return {
        ...state,
        isValid: action.payload,
      };
    case 'ADD_HISTORY_ENTRY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 10), // Keep last 10 entries
      };
    case 'LOAD_HISTORY':
      return {
        ...state,
        history: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context type
interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateFormData: (data: Partial<UserFormData>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  resetForm: () => void;
  validateCurrentStep: () => boolean;
  submitForm: () => Promise<PredictionResults>;
  goToResults: () => void;
  getLatestAssessment: () => AssessmentHistoryEntry | null;
  isLoaded: boolean;
  setError: (error: AppError) => void;
  clearError: () => void;
  handleError: (error: unknown, context: string) => void;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  FORM_DATA: 'chop_form_data',
  FORM_STEP: 'chop_form_step',
  FORM_COMPLETE: 'chop_form_complete',
  ASSESSMENT_HISTORY: 'chop_assessment_history',
};

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleError = useCallback((error: unknown, context: string) => {
    const appError = ErrorHandler.createError(
      ERROR_CODES.UNKNOWN_ERROR,
      ErrorHandler.getErrorMessage(error),
      error
    );
    dispatch({ type: 'SET_ERROR', payload: appError });
    ErrorHandler.logError(appError, context);
  }, []);

  const loadPersistedData = useCallback(async () => {
    try {
      const [formData, formStep, formComplete, historyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FORM_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.FORM_STEP),
        AsyncStorage.getItem(STORAGE_KEYS.FORM_COMPLETE),
        AsyncStorage.getItem(STORAGE_KEYS.ASSESSMENT_HISTORY),
      ]);

      if (formData) {
        const parsedData = JSON.parse(formData);
        dispatch({ type: 'UPDATE_DATA', payload: parsedData });
      }

      if (formStep) {
        const step = parseInt(formStep, 10);
        if (step >= 1 && step <= 7) {
          dispatch({ type: 'SET_STEP', payload: step });
        }
      }

      if (formComplete === 'true') {
        dispatch({ type: 'SET_COMPLETE' });
      }

      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        // Convert date strings back to Date objects
        const historyWithDates = parsedHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          completedAt: new Date(entry.completedAt),
        }));
        dispatch({ type: 'LOAD_HISTORY', payload: historyWithDates });
      }

      setIsLoaded(true);
    } catch (error) {
      handleError(error, 'loadPersistedData');
      setIsLoaded(true);
    }
  }, [handleError]);

  const savePersistedData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(state.data)),
        AsyncStorage.setItem(STORAGE_KEYS.FORM_STEP, state.currentStep.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.FORM_COMPLETE, state.isComplete.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.ASSESSMENT_HISTORY, JSON.stringify(state.history)),
      ]);
    } catch (error) {
      handleError(error, 'savePersistedData');
    }
  }, [state.data, state.currentStep, state.isComplete, state.history, handleError]);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  // Save data whenever state changes
  useEffect(() => {
    if (isLoaded) {
      savePersistedData();
    }
  }, [savePersistedData, isLoaded]);

  const nextStep = useCallback(() => {
    if (state.currentStep < state.totalSteps) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  }, [state.currentStep, state.totalSteps]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= state.totalSteps) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  }, [state.totalSteps]);

  const updateFormData = useCallback((data: Partial<UserFormData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', payload: errors });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    // Reset to step 1
    dispatch({ type: 'SET_STEP', payload: 1 });
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    const { currentStep, data } = state;
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!data.age || data.age < 13 || data.age > 100) {
          errors.age = 'Age must be between 13 and 100';
        }
        if (!data.gender) {
          errors.gender = 'Gender is required';
        }
        if (!data.height || data.height < 50 || data.height > 200) {
          errors.height = 'Height must be between 50 and 200 cm';
        }
        if (!data.weight || data.weight < 20 || data.weight > 200) {
          errors.weight = 'Weight must be between 20 and 200 kg';
        }
        break;
      case 2: // Family History
        if (!data.familyHistory) {
          errors.familyHistory = 'Please select at least one option';
        }
        break;
      case 3: // Physical Activity
        if (!data.physicalActivity) {
          errors.physicalActivity = 'Physical activity level is required';
        }
        break;
      case 4: // Screen Time
        if (data.screenTime === undefined || data.screenTime < 0 || data.screenTime > 24) {
          errors.screenTime = 'Screen time must be between 0 and 24 hours';
        }
        break;
      case 5: // Diet Habits
        if (!data.dietHabits) {
          errors.dietHabits = 'Diet habits are required';
        }
        break;
      case 6: // Sleep
        if (data.sleepHours === undefined || data.sleepHours < 0 || data.sleepHours > 24) {
          errors.sleepHours = 'Sleep hours must be between 0 and 24';
        }
        break;
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      dispatch({ type: 'SET_VALID', payload: false });
      return false;
    }

    clearErrors();
    dispatch({ type: 'SET_VALID', payload: true });
    return true;
  }, [state, setErrors, clearErrors]);

  const setError = useCallback((error: AppError) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    ErrorHandler.logError(error, 'FormContext');
  }, []);

  const submitForm = useCallback(async (): Promise<PredictionResults> => {
    try {
      // Use the prediction service for comprehensive analysis
      const results = PredictionService.predict(state.data as UserFormData);
      
      // Add to history
      const historyEntry: AssessmentHistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        formData: state.data as UserFormData,
        results,
        completedAt: new Date(),
      };
      
      dispatch({ type: 'ADD_HISTORY_ENTRY', payload: historyEntry });
      dispatch({ type: 'SET_COMPLETE' });
      return results;
    } catch (error) {
      const appError = ErrorHandler.createError(
        ERROR_CODES.FORM_SUBMISSION_FAILED,
        ERROR_MESSAGES[ERROR_CODES.FORM_SUBMISSION_FAILED],
        error
      );
      setError(appError);
      throw appError;
    }
  }, [state.data, setError]);

  const goToResults = useCallback(() => {
    // Mark form as complete and navigate to results step
    dispatch({ type: 'SET_COMPLETE' });
    dispatch({ type: 'SET_STEP', payload: 8 }); // Results screen
  }, []);

  const getLatestAssessment = useCallback((): AssessmentHistoryEntry | null => {
    return state.history.length > 0 ? state.history[0] : null;
  }, [state.history]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);


  const value: FormContextType = {
    state,
    dispatch,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    setErrors,
    clearErrors,
    resetForm,
    validateCurrentStep,
    submitForm,
    goToResults,
    getLatestAssessment,
    isLoaded,
    setError,
    clearError,
    handleError,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Hook to use form context
export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
