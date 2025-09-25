import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { BORDER_RADIUS, Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AssessmentHistoryEntry } from '@/types';

export default function ResultsTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state } = useForm();
  const history: AssessmentHistoryEntry[] = [...(state.history || [])].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  );

  const handleStartAssessment = () => {
    router.push('/(tabs)');
  };

  const handleViewResult = (id: string) => {
    router.push({ pathname: '/(tabs)/results/[id]', params: { id } });
  };

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
                Assessment History
              </ThemedText>
              <ThemedText style={[Typography.body, { color: colors.textInverse, opacity: 0.9 }]}>
                Review your past health assessments
              </ThemedText>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            {history.length === 0 ? (
              <Card variant="elevated" style={styles.card}>
                <CardContent style={styles.emptyStateContainer}>
                  <ThemedText style={styles.emptyStateEmoji}>🤷‍♀️</ThemedText>
                  <ThemedText style={[Typography.h4, { color: colors.textPrimary, textAlign: 'center' }]}>
                    No assessments yet
                  </ThemedText>
                  <ThemedText
                    style={[
                      Typography.body,
                      { color: colors.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
                    ]}
                  >
                    Take your first assessment to see your results here.
                  </ThemedText>
                  <Button
                    title="Start New Assessment"
                    variant="primary"
                    size="lg"
                    onPress={handleStartAssessment}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card variant="elevated" style={styles.card}>
                <CardHeader>
                  <ThemedText style={[Typography.h3, { color: colors.textPrimary }]}>
                    Past Assessments
                  </ThemedText>
                </CardHeader>
                <CardContent>
                  <View style={styles.historyList}>
                    {history.map(entry => (
                      <TouchableOpacity
                        key={entry.id}
                        style={[
                          styles.historyItem,
                          { backgroundColor: colors.surface, borderColor: colors.borderLight },
                        ]}
                        onPress={() => handleViewResult(entry.id)}
                      >
                        <View style={styles.historyContent}>
                          <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                            {entry.completedAt.toLocaleDateString()}
                          </ThemedText>
                          <ThemedText
                            style={[Typography.body, { color: colors.textPrimary, fontWeight: '600' }]}
                          >
                            Health Score: {entry.results.healthScore}/100
                          </ThemedText>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                            <ThemedText style={[Typography.caption, { color: colors.textSecondary }]}>
                              BMI:
                            </ThemedText>
                            <View
                              style={[
                                styles.bmiBadge,
                                {
                                  backgroundColor: entry.results.bmiCategory === 'normal'
                                    ? colors.success + '20'
                                    : entry.results.bmiCategory === 'underweight'
                                      ? colors.info + '20'
                                      : entry.results.bmiCategory === 'overweight'
                                        ? colors.warning + '20'
                                        : colors.error + '20',
                                  borderColor: entry.results.bmiCategory === 'normal'
                                    ? colors.success
                                    : entry.results.bmiCategory === 'underweight'
                                      ? colors.info
                                      : entry.results.bmiCategory === 'overweight'
                                        ? colors.warning
                                        : colors.error,
                                },
                              ]}
                            >
                              <ThemedText
                                style={[
                                  Typography.caption,
                                  {
                                    fontWeight: '600',
                                    color: entry.results.bmiCategory === 'normal'
                                      ? colors.success
                                      : entry.results.bmiCategory === 'underweight'
                                        ? colors.info
                                        : entry.results.bmiCategory === 'overweight'
                                          ? colors.warning
                                          : colors.error,
                                  },
                                ]}
                              >
                                {entry.results.bmiCategory?.toUpperCase()}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                        <ThemedText style={[Typography.h5, { color: colors.primary }]}>→</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}
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
  emptyStateContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: SPACING.lg,
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
  },
  historyContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  bmiBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
});
