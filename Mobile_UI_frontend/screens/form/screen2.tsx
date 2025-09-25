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

import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Screen2() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();
  const familyHistory = state.data.familyHistory || {};

  useEffect(() => {
    if (state.data.familyHistory === undefined) {
      updateFormData({
        familyHistory: {
          diabetes: false,
          heartDisease: false,
          highBloodPressure: false,
          cancer: false,
          none: false,
        },
      });
    }
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      Alert.alert('Validation Error', 'Please select at least one option or choose "None" if no family history.');
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const toggleOption = (option: keyof typeof familyHistory) => {
    let newFamilyHistory;
    if (option === 'none') {
      newFamilyHistory = {
        diabetes: false,
        heartDisease: false,
        highBloodPressure: false,
        cancer: false,
        none: true,
      };
    } else {
      newFamilyHistory = {
        ...familyHistory,
        [option]: !familyHistory[option],
        none: false,
      };
    }
    updateFormData({ familyHistory: newFamilyHistory });
  };

  const options = [
    { key: 'diabetes', label: 'Diabetes', description: 'Type 1 or Type 2 diabetes' },
    { key: 'heartDisease', label: 'Heart Disease', description: 'Heart attack, stroke, or heart conditions' },
    { key: 'highBloodPressure', label: 'High Blood Pressure', description: 'Hypertension or high blood pressure' },
    { key: 'cancer', label: 'Cancer', description: 'Any type of cancer' },
  ];

  const noneOption = { key: 'none', label: 'None of the above', description: 'No family history of these conditions' };

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
              Family History
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Select all that apply to your family health history
            </Text>
            <Text style={[Typography.caption, { color: colors.primary, fontStyle: 'italic' }]}>
              ✓ You can select multiple conditions
            </Text>
          </View>

          {/* Options */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <View style={styles.optionsContainer}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionButton,
                      { borderColor: colors.border },
                      familyHistory[option.key as keyof typeof familyHistory] && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '10',
                      }
                    ]}
                    onPress={() => toggleOption(option.key as keyof typeof familyHistory)}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.optionHeader}>
                        <View style={[
                          styles.checkbox,
                          { borderColor: colors.border },
                          familyHistory[option.key as keyof typeof familyHistory] && {
                            borderColor: colors.primary,
                            backgroundColor: colors.primary,
                          }
                        ]}>
                          {familyHistory[option.key as keyof typeof familyHistory] && (
                            <Text style={[styles.checkmark, { color: colors.textInverse }]}>✓</Text>
                          )}
                        </View>
                        <Text style={[
                          styles.optionLabel,
                          { color: colors.textPrimary },
                          familyHistory[option.key as keyof typeof familyHistory] && {
                            color: colors.primary,
                            fontWeight: '600',
                          }
                        ]}>
                          {option.label}
                        </Text>
                      </View>
                      <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Separator */}
              <View style={styles.separator}>
                <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.separatorText, { color: colors.textTertiary }]}>OR</Text>
                <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
              </View>

              {/* None option */}
              <TouchableOpacity
                style={[
                  styles.noneOptionButton,
                  { borderColor: colors.border },
                  familyHistory.none && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '10',
                  }
                ]}
                onPress={() => toggleOption('none')}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <View style={[
                      styles.checkbox,
                      { borderColor: colors.border },
                      familyHistory.none && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary,
                      }
                    ]}>
                      {familyHistory.none && (
                        <Text style={[styles.checkmark, { color: colors.textInverse }]}>✓</Text>
                      )}
                    </View>
                    <Text style={[
                      styles.optionLabel,
                      { color: colors.textPrimary },
                      familyHistory.none && {
                        color: colors.primary,
                        fontWeight: '600',
                      }
                    ]}>
                      {noneOption.label}
                    </Text>
                  </View>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {noneOption.description}
                  </Text>
                </View>
              </TouchableOpacity>
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    marginLeft: 36,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: SPACING.md,
    fontSize: 14,
    fontWeight: '600',
  },
  noneOptionButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: SPACING.md,
    backgroundColor: 'transparent',
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
