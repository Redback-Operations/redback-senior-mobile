import { BORDER_RADIUS, Colors, SPACING, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 60;

interface FactorData {
  factor: string;
  impact: number;
  type: 'positive' | 'negative';
}

interface ExplainabilityChartProps {
  data: FactorData[];
}

export function ExplainabilityChart({ data }: ExplainabilityChartProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const animatedValues = useRef(
    data.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = data.map((item, index) => 
      Animated.timing(animatedValues[index], {
        toValue: Math.abs(item.impact) / 25, // Normalize to 0-1 range
        duration: 1500,
        delay: index * 200,
        useNativeDriver: false,
      })
    );

    Animated.stagger(200, animations).start();
  }, [data]);

  const getBarColor = (type: 'positive' | 'negative', impact: number) => {
    if (type === 'positive') {
      return impact > 0 ? colors.success : colors.borderLight;
    } else {
      return impact < 0 ? colors.error : colors.borderLight;
    }
  };

  const getImpactLabel = (impact: number) => {
    const absImpact = Math.abs(impact);
    if (absImpact === 0) return 'No Impact';
    if (absImpact <= 5) return 'Low Impact';
    if (absImpact <= 15) return 'Medium Impact';
    return 'High Impact';
  };

  const getImpactIcon = (type: 'positive' | 'negative', impact: number) => {
    if (type === 'positive' && impact > 0) return '📈';
    if (type === 'negative' && impact < 0) return '📉';
    return '➖';
  };

  const getFactorDescription = (factor: string) => {
    const descriptions: { [key: string]: string } = {
      'BMI': 'Body Mass Index based on height and weight',
      'Physical Activity': 'Regular exercise and movement habits',
      'Sleep Quality': 'Sleep duration and restfulness',
      'Screen Time': 'Daily digital device usage',
      'Diet Habits': 'Nutritional choices and eating patterns',
      'Family History': 'Genetic predisposition to health conditions',
      'Stress Levels': 'Mental and emotional stress management',
      'Age': 'Age-related health considerations',
      'Gender': 'Gender-specific health factors',
      'Height': 'Physical stature measurements',
      'Weight': 'Body weight measurements'
    };
    return descriptions[factor] || 'Health assessment factor';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Top Factors Affecting Your Health Score</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Based on your assessment responses</Text>
      
      {/* Factor Mapping Legend */}
      <View style={[styles.mappingLegend, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
        <Text style={[styles.mappingTitle, { color: colors.textPrimary }]}>📊 Factor Mapping</Text>
        <View style={styles.mappingGrid}>
          <View style={styles.mappingItem}>
            <Text style={[styles.mappingLabel, { color: colors.textSecondary }]}>BMI</Text>
            <Text style={[styles.mappingValue, { color: colors.textTertiary }]}>Height & Weight</Text>
          </View>
          <View style={styles.mappingItem}>
            <Text style={[styles.mappingLabel, { color: colors.textSecondary }]}>Activity</Text>
            <Text style={[styles.mappingValue, { color: colors.textTertiary }]}>Exercise Level</Text>
          </View>
          <View style={styles.mappingItem}>
            <Text style={[styles.mappingLabel, { color: colors.textSecondary }]}>Sleep</Text>
            <Text style={[styles.mappingValue, { color: colors.textTertiary }]}>Hours & Quality</Text>
          </View>
          <View style={styles.mappingItem}>
            <Text style={[styles.mappingLabel, { color: colors.textSecondary }]}>Diet</Text>
            <Text style={[styles.mappingValue, { color: colors.textTertiary }]}>Nutrition Habits</Text>
          </View>
        </View>
      </View>
      
      {data.map((item, index) => {
        const barWidth = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, CHART_WIDTH * 0.8],
        });

        const barColor = getBarColor(item.type, item.impact);
        const impactLabel = getImpactLabel(item.impact);
        const impactIcon = getImpactIcon(item.type, item.impact);

        return (
          <View key={index} style={[styles.factorItem, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
            <View style={styles.factorHeader}>
              <View style={styles.factorInfo}>
                <View style={[styles.iconContainer, { backgroundColor: barColor + '20' }]}>
                  <Text style={styles.factorIcon}>{impactIcon}</Text>
                </View>
                <View style={styles.factorTextContainer}>
                  <Text style={[styles.factorName, { color: colors.textPrimary }]}>{item.factor}</Text>
                  <Text style={[styles.factorDescription, { color: colors.textSecondary }]}>
                    {getFactorDescription(item.factor)}
                  </Text>
                </View>
              </View>
              <View style={styles.impactInfo}>
                <Text style={[
                  styles.impactValue,
                  { color: barColor }
                ]}>
                  {item.impact > 0 ? '+' : ''}{item.impact}
                </Text>
                <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>{impactLabel}</Text>
              </View>
            </View>
            
            <View style={[styles.barContainer, { backgroundColor: colors.borderLight }]}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    backgroundColor: barColor,
                    alignSelf: item.type === 'negative' ? 'flex-end' : 'flex-start',
                  }
                ]}
              />
            </View>
          </View>
        );
      })}

      <View style={[styles.legend, { borderTopColor: colors.borderLight }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Improves Health</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Reduces Health</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.borderLight }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>No Impact</Text>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.primary + '20' }]}>
        <Text style={[styles.footerText, { color: colors.primary }]}>
          💡 Higher absolute values indicate stronger impact on your overall health score
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  title: {
    ...Typography.h5,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...Typography.caption,
    marginBottom: SPACING.lg,
  },
  factorItem: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    minHeight: 60,
  },
  factorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: SPACING.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  factorIcon: {
    fontSize: 16,
  },
  factorTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  factorName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    flexShrink: 1,
  },
  factorDescription: {
    ...Typography.caption,
    fontSize: 11,
    lineHeight: 14,
    flexShrink: 1,
  },
  impactInfo: {
    alignItems: 'flex-end',
    minWidth: 80,
    flexShrink: 0,
  },
  impactValue: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  impactLabel: {
    ...Typography.caption,
    marginTop: SPACING.xs,
  },
  barContainer: {
    height: 8,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    position: 'relative',
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  legendText: {
    ...Typography.caption,
  },
  footer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
  },
  mappingLegend: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  mappingTitle: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  mappingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  mappingItem: {
    width: '48%',
    marginBottom: SPACING.sm,
  },
  mappingLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: 2,
  },
  mappingValue: {
    ...Typography.caption,
    fontSize: 10,
  },
});
