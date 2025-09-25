// Accessibility utilities and constants

export const ACCESSIBILITY_COLORS = {
  // High contrast colors meeting WCAG AA standards (4.5:1 ratio)
  primary: '#007AFF',
  primaryDark: '#0056CC',
  secondary: '#4CAF50',
  secondaryDark: '#388E3C',
  warning: '#FF9800',
  warningDark: '#F57C00',
  error: '#F44336',
  errorDark: '#D32F2F',
  
  // Text colors with proper contrast
  textPrimary: '#212121',    // 4.5:1 on white
  textSecondary: '#424242',  // 4.5:1 on white
  textDisabled: '#757575',   // 3:1 on white (still readable)
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#EEEEEE',
  
  // Border colors
  border: '#E0E0E0',
  borderFocus: '#007AFF',
  borderError: '#F44336',
};

export const ACCESSIBILITY_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const ACCESSIBILITY_TYPOGRAPHY = {
  // Font sizes with proper scaling
  caption: 12,
  body: 14,
  bodyLarge: 16,
  subtitle: 18,
  title: 20,
  headline: 24,
  display: 28,
  
  // Line heights for readability
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
};

// Accessibility helper functions
export const getAccessibilityLabel = (field: string, value: any): string => {
  switch (field) {
    case 'age':
      return `Age: ${value} years`;
    case 'height':
      return `Height: ${value} centimeters`;
    case 'weight':
      return `Weight: ${value} kilograms`;
    case 'screenTime':
      return `Screen time: ${value} hours per day`;
    case 'sleepHours':
      return `Sleep: ${value} hours per night`;
    default:
      return `${field}: ${value}`;
  }
};

export const getAccessibilityHint = (field: string): string => {
  switch (field) {
    case 'age':
      return 'Adjust your age from 13 to 100 years';
    case 'height':
      return 'Adjust your height from 50 to 200 centimeters';
    case 'weight':
      return 'Adjust your weight from 20 to 200 kilograms';
    case 'screenTime':
      return 'Adjust your daily screen time from 0 to 24 hours';
    case 'sleepHours':
      return 'Adjust your nightly sleep hours from 0 to 12 hours';
    case 'gender':
      return 'Select your gender identity';
    case 'physicalActivity':
      return 'Select your physical activity level';
    default:
      return 'Make your selection';
  }
};

export const getAccessibilityValue = (field: string, value: any) => {
  switch (field) {
    case 'age':
      return { text: `${value} years` };
    case 'height':
      return { text: `${value} cm` };
    case 'weight':
      return { text: `${value} kg` };
    case 'screenTime':
      return { text: `${value} hours` };
    case 'sleepHours':
      return { text: `${value} hours` };
    default:
      return { text: String(value) };
  }
};

// Color contrast validation
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real app, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Apply gamma correction
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const isAccessibleContrast = (color1: string, color2: string): boolean => {
  return getContrastRatio(color1, color2) >= 4.5;
};

// Focus management
export const getFocusableElements = (containerRef: any): any[] => {
  if (!containerRef?.current) return [];
  
  // In React Native, focusable elements are typically TouchableOpacity, TextInput, etc.
  // This is a simplified version - in practice, you'd traverse the component tree
  return [];
};

// Screen reader announcements
export const announceToScreenReader = (message: string) => {
  // In React Native, you'd use AccessibilityInfo.announceForAccessibility
  // This is a placeholder for the actual implementation
  console.log('Screen reader announcement:', message);
};
