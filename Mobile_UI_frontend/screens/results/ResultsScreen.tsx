import { ConfidenceGauge } from '@/components/ConfidenceGauge';
import { ExplainabilityChart } from '@/components/ExplainabilityChart';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PredictionService, SHAPValue } from '@/services/PredictionService';
import { PredictionResults } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, resetForm } = useForm();
  const [results, setResults] = useState<PredictionResults | null>(null);
  const [shapValues, setShapValues] = useState<SHAPValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const calculateResults = useCallback(() => {
    const { data } = state;
    
    // Use the prediction service for comprehensive analysis
    const calculatedResults = PredictionService.predict(data as any);
    const shapValuesData = PredictionService.generateSHAPValues(data as any);
    
    setResults(calculatedResults);
    setShapValues(shapValuesData);
  }, [state]);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      calculateResults();
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [calculateResults]);

  const getBMIDescription = (bmi: number, category: string) => {
    const bmiInfo = PredictionService.getBMICategory(bmi);
    return bmiInfo.description;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const handleNewAssessment = () => {
    resetForm();
    router.push('/(tabs)');
  };


  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[Typography.h6, { color: colors.textPrimary, marginTop: SPACING.lg }]}>
            Analyzing your health data...
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
            This may take a few moments
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!results) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[Typography.h6, { color: colors.error }]}>
            Unable to generate results
          </Text>
          <Button
            title="Try Again"
            variant="primary"
            onPress={handleNewAssessment}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.header}
        >
          <Text style={[Typography.h1, { color: colors.textInverse }]}>
            Health Assessment Results
          </Text>
          <Text style={[Typography.body, { color: colors.textInverse, opacity: 0.9 }]}>
            Your personalized health insights
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Overall Health Score */}
          <Card variant="elevated" style={styles.card}>
            <CardHeader>
              <Text style={[Typography.h5, { color: colors.textPrimary }]}>
                🏆 Overall Health Score
              </Text>
            </CardHeader>
            <CardContent>
              <View style={styles.scoreContainer}>
                <Text style={[Typography.h1, { color: getHealthScoreColor(results.healthScore) }]}>
                  {Math.round(results.healthScore)}
                </Text>
                <Text style={[Typography.h6, { color: getHealthScoreColor(results.healthScore) }]}>
                  {getHealthScoreLabel(results.healthScore)}
                </Text>
              </View>
              <Text style={[Typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
                Based on your lifestyle and health factors
              </Text>
            </CardContent>
          </Card>

          {/* BMI Analysis */}
          <Card variant="elevated" style={styles.card}>
            <CardHeader>
              <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                📊 BMI Analysis
              </Text>
            </CardHeader>
            <CardContent>
              <View style={styles.metricRow}>
                <Text style={[Typography.body, { color: colors.textSecondary }]}>BMI:</Text>
                <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                  {results.bmi.toFixed(1)}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={[Typography.body, { color: colors.textSecondary }]}>Category:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>
                  {results.bmiCategory}
                </Text>
              </View>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                {getBMIDescription(results.bmi, results.bmiCategory)}
              </Text>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card variant="elevated" style={styles.card}>
            <CardHeader>
              <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                ⚠️ Risk Factors
              </Text>
            </CardHeader>
            <CardContent>
              {results.riskFactors.map((factor, index) => (
                <View key={index} style={styles.riskFactor}>
                  <Text style={[Typography.caption, { color: colors.error }]}>• {factor}</Text>
                </View>
              ))}
              {results.riskFactors.length === 0 && (
                <Text style={[Typography.caption, { color: colors.success }]}>
                  No significant risk factors identified
                </Text>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card variant="elevated" style={styles.card}>
            <CardHeader>
              <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                💡 Recommendations
              </Text>
            </CardHeader>
            <CardContent>
              {results.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendation}>
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                    • {recommendation}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* Confidence Gauge */}
          <Card variant="elevated" style={styles.card}>
            <CardHeader>
              <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                🎯 Assessment Confidence
              </Text>
            </CardHeader>
            <CardContent>
              <ConfidenceGauge score={results.confidenceScore || 0.8} />
            </CardContent>
          </Card>

          {/* Explainability Chart */}
          <Card variant="elevated" style={styles.card}>
            <CardHeader>
              <Text style={[Typography.h6, { color: colors.textPrimary }]}>
                📈 Factor Impact
              </Text>
            </CardHeader>
            <CardContent>
              <ExplainabilityChart data={shapValues.map(item => ({
                factor: item.feature,
                impact: item.impact,
                type: item.impact >= 0 ? 'positive' : 'negative'
              }))} />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="View Past Results"
              variant="secondary"
              size="sm"
              onPress={() => router.push('/(tabs)/results')}
              style={styles.button}
            />
            <Button
              title="Back to Home"
              variant="primary"
              size="sm"
              onPress={() => router.push('/(tabs)')}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING['2xl'],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  riskFactor: {
    marginBottom: SPACING.xs,
  },
  recommendation: {
    marginBottom: SPACING.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    gap: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  button: {
    flex: 1,
    minHeight: 56,
  },
});