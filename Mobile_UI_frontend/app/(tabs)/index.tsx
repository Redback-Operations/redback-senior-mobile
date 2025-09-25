import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { BORDER_RADIUS, Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PredictionService } from '@/services/PredictionService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, resetForm, getLatestAssessment, isLoaded } = useForm();

  const handleStartAssessment = () => {
    resetForm();
    router.push('/assessment' as any);
  };

  const handleViewResults = () => {
    router.push('/(tabs)/results' as any);
  };

  const handleGetHelp = () => {
    router.push('/(tabs)/help' as any);
  };

  const getAssessmentStatus = () => {
    if (state.isComplete && state.data.age && state.data.height && state.data.weight) {
      const results = PredictionService.predict(state.data as any);
      return {
        completed: true,
        healthScore: results.healthScore,
        bmiCategory: results.bmiCategory,
        lastCompleted: new Date(),
      };
    }

    const latestAssessment = getLatestAssessment();
    if (latestAssessment) {
      return {
        completed: true,
        healthScore: latestAssessment.results.healthScore,
        bmiCategory: latestAssessment.results.bmiCategory,
        lastCompleted: latestAssessment.completedAt,
      };
    }

    return { completed: false, healthScore: undefined, bmiCategory: undefined };
  };

  const assessmentStatus = getAssessmentStatus();

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.header}>
            <View style={styles.headerContent}>
              <ThemedText style={[Typography.h1, { color: colors.textInverse }]}>
                Health Dashboard
              </ThemedText>
              <ThemedText style={[Typography.body, { color: colors.textInverse, opacity: 0.9 }]}>
                Your personal health insights
              </ThemedText>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <Card variant="elevated" style={styles.card}>
              {assessmentStatus.completed ? (
                <View style={styles.assessmentComplete}>
                  <View style={styles.assessmentHeader}>
                    <View style={styles.statusContainer}>
                      <View style={[styles.statusIcon, { backgroundColor: colors.success }]}>
                        <ThemedText style={[Typography.h6, { color: colors.textInverse }]}>✓</ThemedText>
                      </View>
                      <View style={styles.statusText}>
                        <ThemedText style={[Typography.h4, { color: colors.textPrimary }]}>
                          Assessment Complete
                        </ThemedText>
                        <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                          Your health insights are ready
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.scoreSection, { backgroundColor: colors.primary + '10' }]}>
                    <View style={styles.scoreHeader}>
                      <ThemedText style={[Typography.h6, { color: colors.textPrimary }]}>
                        Health Score
                      </ThemedText>
                      <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                        Based on BMI, activity, sleep, diet
                      </ThemedText>
                    </View>
                    <View style={styles.scoreValue}>
                      <ThemedText
                        style={[
                          Typography.h1,
                          {
                            color: (assessmentStatus.healthScore || 0) >= 80
                              ? colors.success
                              : (assessmentStatus.healthScore || 0) >= 60
                                ? colors.warning
                                : colors.error,
                            fontSize: 48,
                          },
                        ]}
                      >
                        {assessmentStatus.healthScore || 0}
                      </ThemedText>
                      <ThemedText style={[Typography.h6, { color: colors.textSecondary }]}>/100</ThemedText>
                    </View>
                  </View>

                  <View style={styles.bmiSection}>
                    <View style={styles.bmiHeader}>
                      <ThemedText style={[Typography.h6, { color: colors.textPrimary }]}>
                        BMI Category
                      </ThemedText>
                      <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                        Height & weight analysis
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.bmiBadge,
                        {
                          backgroundColor: assessmentStatus.bmiCategory === 'normal'
                            ? colors.success + '20'
                            : assessmentStatus.bmiCategory === 'underweight'
                              ? colors.info + '20'
                              : assessmentStatus.bmiCategory === 'overweight'
                                ? colors.warning + '20'
                                : colors.error + '20',
                          borderColor: assessmentStatus.bmiCategory === 'normal'
                            ? colors.success
                            : assessmentStatus.bmiCategory === 'underweight'
                              ? colors.info
                              : assessmentStatus.bmiCategory === 'overweight'
                                ? colors.warning
                                : colors.error,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          Typography.h5,
                          {
                            color: assessmentStatus.bmiCategory === 'normal'
                              ? colors.success
                              : assessmentStatus.bmiCategory === 'underweight'
                                ? colors.info
                                : assessmentStatus.bmiCategory === 'overweight'
                                  ? colors.warning
                                  : colors.error,
                          },
                        ]}
                      >
                        {assessmentStatus.bmiCategory?.toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>

                  <Button
                    title="View Full Results"
                    variant="primary"
                    size="lg"
                    onPress={handleViewResults}
                    style={styles.viewResultsButton}
                  />
                </View>
              ) : (
                <View style={styles.startAssessment}>
                  <View style={styles.startHeader}>
                    <View style={[styles.startIcon, { backgroundColor: colors.primary + '20' }]}>
                      <ThemedText style={[Typography.h4, { color: colors.primary }]}>🏃‍♂️</ThemedText>
                    </View>
                    <View style={styles.startText}>
                      <ThemedText style={[Typography.h4, { color: colors.textPrimary }]}>
                        Ready to Start
                      </ThemedText>
                      <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                        Take our comprehensive 7-step health assessment to get personalized insights about your health and wellness.
                      </ThemedText>
                    </View>
                  </View>
                  <Button
                    title="Start Assessment"
                    variant="primary"
                    size="lg"
                    onPress={handleStartAssessment}
                    style={styles.startButton}
                  />
                </View>
              )}
            </Card>

            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <ThemedText style={[Typography.h3, { color: colors.textPrimary }]}>
                  Quick Actions
                </ThemedText>
              </CardHeader>
              <CardContent>
                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    style={[styles.primaryAction, { backgroundColor: colors.primary }]}
                    onPress={handleStartAssessment}
                  >
                    <View style={styles.actionContent}>
                      <ThemedText style={styles.actionEmoji}>🏃‍♂️</ThemedText>
                      <ThemedText style={[Typography.body, { color: colors.textInverse, fontWeight: '600' }]}>
                        New Assessment
                      </ThemedText>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.secondaryActions}>
                    {assessmentStatus.completed && (
                      <TouchableOpacity
                        style={[
                          styles.secondaryAction,
                          { backgroundColor: colors.surface, borderColor: colors.borderLight },
                        ]}
                        onPress={handleViewResults}
                      >
                        <ThemedText style={styles.secondaryEmoji}>📊</ThemedText>
                        <ThemedText style={[Typography.caption, { color: colors.textPrimary, textAlign: 'center' }]}>
                          View Results
                        </ThemedText>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.secondaryAction,
                        { backgroundColor: colors.surface, borderColor: colors.borderLight },
                      ]}
                      onPress={handleGetHelp}
                    >
                      <ThemedText style={styles.secondaryEmoji}>❓</ThemedText>
                      <ThemedText style={[Typography.caption, { color: colors.textPrimary, textAlign: 'center' }]}>
                        Get Help
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <ThemedText style={[Typography.h3, { color: colors.textPrimary }]}>
                  Today's Health Tip
                </ThemedText>
              </CardHeader>
              <CardContent>
                <View style={[styles.tipCard, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.tipEmoji}>💡</ThemedText>
                  <View style={styles.tipTextContainer}>
                    <ThemedText
                      style={[
                        Typography.body,
                        { color: colors.textInverse, opacity: 0.9, lineHeight: 24 },
                      ]}
                      numberOfLines={0}
                    >
                      Regular health assessments help you track your progress and make informed decisions about your lifestyle.
                    </ThemedText>
                  </View>
                </View>
              </CardContent>
            </Card>

            {state.history.length > 0 && (
              <Card variant="elevated" style={styles.card}>
                <CardHeader>
                  <ThemedText style={[Typography.h3, { color: colors.textPrimary }]}>
                    Recent Assessments
                  </ThemedText>
                </CardHeader>
                <CardContent>
                  <View style={styles.historyList}>
                    {[...state.history]
                      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
                      .slice(0, 3)
                      .map(entry => (
                        <TouchableOpacity
                          key={entry.id}
                          style={[styles.historyItem, { backgroundColor: colors.background }]}
                          onPress={() => router.push({ pathname: '/(tabs)/results/[id]', params: { id: entry.id } })}
                        >
                          <View style={styles.historyContent}>
                            <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                              {entry.completedAt.toLocaleDateString()}
                            </ThemedText>
                            <ThemedText style={[Typography.body, { color: colors.textPrimary, fontWeight: '600' }]}>
                              Health Score: {entry.results.healthScore}/100
                            </ThemedText>
                            <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                              BMI: {entry.results.bmiCategory?.toUpperCase()}
                            </ThemedText>
                          </View>
                          <ThemedText style={[Typography.h5, { color: colors.primary }]}>→</ThemedText>
                        </TouchableOpacity>
                      ))}
                  </View>
                </CardContent>
              </Card>
            )}

            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <ThemedText style={[Typography.h3, { color: colors.textPrimary }]}>
                  What's Included
                </ThemedText>
              </CardHeader>
              <CardContent>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <ThemedText style={styles.featureIcon}>📋</ThemedText>
                    <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                      7-step comprehensive assessment
                    </ThemedText>
                  </View>
                  <View style={styles.featureItem}>
                    <ThemedText style={styles.featureIcon}>📊</ThemedText>
                    <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                      BMI calculation and health scoring
                    </ThemedText>
                  </View>
                  <View style={styles.featureItem}>
                    <ThemedText style={styles.featureIcon}>🎯</ThemedText>
                    <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                      Personalized recommendations
                    </ThemedText>
                  </View>
                  <View style={styles.featureItem}>
                    <ThemedText style={styles.featureIcon}>⚠️</ThemedText>
                    <ThemedText style={[Typography.body, { color: colors.textSecondary }]}>
                      Risk factor analysis
                    </ThemedText>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING['4xl'],
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  assessmentComplete: {
    padding: SPACING.lg,
  },
  assessmentHeader: {
    marginBottom: SPACING.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statusText: {
    flex: 1,
  },
  scoreSection: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scoreValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  bmiSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bmiHeader: {
    flex: 1,
  },
  bmiBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  startAssessment: {
    padding: SPACING.lg,
  },
  startHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  startIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  startText: {
    flex: 1,
  },
  viewResultsButton: {
    marginTop: SPACING.sm,
  },
  startButton: {
    marginTop: SPACING.sm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  actionContainer: {
    gap: SPACING.lg,
  },
  primaryAction: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  actionEmoji: {
    fontSize: 28,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  secondaryAction: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 56,
    justifyContent: 'center',
  },
  secondaryEmoji: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: SPACING.md,
    marginTop: 2,
  },
  tipTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  featuresList: {
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: SPACING.md,
  },
  loadingText: {
    ...Typography.body,
  },
  historyList: {
    gap: SPACING.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  historyContent: {
    flex: 1,
  },
});
