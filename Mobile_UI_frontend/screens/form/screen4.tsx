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

export default function Screen4() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();
  const screenTime = state.data.screenTime ?? 6;

  useEffect(() => {
    if (state.data.screenTime === undefined) {
      updateFormData({ screenTime: 6 });
    }
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      Alert.alert('Validation Error', 'Please set your daily screen time.');
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const getScreenTimeDescription = (hours: number) => {
    if (hours < 2) return 'Very low screen time - great!';
    if (hours < 4) return 'Low screen time - good balance';
    if (hours < 6) return 'Moderate screen time - reasonable';
    if (hours < 8) return 'High screen time - consider reducing';
    return 'Very high screen time - try to reduce';
  };

  const getScreenTimeColor = (hours: number) => {
    if (hours < 4) return '#4CAF50'; // Green
    if (hours < 6) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

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
              Screen Time
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              How much screen time daily?
            </Text>
          </View>

          {/* Slider */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <SliderComponent
                label="Daily Screen Time"
                value={screenTime}
                onValueChange={(value) => updateFormData({ screenTime: Math.round(value) })}
                minimumValue={0}
                maximumValue={24}
                step={0.5}
                unit="hours"
                variant="minimal"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Text style={[
                Typography.body,
                { 
                  color: getScreenTimeColor(screenTime),
                  textAlign: 'center',
                  fontWeight: '600'
                }
              ]}>
                {getScreenTimeDescription(screenTime)}
              </Text>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Text style={[Typography.h6, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                💡 Tips for healthy screen time:
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Take breaks every 20-30 minutes
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Use blue light filters in the evening
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Avoid screens 1 hour before bed
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                • Set specific times for checking devices
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
