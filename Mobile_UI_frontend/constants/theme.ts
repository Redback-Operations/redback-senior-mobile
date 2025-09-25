/**
 * Modern Health App Theme System
 * Inspired by Apple Health, Headspace, and Strava
 * Features calming colors, clean typography, and accessibility-first design
 */

import { Platform } from 'react-native';
import { COLORS, TYPOGRAPHY } from './design';

// Primary brand colors
// Deep purple for new brand theme
const tintColorLight = '#4B267A'; // Deep purple
const tintColorDark = '#6C3FB6';  // Lighter purple for dark mode

export const Colors = {
  light: {
  // Core colors
  text: '#4B267A', // Headings and primary text in purple
  background: COLORS.background.primary,
  surface: COLORS.background.elevated,

  // Navigation
  tint: tintColorLight,
  icon: tintColorLight,
  tabIconDefault: COLORS.text.tertiary,
  tabIconSelected: tintColorLight,

  // Semantic colors
  primary: tintColorLight,
  secondary: '#6C3FB6',
  success: COLORS.success[500],
  warning: COLORS.warning[500],
  error: COLORS.error[500],
  info: COLORS.info[500],

  // Text hierarchy
  textPrimary: '#4B267A', // Headings
  textSecondary: COLORS.text.secondary,
  textTertiary: COLORS.text.tertiary,
  textInverse: COLORS.text.inverse,
  textDisabled: COLORS.text.disabled,

  // Borders and dividers
  border: COLORS.border.medium,
  borderLight: COLORS.border.light,
  borderMedium: COLORS.border.medium,
  borderDark: COLORS.border.dark,

  // Interactive states
  pressed: '#E9D5FF', // Light lavender for pressed
  focused: '#6C3FB6', // Lighter purple for focus
  selected: '#E9D5FF', // Lavender for selected
  },
  dark: {
  // Core colors
  text: tintColorDark,
  background: COLORS.backgroundDark.primary,
  surface: COLORS.backgroundDark.elevated,

  // Navigation
  tint: tintColorDark,
  icon: tintColorDark,
  tabIconDefault: COLORS.textDark.tertiary,
  tabIconSelected: tintColorDark,

  // Semantic colors
  primary: tintColorDark,
  secondary: '#B39DDB',
  success: COLORS.success[400],
  warning: COLORS.warning[400],
  error: COLORS.error[400],
  info: COLORS.info[400],

  // Text hierarchy
  textPrimary: tintColorDark,
  textSecondary: COLORS.textDark.secondary,
  textTertiary: COLORS.textDark.tertiary,
  textInverse: COLORS.textDark.inverse,
  textDisabled: COLORS.textDark.disabled,

  // Borders and dividers
  border: COLORS.borderDark.medium,
  borderLight: COLORS.borderDark.light,
  borderMedium: COLORS.borderDark.medium,
  borderDark: COLORS.borderDark.dark,

  // Interactive states
  pressed: '#4B267A', // Deep purple for pressed
  focused: '#B39DDB', // Light purple for focus
  selected: '#6C3FB6', // Lighter purple for selected
  },
};

// Typography system with improved font stack
export const Fonts = Platform.select({
  ios: {
    /** iOS system fonts with health app optimization */
    regular: 'SF Pro Text',
    medium: 'SF Pro Text',
    semiBold: 'SF Pro Text',
    bold: 'SF Pro Text',
    display: 'SF Pro Display',
    rounded: 'SF Pro Rounded',
    mono: 'SF Mono',
  },
  android: {
    /** Android system fonts */
    regular: 'Roboto',
    medium: 'Roboto',
    semiBold: 'Roboto',
    bold: 'Roboto',
    display: 'Roboto',
    rounded: 'Roboto',
    mono: 'Roboto Mono',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    display: 'System',
    rounded: 'System',
    mono: 'monospace',
  },
  web: {
    /** Web font stack with Inter as primary */
    regular: TYPOGRAPHY.fontFamily.web.regular,
    medium: TYPOGRAPHY.fontFamily.web.medium,
    semiBold: TYPOGRAPHY.fontFamily.web.semiBold,
    bold: TYPOGRAPHY.fontFamily.web.bold,
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    rounded: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: "SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Typography scale for consistent text styling
export const Typography = {
  // Font weights for easy access
  fontWeight: TYPOGRAPHY.fontWeight,
  
  // Headings
  h1: {
    fontSize: TYPOGRAPHY.fontSize['5xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.fontSize['5xl'] * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  h2: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.fontSize['4xl'] * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
  },
  h3: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    lineHeight: TYPOGRAPHY.fontSize['3xl'] * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  h4: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    lineHeight: TYPOGRAPHY.fontSize['2xl'] * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  h5: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  h6: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  
  // Body text
  body: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  
  // Labels and captions
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
  },
  
  // Button text
  button: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  buttonLarge: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
};

// Export design tokens for easy access
export { ACCESSIBILITY, ANIMATIONS, BORDER_RADIUS, COLORS, COMPONENTS, SHADOWS, SPACING, TYPOGRAPHY } from './design';

