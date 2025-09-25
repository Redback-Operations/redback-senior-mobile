// Modern Health App Design System - Apple Health / Headspace inspired
export const COLORS = {
  // Calming Primary Colors - Mint Green & Soft Blue
  primary: {
    50: '#F0FDFA',   // Very light mint
    100: '#CCFBF1',  // Light mint
    200: '#99F6E4',  // Soft mint
    300: '#5EEAD4',  // Medium mint
    400: '#2DD4BF',  // Mint green
    500: '#14B8A6',  // Main primary - calming teal
    600: '#0D9488',  // Darker teal
    700: '#0F766E',  // Dark teal
    800: '#115E59',  // Very dark teal
    900: '#134E4A',  // Darkest teal
  },
  
  // Secondary Colors - Soft Blue
  secondary: {
    50: '#F0F9FF',   // Very light blue
    100: '#E0F2FE',  // Light blue
    200: '#BAE6FD',  // Soft blue
    300: '#7DD3FC',  // Medium blue
    400: '#38BDF8',  // Blue
    500: '#0EA5E9',  // Main secondary - soft blue
    600: '#0284C7',  // Darker blue
    700: '#0369A1',  // Dark blue
    800: '#075985',  // Very dark blue
    900: '#0C4A6E',  // Darkest blue
  },
  
  // Accent Colors - Energetic but sparingly used
  accent: {
    orange: '#FF8A65',    // Warm coral
    coral: '#FF7043',     // Vibrant coral
    lime: '#C6F6D5',      // Soft lime
    lavender: '#E9D5FF',  // Soft lavender
  },
  
  // Neutral Colors - Clean and minimal
  neutral: {
    0: '#FFFFFF',    // Pure white
    50: '#FAFAFA',   // Off-white
    100: '#F5F5F5',  // Light gray
    200: '#E5E5E5',  // Very light gray
    300: '#D4D4D4',  // Light gray
    400: '#A3A3A3',  // Medium light gray
    500: '#737373',  // Medium gray
    600: '#525252',  // Dark gray
    700: '#404040',  // Darker gray
    800: '#262626',  // Very dark gray
    900: '#171717',  // Almost black
    950: '#0A0A0A',  // Near black
  },
  
  // Semantic Colors - Health-focused
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    400: '#4ADE80',  // Light success
    500: '#22C55E',  // Main success
    600: '#16A34A',
    700: '#15803D',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    400: '#FBBF24',  // Light warning
    500: '#F59E0B',  // Main warning
    600: '#D97706',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    400: '#F87171',  // Light error
    500: '#EF4444',  // Main error
    600: '#DC2626',
    700: '#B91C1C',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    400: '#60A5FA',  // Light info
    500: '#3B82F6',  // Main info
    600: '#2563EB',
    700: '#1D4ED8',
  },
  
  // Background Colors - Light mode
  background: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#FAFAFA',   // Off-white
    tertiary: '#F5F5F5',    // Light gray
    elevated: '#FFFFFF',    // Card background
  },
  
  // Background Colors - Dark mode
  backgroundDark: {
    primary: '#0A0A0A',     // Near black
    secondary: '#171717',   // Dark gray
    tertiary: '#262626',    // Medium dark gray
    elevated: '#1F1F1F',    // Card background
  },
  
  // Text Colors - Light mode
  text: {
    primary: '#171717',     // Almost black
    secondary: '#525252',   // Dark gray
    tertiary: '#737373',    // Medium gray
    inverse: '#FFFFFF',     // White
    disabled: '#A3A3A3',    // Light gray
  },
  
  // Text Colors - Dark mode
  textDark: {
    primary: '#FAFAFA',     // Off-white
    secondary: '#D4D4D4',   // Light gray
    tertiary: '#A3A3A3',    // Medium gray
    inverse: '#171717',     // Almost black
    disabled: '#737373',    // Dark gray
  },
  
  // Border Colors - Light mode
  border: {
    light: '#F5F5F5',       // Very light gray
    medium: '#E5E5E5',      // Light gray
    dark: '#D4D4D4',        // Medium light gray
    focus: '#14B8A6',       // Primary color for focus
  },
  
  // Border Colors - Dark mode
  borderDark: {
    light: '#262626',       // Dark gray
    medium: '#404040',      // Medium dark gray
    dark: '#525252',        // Medium gray
    focus: '#5EEAD4',       // Light primary for focus
  },
};

export const TYPOGRAPHY = {
  // Font Families - Clean sans-serif (Inter, SF Pro, Manrope inspired)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    // Web fallbacks for better typography
    web: {
      regular: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      medium: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      semiBold: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bold: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
  
  // Font Sizes - Increased for better readability
  fontSize: {
    xs: 12,      // Caption text
    sm: 14,      // Small labels
    base: 16,    // Body text
    lg: 18,      // Large body text
    xl: 20,      // Small headings
    '2xl': 24,   // Medium headings
    '3xl': 30,   // Large headings
    '4xl': 36,   // Extra large headings
    '5xl': 42,   // Hero headings
    '6xl': 48,   // Display headings
  },
  
  // Font Weights - Clean and readable
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  
  // Line Heights - Increased for better readability
  lineHeight: {
    tight: 1.2,      // For large headings
    normal: 1.4,     // For body text
    relaxed: 1.6,    // For better readability
    loose: 1.8,      // For long-form content
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

export const SPACING = {
  // 8pt spacing grid for consistent layout
  xs: 4,        // 0.25rem
  sm: 8,        // 0.5rem
  md: 16,       // 1rem
  lg: 24,       // 1.5rem
  xl: 32,       // 2rem
  '2xl': 40,    // 2.5rem
  '3xl': 48,    // 3rem
  '4xl': 64,    // 4rem
  '5xl': 80,    // 5rem
  '6xl': 96,    // 6rem
};

export const BORDER_RADIUS = {
  none: 0,
  xs: 2,        // Very small radius
  sm: 4,        // Small radius
  md: 8,        // Medium radius
  lg: 12,       // Large radius
  xl: 16,       // Extra large radius
  '2xl': 20,    // 2x large radius
  '3xl': 24,    // 3x large radius
  full: 9999,   // Fully rounded
};

export const SHADOWS = {
  // Subtle, natural depth shadows
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Animation and Transition Tokens
export const ANIMATIONS = {
  // Easing curves for smooth animations
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom easing for health app feel
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // Duration values
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 750,
    slowest: 1000,
  },
  
  // Common animation presets
  presets: {
    fadeIn: {
      duration: 300,
      easing: 'ease-out',
    },
    slideUp: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    scaleIn: {
      duration: 200,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    bounceIn: {
      duration: 500,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

// Accessibility Tokens
export const ACCESSIBILITY = {
  // Minimum touch target sizes (44pt minimum)
  touchTarget: {
    minimum: 44,
    comfortable: 48,
    large: 56,
  },
  
  // High contrast ratios for accessibility
  contrast: {
    normal: 4.5,    // WCAG AA
    large: 3.0,     // WCAG AA for large text
    enhanced: 7.0,  // WCAG AAA
  },
  
  // Focus indicators
  focus: {
    width: 2,
    offset: 2,
    style: 'solid',
  },
};

// Component-specific design tokens
export const COMPONENTS = {
  // Button styles
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
      xl: 60,
    },
    padding: {
      sm: { horizontal: 16, vertical: 8 },
      md: { horizontal: 24, vertical: 12 },
      lg: { horizontal: 32, vertical: 16 },
      xl: { horizontal: 40, vertical: 20 },
    },
  },
  
  // Card styles
  card: {
    padding: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    },
    margin: {
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },
  
  // Input styles
  input: {
    height: {
      sm: 40,
      md: 48,
      lg: 56,
    },
    padding: {
      horizontal: 16,
      vertical: 12,
    },
  },
  
  // Progress indicators
  progress: {
    height: {
      sm: 4,
      md: 6,
      lg: 8,
    },
    borderRadius: 'full',
  },
};

// Diet-specific colors for frequency options (updated with new color palette)
export const DIET_FREQUENCY_COLORS = {
  never: {
    bg: COLORS.success[50],
    border: '#BBF7D0',
    text: COLORS.success[700],
    icon: COLORS.success[500],
  },
  rarely: {
    bg: COLORS.warning[50],
    border: '#FDE68A',
    text: COLORS.warning[700],
    icon: COLORS.warning[500],
  },
  sometimes: {
    bg: COLORS.error[50],
    border: '#FECACA',
    text: COLORS.error[700],
    icon: COLORS.error[500],
  },
  often: {
    bg: COLORS.accent.lavender,
    border: '#C4B5FD',
    text: '#7C3AED',
    icon: '#8B5CF6',
  },
  daily: {
    bg: COLORS.info[50],
    border: '#DBEAFE',
    text: COLORS.info[700],
    icon: COLORS.info[500],
  },
};

// Health-specific color coding
export const HEALTH_COLORS = {
  excellent: COLORS.success[500],
  good: COLORS.primary[500],
  fair: COLORS.warning[500],
  poor: COLORS.error[500],
  critical: COLORS.error[700],
};

// Theme configuration
export const THEME = {
  light: {
    background: COLORS.background.primary,
    surface: COLORS.background.elevated,
    text: COLORS.text.primary,
    textSecondary: COLORS.text.secondary,
    border: COLORS.border.medium,
    primary: COLORS.primary[500],
    secondary: COLORS.secondary[500],
  },
  dark: {
    background: COLORS.backgroundDark.primary,
    surface: COLORS.backgroundDark.elevated,
    text: COLORS.textDark.primary,
    textSecondary: COLORS.textDark.secondary,
    border: COLORS.borderDark.medium,
    primary: COLORS.primary[400],
    secondary: COLORS.secondary[400],
  },
};
