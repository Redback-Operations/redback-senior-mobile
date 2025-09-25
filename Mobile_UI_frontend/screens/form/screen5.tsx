import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { DIET_FREQUENCY_COLORS } from '@/constants/design';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserFormData } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DietFrequency = 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';

export default function Screen5() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();
  const dietHabits = state.data.dietHabits || {};

  const dietQuestions = useMemo(() => [
    {
      key: 'fastFood',
      label: 'Fast Food',
      description: 'Burgers, fries, pizza, and other quick meals',
      icon: '🍔',
      color: colors.error,
    },
    {
      key: 'vegetables',
      label: 'Vegetables',
      description: 'Fresh greens, root vegetables, and plant-based foods',
      icon: '🥬',
      color: colors.secondary,
    },
    {
      key: 'fruits',
      label: 'Fruits',
      description: 'Fresh fruits, berries, and natural sweet treats',
      icon: '🍎',
      color: colors.success,
    },
    {
      key: 'water',
      label: 'Water',
      description: 'Plain water and hydrating beverages',
      icon: '💧',
      color: colors.info,
    },
    {
      key: 'alcohol',
      label: 'Alcohol',
      description: 'Beer, wine, spirits, and alcoholic beverages',
      icon: '🍷',
      color: colors.warning,
    },
  ], [colors]);

  // Animation values for each question
  const animations = useMemo(() => {
    const anims: { [key: string]: Animated.Value } = {};
    dietQuestions.forEach(question => {
      anims[question.key] = new Animated.Value(0);
    });
    return anims;
  }, [dietQuestions]);

  useEffect(() => {
    if (state.data.dietHabits === undefined) {
      updateFormData({
        dietHabits: {
          fastFood: 'sometimes',
          vegetables: 'sometimes',
          fruits: 'sometimes',
          water: 'often',
          alcohol: 'rarely',
        },
      });
    }
  }, []);

  useEffect(() => {
    // Animate questions in sequence
    dietQuestions.forEach((question, index) => {
      Animated.timing(animations[question.key], {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [animations, dietQuestions]);

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      Alert.alert('Validation Error', 'Please complete all diet habit questions.');
    }
  };

  const handlePrevious = () => {
    prevStep();
  };

  const updateDietHabit = (habit: keyof UserFormData['dietHabits'], frequency: DietFrequency) => {
    updateFormData({ dietHabits: { ...dietHabits, [habit]: frequency } });
    
    // Animate selection
    Animated.sequence([
      Animated.timing(animations[habit], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations[habit], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const frequencyOptions: { key: DietFrequency; label: string; description: string }[] = [
    { key: 'never', label: 'Never', description: 'Not at all' },
    { key: 'rarely', label: 'Rarely', description: 'Once a month' },
    { key: 'sometimes', label: 'Sometimes', description: 'Weekly' },
    { key: 'often', label: 'Often', description: 'Daily' },
    { key: 'daily', label: 'Daily', description: 'Multiple times' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressBar variant="minimal" />
        
        {/* Header Section */}
          <View style={styles.header}>
            <Text style={[Typography.h1, { color: colors.textPrimary }]}>
              Diet Habits
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Help us understand your eating patterns
            </Text>
          </View>
        <View style={styles.content}>
          {dietQuestions.map((question, questionIndex) => (
            <Animated.View
              key={question.key}
              style={[
                styles.questionCard,
                {
                  opacity: animations[question.key],
                  transform: [{
                    translateY: animations[question.key].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  }],
                },
              ]}
            >
              <Card variant="elevated" style={styles.card}>
                <CardContent>
                  {/* Question Header */}
                  <View style={styles.questionHeader}>
                    <View style={[styles.questionIconContainer, { backgroundColor: question.color + '20' }]}>
                      <Text style={styles.questionIcon}>{question.icon}</Text>
                    </View>
                    <View style={styles.questionTextContainer}>
                      <Text style={[Typography.h6, { color: colors.textPrimary }]} numberOfLines={0}>{question.label}</Text>
                      <Text style={[Typography.caption, { color: colors.textSecondary }]} numberOfLines={0}>{question.description}</Text>
                    </View>
                  </View>
                  
                  {/* Frequency Options */}
                  <View style={styles.frequencyContainer}>
                    {frequencyOptions.map((option, optionIndex) => {
                      const isSelected = dietHabits[question.key as keyof UserFormData['dietHabits']] === option.key;
                      const frequencyColors = DIET_FREQUENCY_COLORS[option.key];
                      
                      return (
                        <TouchableOpacity
                          key={option.key}
                          style={[
                            styles.frequencyButton,
                            { borderColor: colors.border },
                            isSelected && {
                              backgroundColor: frequencyColors.bg,
                              borderColor: frequencyColors.border,
                            },
                          ]}
                          onPress={() => updateDietHabit(
                            question.key as keyof UserFormData['dietHabits'], 
                            option.key
                          )}
                          activeOpacity={0.7}
                        >
                          <View style={[
                            styles.frequencyRadio,
                            { borderColor: colors.border },
                            isSelected && {
                              borderColor: frequencyColors.icon,
                              backgroundColor: frequencyColors.bg,
                            }
                          ]}>
                            {isSelected && (
                              <View style={[
                                styles.frequencyRadioInner,
                                { backgroundColor: frequencyColors.icon }
                              ]} />
                            )}
                          </View>
                          <View style={styles.frequencyTextContainer}>
                            <Text style={[
                              styles.frequencyLabel,
                              { color: colors.textPrimary },
                              isSelected && { color: frequencyColors.text }
                            ]} numberOfLines={0}>
                              {option.label}
                            </Text>
                            <Text style={[
                              styles.frequencyDescription,
                              { color: colors.textSecondary },
                              isSelected && { color: frequencyColors.text }
                            ]} numberOfLines={0}>
                              {option.description}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
          ))}

          {/* Action Buttons */}
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
  
  // Header Styles
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  
  // Content Styles
  content: {
    padding: SPACING.lg,
  },
  questionCard: {
    marginBottom: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.md,
  },
  
  // Question Header
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    minHeight: 60,
  },
  questionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  questionIcon: {
    fontSize: 24,
  },
  questionTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  
  // Frequency Options
  frequencyContainer: {
    gap: SPACING.sm,
  },
  frequencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: SPACING.sm,
  },
  frequencyRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  frequencyTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    flexShrink: 1,
  },
  frequencyDescription: {
    fontSize: 12,
    flexShrink: 1,
    lineHeight: 16,
  },
  
  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING['2xl'],
    gap: SPACING.md,
  },
  button: {
    flex: 1,
  },
  
});
