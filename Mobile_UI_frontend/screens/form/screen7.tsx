import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen7() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, prevStep, submitForm, goToResults, handleError } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevious = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();
      // Navigate to results screen within the assessment flow
      goToResults();
    } catch (error) {
      handleError(error, 'Screen7.handleSubmit');
      Alert.alert(
        'Submission Error',
        'There was an error submitting your assessment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stressLevel = (state.data as any).stressLevel || 'moderate';
  const getStressDescription = (level: string) => {
    switch (level) {
      case 'low': return 'You manage stress well and feel calm most of the time.';
      case 'moderate': return 'You experience some stress but generally cope well.';
      case 'high': return 'You feel stressed frequently and may benefit from stress management techniques.';
      case 'very_high': return 'You experience high levels of stress and should consider professional support.';
      default: return 'Please complete the stress assessment.';
    }
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return colors.success;
      case 'moderate': return colors.warning;
      case 'high': return colors.error;
      case 'very_high': return colors.error;
      default: return colors.textSecondary;
    }
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
              Assessment Complete
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Review your information and submit your health assessment
            </Text>
          </View>

          {/* Summary Card */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Text style={[Typography.h6, { color: colors.textPrimary, marginBottom: SPACING.md }]}>
                📊 Assessment Summary
              </Text>
              
              <View style={styles.summaryRow}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Age:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{state.data.age} years</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Gender:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{state.data.gender}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Height:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{state.data.height} cm</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Weight:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{state.data.weight} kg</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Activity Level:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{state.data.physicalActivity}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Sleep Hours:</Text>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>{state.data.sleepHours} hours</Text>
              </View>
            </CardContent>
          </Card>

          {/* Stress Level Assessment */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Text style={[Typography.h6, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                🧠 Stress Level Assessment
              </Text>
              <Text style={[Typography.body, { color: getStressColor(stressLevel) }]}>
                {getStressDescription(stressLevel)}
              </Text>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Text style={[Typography.h6, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                🔒 Privacy & Security
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • Your data is encrypted and stored securely
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.xs }]}>
                • We never share your personal information
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                • You can delete your data at any time
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
              disabled={isSubmitting}
            />
            <Button
              title={isSubmitting ? "Submitting..." : "Submit"}
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              style={styles.button}
              loading={isSubmitting}
              disabled={isSubmitting}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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