import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '../theme/colors.js';

export const MobileButton = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    if (onPress) onPress();
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'cyan':
        return colors.neonCyan;
      case 'gold':
        return colors.gold;
      case 'secondary':
        return colors.cardHover;
      default:
        return colors.primaryPurple;
    }
  };

  const getTextColor = () => {
    if (variant === 'cyan' || variant === 'gold') return '#080B14';
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default MobileButton;
