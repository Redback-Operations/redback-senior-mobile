import { BORDER_RADIUS, Colors, COMPONENTS, SHADOWS, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  hapticFeedback?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'md',
  onPress,
  disabled = false,
  style,
  hapticFeedback = true,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.xl,
      overflow: 'hidden',
    };

    // Padding styles
    const paddingStyles: Record<string, ViewStyle> = {
      sm: { padding: COMPONENTS.card.padding.sm },
      md: { padding: COMPONENTS.card.padding.md },
      lg: { padding: COMPONENTS.card.padding.lg },
      xl: { padding: COMPONENTS.card.padding.xl },
    };

    // Margin styles
    const marginStyles: Record<string, ViewStyle> = {
      sm: { margin: COMPONENTS.card.margin.sm },
      md: { margin: COMPONENTS.card.margin.md },
      lg: { margin: COMPONENTS.card.margin.lg },
      xl: { margin: COMPONENTS.card.margin.xl },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: colors.surface,
        ...SHADOWS.sm,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...SHADOWS.lg,
      },
      outlined: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...SHADOWS.none,
      },
      filled: {
        backgroundColor: colors.background,
        ...SHADOWS.none,
      },
    };

    // Disabled styles
    const disabledStyles: ViewStyle = disabled
      ? { opacity: 0.6 }
      : {};

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...variantStyles[variant],
      ...disabledStyles,
    };
  };

  const cardContent = (
    <View style={[getCardStyles(), style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          pressed && !disabled && { opacity: 0.95, transform: [{ scale: 0.98 }] },
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

// Specialized card variants
export const ElevatedCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="elevated" />
);

export const OutlinedCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="outlined" />
);

export const FilledCard = (props: Omit<CardProps, 'variant'>) => (
  <Card {...props} variant="filled" />
);

// Card subcomponents
export interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[styles.cardHeader, style]}>
      {children}
    </View>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
}

export interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <View style={[styles.cardFooter, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    marginBottom: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});
