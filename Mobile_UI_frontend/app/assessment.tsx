import { Colors, SPACING } from '@/constants/theme';
import { useForm } from '@/contexts/FormContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Screen1 from '@/screens/form/screen1';
import Screen2 from '@/screens/form/screen2';
import Screen3 from '@/screens/form/screen3';
import Screen4 from '@/screens/form/screen4';
import Screen5 from '@/screens/form/screen5';
import Screen6 from '@/screens/form/screen6';
import Screen7 from '@/screens/form/screen7';
import ResultsScreen from '@/screens/results/ResultsScreen';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AssessmentScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, prevStep } = useForm();

  const renderCurrentScreen = () => {
    switch (state.currentStep) {
      case 1:
        return <Screen1 />;
      case 2:
        return <Screen2 />;
      case 3:
        return <Screen3 />;
      case 4:
        return <Screen4 />;
      case 5:
        return <Screen5 />;
      case 6:
        return <Screen6 />;
      case 7:
        return <Screen7 />;
      case 8:
        return <ResultsScreen />;
      default:
        return <Screen1 />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentWrapper}>
        {state.currentStep > 1 && state.currentStep <= 7 && (
          <View style={styles.header}>
            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        {renderCurrentScreen()}
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
  header: {
    padding: SPACING.md,
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    padding: SPACING.sm,
  },
});
