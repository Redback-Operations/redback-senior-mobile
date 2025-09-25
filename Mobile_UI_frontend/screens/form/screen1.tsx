import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Picker } from '@/components/ui/Picker';
import { SliderComponent } from '@/components/ui/Slider';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen1() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, updateFormData, nextStep, validateCurrentStep } = useForm();

  useEffect(() => {
    const defaults: Partial<UserFormData> = {};
    if (state.data.age === undefined) defaults.age = 25;
    if (state.data.gender === undefined) defaults.gender = 'male';
    if (state.data.height === undefined) defaults.height = 170;
    if (state.data.weight === undefined) defaults.weight = 70;

    if (Object.keys(defaults).length > 0) {
      updateFormData(defaults);
    }
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
    }
  };

  const updateField = (field: keyof UserFormData, value: any) => {
    updateFormData({ [field]: value });
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
              Basic Information
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Tell us about yourself to get started
            </Text>
          </View>

          {/* Age */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <SliderComponent
                label="Age"
                value={state.data.age ?? 25}
                onValueChange={(value) => updateField('age', Math.round(value))}
                minimumValue={13}
                maximumValue={100}
                step={1}
                unit="years"
                variant="minimal"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Gender */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <Picker
                label="Gender"
                items={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ]}
                selectedValue={state.data.gender ?? 'male'}
                onValueChange={(value) => updateField('gender', value)}
                variant="modal"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Height */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <SliderComponent
                label="Height"
                value={state.data.height ?? 170}
                onValueChange={(value) => updateField('height', Math.round(value))}
                minimumValue={50}
                maximumValue={200}
                step={1}
                unit="cm"
                variant="minimal"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Weight */}
          <Card variant="elevated" style={styles.card}>
            <CardContent>
              <SliderComponent
                label="Weight"
                value={state.data.weight ?? 70}
                onValueChange={(value) => updateField('weight', Math.round(value))}
                minimumValue={20}
                maximumValue={200}
                step={1}
                unit="kg"
                variant="minimal"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Continue"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleNext}
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
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
});
