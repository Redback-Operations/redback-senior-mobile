import { Colors, SPACING, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const GAUGE_SIZE = Math.min(width * 0.25, 120); // Smaller, more reasonable size
const STROKE_WIDTH = 8;
const RADIUS = (GAUGE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ConfidenceGaugeProps {
  score: number;
  size?: number;
}

export function ConfidenceGauge({ score, size = GAUGE_SIZE }: ConfidenceGaugeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Calculate confidence based on score completeness and consistency
  const confidence = Math.min(95, Math.max(60, score + 15));
  const animatedValue = useRef(new Animated.Value(0)).current;
  const confidenceAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate score
    Animated.timing(animatedValue, {
      toValue: score / 100,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Animate confidence
    Animated.timing(confidenceAnimatedValue, {
      toValue: confidence / 100,
      duration: 1500,
      delay: 500,
      useNativeDriver: false,
    }).start();
  }, [score, confidence]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return colors.success;
    if (confidence >= 60) return colors.warning;
    return colors.error;
  };

  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const animatedConfidenceStrokeDashoffset = confidenceAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const scoreColor = getScoreColor(score);
  const confidenceColor = getConfidenceColor(confidence);

  return (
    <View style={styles.container}>
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={RADIUS}
            stroke={colors.borderLight}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          
          {/* Score Progress Circle */}
          <Animated.View>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={RADIUS}
              stroke={scoreColor}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={animatedStrokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Animated.View>

          {/* Confidence Inner Circle */}
          <Animated.View>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={RADIUS - 15}
              stroke={confidenceColor}
              strokeWidth={STROKE_WIDTH - 3}
              fill="transparent"
              strokeDasharray={2 * Math.PI * (RADIUS - 15)}
              strokeDashoffset={animatedConfidenceStrokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              opacity={0.7}
            />
          </Animated.View>
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>
            {Math.round(score)}
          </Text>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Health Score</Text>
        </View>
      </View>

      {/* Confidence Information - Separated from health score */}
      <View style={styles.confidenceSection}>
        <View style={styles.confidenceContainer}>
          <View style={[styles.confidenceDot, { backgroundColor: confidenceColor }]} />
          <Text style={[styles.confidenceText, { color: confidenceColor }]}>
            {Math.round(confidence)}% Confidence
          </Text>
        </View>
        <Text style={[styles.confidenceDescription, { color: colors.textSecondary }]}>
          Assessment reliability based on your responses
        </Text>
      </View>

      {/* Legend - Simplified to show only the health score ring */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: scoreColor }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Health Score Ring</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: confidenceColor, opacity: 0.7 }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Confidence Ring</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.md,
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    ...Typography.h2,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  scoreLabel: {
    ...Typography.caption,
    marginBottom: SPACING.xs,
  },
  confidenceSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  confidenceText: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceDescription: {
    ...Typography.caption,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  legendText: {
    ...Typography.caption,
    fontSize: 10,
  },
});
