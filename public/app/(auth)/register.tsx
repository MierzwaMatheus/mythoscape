import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Logo from '@/components/common/Logo';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    
    try {
      if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      await signUp(email, password);
      router.replace('/api-key');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Logo size={100} />
          <Text style={[styles.title, { color: colors.primary }]}>Join MYTHOSCAPE</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Create your account to start your adventure
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.cardBackground
              }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.cardBackground
                }]}
                placeholder="Create a password"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textLight} />
                ) : (
                  <Eye size={20} color={colors.textLight} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.cardBackground
                }]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <Button 
            title="Create Account" 
            onPress={handleRegister} 
            loading={loading}
            icon={<UserPlus size={20} color="#FFFFFF" />}
            style={{ marginTop: 16 }}
          />

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textLight }]}>
              Already have an account?
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: colors.accent }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Bitter-Bold',
    fontSize: 24,
    marginTop: 16,
  },
  subtitle: {
    fontFamily: 'Exo-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Exo-Regular',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Exo-Regular',
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  loginLink: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
  },
});