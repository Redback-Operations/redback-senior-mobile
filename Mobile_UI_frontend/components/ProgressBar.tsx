import { BORDER_RADIUS, Colors, COMPONENTS, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export interface ProgressBarProps {
  showStepText?: boolean;
  variant?: 'default' | 'minimal' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  style?: any;
}

export function ProgressBar({
  showStepText = true,
  variant = 'default',
  size = 'md',
  animated = true,
  style,
}: ProgressBarProps) {
  const { state } = useForm();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const progress = (state.currentStep / state.totalSteps) * 100;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
  }, [progress, animated, animatedValue]);

  const getProgressBarStyles = () => {
    const baseStyles = {
      height: COMPONENTS.progress.height[size] as number,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colors.borderLight,
      overflow: 'hidden' as const,
    };

    return baseStyles;
  };

  const getFillStyles = () => {
    const baseStyles = {
      height: '100%' as const,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colors.primary,
    };

    return baseStyles;
  };

  const getStepTextStyles = () => {
    return {
      ...Typography.caption,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginTop: SPACING.sm,
    };
  };

  if (variant === 'minimal') {
    return (
      <View style={[styles.minimalContainer, style]}>
        <View style={[getProgressBarStyles(), styles.minimalTrack]}>
          <Animated.View
            style={[
              getFillStyles(),
              {
                width: animated ? animatedValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }) : `${progress}%`,
              },
            ]}
          />
        </View>
        {showStepText && (
          <Text style={getStepTextStyles()}>
            {state.currentStep} of {state.totalSteps}
          </Text>
        )}
      </View>
    );
  }

  if (variant === 'circular') {
    const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40;
    const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 6;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={[styles.circularContainer, style]}>
        <View style={styles.circularWrapper}>
          <View style={[styles.circularTrack, { width: radius * 2, height: radius * 2 }]}>
            <View
              style={[
                styles.circularFill,
                {
                  width: radius * 2,
                  height: radius * 2,
                  borderRadius: radius,
                  borderWidth: strokeWidth,
                  borderColor: colors.primary,
                  borderTopColor: colors.primary,
                  borderRightColor: colors.primary,
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: `${(progress / 100) * 360}deg` }],
                },
              ]}
            />
            <View style={styles.circularInner}>
              <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                {state.currentStep}
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                of {state.totalSteps}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[getProgressBarStyles(), styles.track]}>
        <Animated.View
          style={[
            getFillStyles(),
            {
              width: animated ? animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }) : `${progress}%`,
            },
          ]}
        />
      </View>
      {showStepText && (
        <View style={styles.textContainer}>
          <Text style={getStepTextStyles()}>
            Step {state.currentStep} of {state.totalSteps}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  minimalContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  circularContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  track: {
    // Base track styles are handled by getProgressBarStyles
  },
  minimalTrack: {
    // Minimal track styles
  },
  textContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  circularWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTrack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circularInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});