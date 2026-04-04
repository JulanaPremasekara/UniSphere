import React from 'react';
import { View, Text } from 'react-native';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

interface SignUpFormProps {
  formData: any;
  setFormData: (data: any) => void;
  showError: boolean;
  errorMessage: string | null;
}

export function SignUpForm({ formData, setFormData, showError, errorMessage }: SignUpFormProps) {
  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isEmailValid = formData.email.includes('@');
  const isPasswordValid = formData.password.length >= 6;

  return (
    <VStack space="lg">
      {/* --- SERVER ERROR MESSAGE --- */}
      {errorMessage && (
        <View className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-4 flex-row items-center">
          <Icon as={AlertCircleIcon} className="text-red-600 mr-2" size="sm" />
          <Text className="text-red-700 font-medium flex-1">{errorMessage}</Text>
        </View>
      )}

      {/* Full Name */}
      <FormControl>
        <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Full Name</FormControlLabelText></FormControlLabel>
        <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
          <InputField 
            placeholder="John Doe" 
            value={formData.name} 
            onChangeText={(v) => updateField('name', v)} 
            className="text-gray-800"
          />
        </Input>
      </FormControl>

      {/* University Email */}
      <FormControl isInvalid={showError && !isEmailValid}>
        <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">University Email</FormControlLabelText></FormControlLabel>
        <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
          <InputField 
            placeholder="University Email" 
            value={formData.email} 
            onChangeText={(v) => updateField('email', v)} 
            className="text-gray-800"
          />
        </Input>
        {showError && !isEmailValid && (
          <FormControlError className="mt-2">
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Please enter a valid university email.</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Student Year & Major */}
      <VStack space="md">
        <FormControl>
            <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Year of Study</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField 
              placeholder="Year of Study (e.g. Year 1)" 
              value={formData.year} 
              onChangeText={(v) => updateField('year', v)} 
              className="text-gray-800"
            />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Field of Study</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField 
            placeholder="e.g., Data Science" 
            value={formData.major} 
            onChangeText={(v) => updateField('major', v)} 
            className="text-gray-800"
          />
          </Input>
        </FormControl>
      </VStack>

      {/* Password Fields */}
      <VStack space="md">
        <FormControl isInvalid={showError && !isPasswordValid}>
            <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Create Password</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField 
              type="password" 
              placeholder="Create Password" 
              value={formData.password} 
              onChangeText={(v) => updateField('password', v)} 
              className="text-gray-800"
            />
          </Input>
          {showError && !isPasswordValid && (
            <FormControlError className="mt-2">
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Password must be at least 6 characters.</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={showError && !passwordsMatch}>
          <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Confirm Password</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField 
            type="password" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword} 
            onChangeText={(v) => updateField('confirmPassword', v)} 
            className="text-gray-800"
          />
          </Input>
          {showError && !passwordsMatch && (
            <FormControlError className="mt-2">
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Passwords do not match</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    </VStack>
  );
}