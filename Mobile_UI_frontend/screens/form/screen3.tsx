import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserFormData } from '@/types';
import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen3() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();
  const physicalActivity = state.data.physicalActivity;

  useEffect(() => {
    if (state.data.physicalActivity === undefined) {
      updateFormData({ physicalActivity: 'moderate' });
    }
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      Alert.alert('Validation Error', 'Please select your physical activity level.');
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const activityLevels = [
    {
      key: 'sedentary',
      label: 'Sedentary',
      description: 'Little to no exercise, desk job',
      icon: '🛋️',
    },
    {
      key: 'light',
      label: 'Light Activity',
      description: 'Light exercise 1-3 days/week',
      icon: '🚶',
    },
    {
      key: 'moderate',
      label: 'Moderate Activity',
      description: 'Moderate exercise 3-5 days/week',
      icon: '🏃',
    },
    {
      key: 'active',
      label: 'Active',
      description: 'Heavy exercise 6-7 days/week',
      icon: '💪',
    },
    {
      key: 'very_active',
      label: 'Very Active',
      description: 'Very heavy exercise, physical job',
      icon: '🔥',
    },
  ];

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
              Physical Activity
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              How active are you?
            </Text>
          </View>

          {/* Options */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <View style={styles.optionsContainer}>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.key}
                    style={[
                      styles.optionButton,
                      { borderColor: colors.border },
                      physicalActivity === level.key && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '10',
                      }
                    ]}
                    onPress={() => updateFormData({ physicalActivity: level.key as UserFormData['physicalActivity'] })}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.optionHeader}>
                        <View style={[
                          styles.radioButton,
                          { borderColor: colors.border },
                          physicalActivity === level.key && {
                            borderColor: colors.primary,
                          }
                        ]}>
                          {physicalActivity === level.key && (
                            <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                          )}
                        </View>
                        <Text style={styles.optionIcon}>{level.icon}</Text>
                        <Text style={[
                          styles.optionLabel,
                          { color: colors.textPrimary },
                          physicalActivity === level.key && {
                            color: colors.primary,
                            fontWeight: '600',
                          }
                        ]}>
                          {level.label}
                        </Text>
                      </View>
                      <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                        {level.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
  optionsContainer: {
    marginBottom: SPACING.lg,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: 'transparent',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    marginLeft: 48,
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
