import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SliderComponent } from '@/components/ui/Slider';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen6() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();
  const sleepHours = state.data.sleepHours ?? 8;

  useEffect(() => {
    if (state.data.sleepHours === undefined) {
      updateFormData({ sleepHours: 8 });
    }
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      Alert.alert('Validation Error', 'Please set your sleep hours.');
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const getSleepQuality = (hours: number) => {
    if (hours < 6) return { quality: 'Poor', color: colors.error, description: 'Insufficient sleep' };
    if (hours < 7) return { quality: 'Fair', color: colors.warning, description: 'Below recommended' };
    if (hours <= 9) return { quality: 'Good', color: colors.success, description: 'Optimal sleep' };
    return { quality: 'Too Much', color: colors.warning, description: 'Excessive sleep' };
  };

  const sleepQuality = getSleepQuality(sleepHours);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressBar variant="minimal" />
        
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[Typography.h1, { color: colors.textPrimary }]}>
              Sleep Patterns
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              How many hours do you sleep per night?
            </Text>
          </View>

          {/* Sleep Hours Slider */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <SliderComponent
                label="Sleep Hours"
                value={sleepHours}
                onValueChange={(value) => updateFormData({ sleepHours: Math.round(value * 2) / 2 })}
                minimumValue={4}
                maximumValue={12}
                step={0.5}
                unit="hours"
                variant="minimal"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Sleep Quality Assessment */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <View style={styles.qualityContainer}>
                <Text style={[Typography.h6, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                  Sleep Quality Assessment
                </Text>
                <View style={styles.qualityRow}>
                  <Text style={[Typography.body, { color: colors.textSecondary }]}>Quality:</Text>
                  <Text style={[Typography.h6, { color: sleepQuality.color, fontWeight: '600' }]}>
                    {sleepQuality.quality}
                  </Text>
                </View>
                <Text style={[Typography.caption, { color: sleepQuality.color, textAlign: 'center' }]}>
                  {sleepQuality.description}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Sleep Tips */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Text style={[Typography.h6, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                💤 Tips for better sleep:
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Maintain a consistent sleep schedule
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Create a relaxing bedtime routine
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Keep your bedroom cool, dark, and quiet
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Avoid screens 1 hour before bed
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                • Limit caffeine and alcohol before bedtime
              </Text>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Previous"
              variant="outline"
              size="lg"
              onPress={handlePrevious}
              style={styles.button}
            />
            <Button
              title="Continue"
              variant="primary"
              size="lg"
              onPress={handleNext}
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
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  card: {
    marginBottom: SPACING.lg,
  },
  qualityContainer: {
    alignItems: 'center',
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  button: {
    flex: 1,
  },
});
