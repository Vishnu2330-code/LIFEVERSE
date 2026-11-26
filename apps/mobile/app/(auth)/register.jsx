import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useMobileAuth } from '../../src/store/useMobileAuth.js';
import MobileButton from '../../src/components/MobileButton.jsx';
import MobileCard from '../../src/components/MobileCard.jsx';
import colors from '../../src/theme/colors.js';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useMobileAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Required Fields', 'Please complete all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password Length', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password });
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          LIFE<Text style={styles.highlight}>VERSE</Text>
        </Text>
        <Text style={styles.subtitle}>Forge your new adventurer hero</Text>
      </View>

      <MobileCard style={styles.card}>
        <Text style={styles.label}>Hero Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="CyberKnight99"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="hero@lifeverse.io"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 8 characters"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <MobileButton
          title="Create Hero Profile"
          onPress={handleRegister}
          isLoading={loading}
          style={styles.button}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.signinText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </MobileCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  highlight: {
    color: colors.electricBlue,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },
  card: {
    padding: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 14,
  },
  button: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  signinText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neonCyan,
  },
});
