import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { AssessmentHistoryEntry } from '../../types';

interface ResultCardProps {
  entry: AssessmentHistoryEntry;
  onPress: () => void;
}

export default function ResultCard({ entry, onPress }: ResultCardProps) {
  // Color coding for BMI category
  let statusColor = Colors.light.primary;
  if (entry.results.bmiCategory === 'obese' || entry.results.bmiCategory === 'overweight') {
    statusColor = Colors.light.error;
  } else if (entry.results.bmiCategory === 'normal') {
    statusColor = Colors.light.success;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.date}>{entry.completedAt ? new Date(entry.completedAt).toLocaleString() : ''}</Text>
      <Text style={[styles.category, { color: statusColor }]}>{entry.results.bmiCategory.toUpperCase()}</Text>
      <Text style={styles.score}>Health Score: {entry.results.healthScore}%</Text>
      <Text style={styles.risk}>
        {entry.results.riskFactors.length > 0
          ? `Risks: ${entry.results.riskFactors.join(', ')}`
          : 'No major risks'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    ...Typography.label,
    color: Colors.light.textSecondary,
  },
  category: {
    ...Typography.h5,
    color: Colors.light.primary,
    marginTop: 4,
  },
  score: {
    ...Typography.body,
    color: Colors.light.textPrimary,
    marginTop: 2,
  },
  risk: {
    ...Typography.caption,
    color: Colors.light.warning,
    marginTop: 4,
  },
});
