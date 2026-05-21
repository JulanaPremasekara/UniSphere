import React from 'react';
import { View, Text } from 'react-native';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/context/ThemeContext';

const Field = ({ label, place, val, field, update, type = 'text', err }: any) => {
  const { colors } = useTheme();
  return (
    <FormControl isInvalid={!!err}>
      <FormControlLabel>
        <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>{label}</Text>
      </FormControlLabel>
      <Input style={{ height: 56, borderRadius: 20, backgroundColor: colors.bgInput, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 8 }}>
        <InputField 
          type={type} 
          placeholder={place} 
          value={val} 
          onChangeText={(v) => update(field, v)} 
          style={{ color: colors.text }} 
          placeholderTextColor={colors.textMuted}
        />
      </Input>
      {err && (
        <FormControlError className="mt-2">
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{err}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default function SignUpForm({ formData, setFormData, showError, errorMessage }: any) {
  const update = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  const { colors } = useTheme();
  
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isEmailValid = formData.email.includes('@');
  const isPasswordValid = formData.password.length >= 6;

  return (
    <VStack space="lg">
      {errorMessage && (
        <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }} className="border p-4 rounded-2xl mb-4 flex-row items-center">
          <Icon as={AlertCircleIcon} className="text-red-600 mr-2" size="sm" />
          <Text className="text-red-700 font-medium flex-1">{errorMessage}</Text>
        </View>
      )}

      <Field label="Full Name" place="John Doe" val={formData.name} field="name" update={update} />
      <Field label="University Email" place="University Email" val={formData.email} field="email" update={update} err={showError && !isEmailValid ? "Please enter a valid university email." : null} />
      <Field label="Phone Number" place="Phone Number (optional)" val={formData.phone} field="phone" update={update} />

      <VStack space="md">
        <Field label="Year of Study" place="Year of Study (e.g. Year 1)" val={formData.year} field="year" update={update} />
        <Field label="Field of Study" place="e.g., Data Science" val={formData.major} field="major" update={update} />
      </VStack>

      <VStack space="md">
        <Field label="Create Password" place="Create Password" val={formData.password} field="password" type="password" update={update} err={showError && !isPasswordValid ? "Password must be at least 6 characters." : null} />
        <Field label="Confirm Password" place="Confirm Password" val={formData.confirmPassword} field="confirmPassword" type="password" update={update} err={showError && !passwordsMatch ? "Passwords do not match" : null} />
      </VStack>
    </VStack>
  );
}