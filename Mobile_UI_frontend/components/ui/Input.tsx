import { BORDER_RADIUS, Colors, COMPONENTS, SHADOWS, SPACING, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      backgroundColor: colors.surface,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        height: COMPONENTS.input.height.sm,
        paddingHorizontal: COMPONENTS.input.padding.horizontal,
      },
      md: {
        height: COMPONENTS.input.height.md,
        paddingHorizontal: COMPONENTS.input.padding.horizontal,
      },
      lg: {
        height: COMPONENTS.input.height.lg,
        paddingHorizontal: COMPONENTS.input.padding.horizontal,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        borderColor: isFocused ? colors.primary : colors.border,
        ...SHADOWS.sm,
      },
      filled: {
        borderColor: 'transparent',
        backgroundColor: colors.background,
        ...SHADOWS.none,
      },
      outlined: {
        borderColor: isFocused ? colors.primary : colors.border,
        backgroundColor: 'transparent',
        ...SHADOWS.none,
      },
    };

    // Error styles
    const errorStyles: ViewStyle = error
      ? {
          borderColor: colors.error,
        }
      : {};

    // Focus styles
    const focusStyles: ViewStyle = isFocused
      ? {
          ...SHADOWS.md,
        }
      : {};

    // Full width
    const fullWidthStyles: ViewStyle = fullWidth ? { width: '100%' } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...errorStyles,
      ...focusStyles,
      ...fullWidthStyles,
    };
  };

  const getInputStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: Typography.body.fontSize,
      fontWeight: Typography.body.fontWeight,
      color: colors.textPrimary,
      paddingVertical: COMPONENTS.input.padding.vertical,
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      sm: { fontSize: Typography.caption.fontSize },
      md: { fontSize: Typography.body.fontSize },
      lg: { fontSize: Typography.bodyLarge.fontSize },
    };

    // Disabled styles
    const disabledStyles: TextStyle = (props as any).disabled
      ? { color: colors.textDisabled }
      : {};

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
      ...disabledStyles,
    };
  };

  const getLabelStyles = (): TextStyle => {
    return {
      ...Typography.label,
      color: error ? colors.error : colors.textPrimary,
      marginBottom: SPACING.xs,
      ...labelStyle,
    };
  };

  const getErrorStyles = (): TextStyle => {
    return {
      ...Typography.caption,
      color: colors.error,
      marginTop: SPACING.xs,
      ...errorStyle,
    };
  };

  const getHelperStyles = (): TextStyle => {
    return {
      ...Typography.caption,
      color: colors.textSecondary,
      marginTop: SPACING.xs,
      ...helperStyle,
    };
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={getLabelStyles()}>{label}</Text>}
      
      <View style={getContainerStyles()}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={[getInputStyles(), inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={getErrorStyles()}>{error}</Text>}
      {helperText && !error && <Text style={getHelperStyles()}>{helperText}</Text>}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
});
