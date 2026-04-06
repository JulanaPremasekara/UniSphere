import React from 'react';
import { View, Text } from 'react-native';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

export default function SignUpForm({ formData, setFormData, showError, errorMessage }: any) {
  const update = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isEmailValid = formData.email.includes('@');
  const isPasswordValid = formData.password.length >= 6;

  const Field = ({ label, place, val, field, type = 'text', err }: any) => (
    <FormControl isInvalid={!!err}>
      <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">{label}</FormControlLabelText></FormControlLabel>
      <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
        <InputField type={type} placeholder={place} value={val} onChangeText={(v) => update(field, v)} className="text-gray-800" />
      </Input>
      {err && (
        <FormControlError className="mt-2">
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{err}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );

  return (
    <VStack space="lg">
      {errorMessage && (
        <View className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-4 flex-row items-center">
          <Icon as={AlertCircleIcon} className="text-red-600 mr-2" size="sm" />
          <Text className="text-red-700 font-medium flex-1">{errorMessage}</Text>
        </View>
      )}

      <Field label="Full Name" place="John Doe" val={formData.name} field="name" />
      <Field label="University Email" place="University Email" val={formData.email} field="email" err={showError && !isEmailValid ? "Please enter a valid university email." : null} />

      <VStack space="md">
        <Field label="Year of Study" place="Year of Study (e.g. Year 1)" val={formData.year} field="year" />
        <Field label="Field of Study" place="e.g., Data Science" val={formData.major} field="major" />
      </VStack>

      <VStack space="md">
        <Field label="Create Password" place="Create Password" val={formData.password} field="password" type="password" err={showError && !isPasswordValid ? "Password must be at least 6 characters." : null} />
        <Field label="Confirm Password" place="Confirm Password" val={formData.confirmPassword} field="confirmPassword" type="password" err={showError && !passwordsMatch ? "Passwords do not match" : null} />
      </VStack>
    </VStack>
  );
}