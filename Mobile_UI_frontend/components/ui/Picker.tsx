import { BORDER_RADIUS, Colors, COMPONENTS, SPACING, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Picker as RNPicker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export interface PickerItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface PickerProps {
  items: PickerItem[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  variant?: 'default' | 'modal' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export function Picker({
  items,
  selectedValue,
  onValueChange,
  label,
  placeholder = 'Select an option',
  variant = 'default',
  size = 'md',
  disabled = false,
  error,
  helperText,
  containerStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  hapticFeedback = true,
}: PickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: COMPONENTS.input.padding.horizontal,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        height: COMPONENTS.input.height.sm,
      },
      md: {
        height: COMPONENTS.input.height.md,
      },
      lg: {
        height: COMPONENTS.input.height.lg,
      },
    };

    // Error styles
    const errorStyles: ViewStyle = error
      ? {
          borderColor: colors.error,
        }
      : {
          borderColor: colors.border,
        };

    // Disabled styles
    const disabledStyles: ViewStyle = disabled
      ? {
          backgroundColor: colors.background,
          opacity: 0.6,
        }
      : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...errorStyles,
      ...disabledStyles,
    };
  };

  const getLabelStyles = (): TextStyle => {
    return {
      ...Typography.label,
      color: error ? colors.error : colors.textPrimary,
      marginBottom: SPACING.sm,
      ...labelStyle,
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: Typography.body.fontSize,
      color: selectedItem ? colors.textPrimary : colors.textSecondary,
      fontWeight: selectedItem ? Typography.fontWeight.medium : Typography.fontWeight.normal,
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      sm: { fontSize: Typography.caption.fontSize },
      md: { fontSize: Typography.body.fontSize },
      lg: { fontSize: Typography.bodyLarge.fontSize },
    };

    return {
      ...baseStyle,
      ...sizeTextStyles[size],
    };
  };

  const getErrorStyles = (): TextStyle => {
    return {
      ...Typography.caption,
      color: colors.error,
      marginTop: SPACING.xs,
      ...errorStyle,
    };
  };

  const getHelperStyles = (): TextStyle => {
    return {
      ...Typography.caption,
      color: colors.textSecondary,
      marginTop: SPACING.xs,
      ...helperStyle,
    };
  };

  const handlePress = () => {
    if (!disabled) {
      if (variant === 'modal') {
        setIsModalVisible(true);
      }
    }
  };

  const handleItemSelect = (item: PickerItem) => {
    if (!item.disabled) {
      onValueChange(item.value);
      setIsModalVisible(false);
    }
  };

  const renderModalPicker = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <Pressable
        style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
        onPress={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderLight }]}>
            <Text style={[Typography.h6, { color: colors.textPrimary }]}>
              {label || 'Select an option'}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={[Typography.body, { color: colors.primary }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  {
                    backgroundColor: item.value === selectedValue ? colors.primary : 'transparent',
                    borderBottomColor: colors.borderLight,
                    opacity: item.disabled ? 0.5 : 1,
                  },
                ]}
                onPress={() => handleItemSelect(item)}
                disabled={item.disabled}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    {
                      color: item.value === selectedValue ? colors.textInverse : colors.textPrimary,
                      fontWeight: item.value === selectedValue ? Typography.fontWeight.semiBold : Typography.fontWeight.normal,
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === selectedValue && (
                  <Text style={[styles.checkmark, { color: colors.textInverse }]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );

  if (variant === 'modal') {
    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label && <Text style={getLabelStyles()}>{label}</Text>}
        
        <TouchableOpacity
          style={getContainerStyles()}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          <Text style={getTextStyles()}>
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
          <Text style={[styles.arrow, { color: colors.textSecondary }]}>
            ▼
          </Text>
        </TouchableOpacity>
        
        {error && <Text style={getErrorStyles()}>{error}</Text>}
        {helperText && !error && <Text style={getHelperStyles()}>{helperText}</Text>}
        
        {renderModalPicker()}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={getLabelStyles()}>{label}</Text>}
      
      <View style={getContainerStyles()}>
        <RNPicker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={[styles.picker, { color: colors.textPrimary }]}
          enabled={!disabled}
        >
          {items.map((item) => (
            <RNPicker.Item
              key={item.value}
              label={item.label}
              value={item.value}
              enabled={!item.disabled}
              color={item.disabled ? colors.textTertiary : colors.textPrimary}
            />
          ))}
        </RNPicker>
      </View>
      
      {error && <Text style={getErrorStyles()}>{error}</Text>}
      {helperText && !error && <Text style={getHelperStyles()}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  picker: {
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  modalItemText: {
    ...Typography.body,
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
