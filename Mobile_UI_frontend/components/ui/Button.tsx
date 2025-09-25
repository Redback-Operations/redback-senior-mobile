import { BORDER_RADIUS, Colors, COMPONENTS, SHADOWS, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  ViewStyle
} from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  hapticFeedback = true,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.lg,
      ...SHADOWS.sm,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        height: COMPONENTS.button.height.sm,
        paddingHorizontal: COMPONENTS.button.padding.sm.horizontal,
        paddingVertical: COMPONENTS.button.padding.sm.vertical,
      },
      md: {
        height: COMPONENTS.button.height.md,
        paddingHorizontal: COMPONENTS.button.padding.md.horizontal,
        paddingVertical: COMPONENTS.button.padding.md.vertical,
      },
      lg: {
        height: COMPONENTS.button.height.lg,
        paddingHorizontal: COMPONENTS.button.padding.lg.horizontal,
        paddingVertical: COMPONENTS.button.padding.lg.vertical,
      },
      xl: {
        height: COMPONENTS.button.height.xl,
        paddingHorizontal: COMPONENTS.button.padding.xl.horizontal,
        paddingVertical: COMPONENTS.button.padding.xl.vertical,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
        ...SHADOWS.md,
      },
      secondary: {
        backgroundColor: colors.secondary,
        ...SHADOWS.md,
      },
      ghost: {
        backgroundColor: 'transparent',
        ...SHADOWS.none,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        ...SHADOWS.none,
      },
      danger: {
        backgroundColor: colors.error,
        ...SHADOWS.md,
      },
    };

    // Disabled styles
    const disabledStyles: ViewStyle = disabled
      ? {
          backgroundColor: colors.textDisabled,
          opacity: 0.6,
          ...SHADOWS.none,
        }
      : {};

    // Full width
    const fullWidthStyles: ViewStyle = fullWidth ? { width: '100%' } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyles,
      ...fullWidthStyles,
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      textAlign: 'center',
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      sm: Typography.caption,
      md: Typography.button,
      lg: Typography.buttonLarge,
      xl: Typography.h6,
    };

    // Variant text styles
    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: colors.textInverse },
      secondary: { color: colors.textInverse },
      ghost: { color: colors.primary },
      outline: { color: colors.textPrimary },
      danger: { color: colors.textInverse },
    };

    // Disabled text styles
    const disabledTextStyles: TextStyle = disabled
      ? { color: colors.textDisabled }
      : {};

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...disabledTextStyles,
    };
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyles(),
        pressed && !disabled && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' || variant === 'outline' ? colors.primary : colors.textInverse}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyles(), textStyle]} numberOfLines={0} flexShrink={1}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

// Preset button styles for common use cases
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="secondary" />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="ghost" />
);

export const OutlineButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="outline" />
);

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="danger" />
);
