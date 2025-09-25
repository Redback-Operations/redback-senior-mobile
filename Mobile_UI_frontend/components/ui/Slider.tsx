import { BORDER_RADIUS, Colors, SPACING, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  unit?: string;
  variant?: 'default' | 'minimal' | 'range';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showValue?: boolean;
  showTicks?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export function SliderComponent({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  unit = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  showValue = true,
  showTicks = false,
  containerStyle,
  labelStyle,
  valueStyle,
  hapticFeedback = true,
}: SliderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isDragging, setIsDragging] = useState(false);

  const getSliderHeight = () => {
    const heights = {
      sm: 4,
      md: 6,
      lg: 8,
    };
    return heights[size];
  };

  const getThumbSize = () => {
    const sizes = {
      sm: 16,
      md: 20,
      lg: 24,
    };
    return sizes[size];
  };

  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: SPACING.md,
    };

    return {
      ...baseStyle,
      ...containerStyle,
    };
  };

  const getLabelStyles = (): TextStyle => {
    return {
      ...Typography.label,
      color: colors.textPrimary,
      marginBottom: SPACING.sm,
      ...labelStyle,
    };
  };

  const getValueStyles = (): TextStyle => {
    return {
      ...Typography.body,
      color: colors.textPrimary,
      fontWeight: Typography.fontWeight.semiBold,
      ...valueStyle,
    };
  };

  const getSliderStyles = () => {
    return {
      height: getSliderHeight(),
      borderRadius: BORDER_RADIUS.full,
    };
  };

  const getThumbStyles = () => {
    return {
      width: getThumbSize(),
      height: getThumbSize(),
      borderRadius: getThumbSize() / 2,
      backgroundColor: colors.primary,
      ...(isDragging && {
        transform: [{ scale: 1.2 }],
      }),
    };
  };

  const formatValue = (val: number) => {
    if (unit) {
      return `${Math.round(val)}${unit}`;
    }
    return Math.round(val).toString();
  };

  const renderTicks = () => {
    if (!showTicks) return null;

    const tickCount = 5;
    const tickValues = Array.from({ length: tickCount }, (_, i) => {
      const tickValue = minimumValue + (i / (tickCount - 1)) * (maximumValue - minimumValue);
      return tickValue;
    });

    return (
      <View style={styles.ticksContainer}>
        {tickValues.map((tickValue, index) => (
          <View key={index} style={styles.tickContainer}>
            <View style={[styles.tick, { backgroundColor: colors.border }]} />
            <Text style={[styles.tickLabel, { color: colors.textTertiary }]}>
              {formatValue(tickValue)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (variant === 'minimal') {
    return (
      <View style={getContainerStyles()}>
        <View style={styles.minimalHeader}>
          {label && <Text style={getLabelStyles()}>{label}</Text>}
          {showValue && (
            <Text style={getValueStyles()}>
              {formatValue(value)}
            </Text>
          )}
        </View>
        
        <Slider
          style={getSliderStyles()}
          value={value}
          onValueChange={onValueChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          disabled={disabled}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.borderLight}
          onSlidingStart={() => setIsDragging(true)}
          onSlidingComplete={() => setIsDragging(false)}
        />
        
        {renderTicks()}
      </View>
    );
  }

  return (
    <View style={getContainerStyles()}>
      <View style={styles.header}>
        {label && <Text style={getLabelStyles()}>{label}</Text>}
        {showValue && (
          <Text style={getValueStyles()}>
            {formatValue(value)}
          </Text>
        )}
      </View>
      
      <View style={styles.sliderContainer}>
        <Slider
          style={getSliderStyles()}
          value={value}
          onValueChange={onValueChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          disabled={disabled}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.borderLight}
          onSlidingStart={() => setIsDragging(true)}
          onSlidingComplete={() => setIsDragging(false)}
        />
      </View>
      
      {renderTicks()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  minimalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sliderContainer: {
    width: '100%',
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  tickContainer: {
    alignItems: 'center',
  },
  tick: {
    width: 1,
    height: 8,
    marginBottom: SPACING.xs,
  },
  tickLabel: {
    ...Typography.caption,
    fontSize: 10,
  },
});
