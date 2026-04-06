import React from 'react';
import { View, Text } from 'react-native';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

export default function UpdateProfileForm({ formData, setFormData, showError, errorMessage }: any) {
  const update = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  const pwOk = !formData.password || formData.password.length >= 6;
  const pwMatch = formData.password === formData.confirmPassword;

  const Field = ({ label, place, val, field, edit = true, type = 'text', err }: any) => (
    <FormControl isInvalid={!!err}>
      <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">{label}</FormControlLabelText></FormControlLabel>
      <Input className={`h-14 rounded-[20px] ${edit ? 'bg-gray-50' : 'bg-gray-100'} border-transparent px-2`}>
        <InputField type={type} placeholder={place} value={val} editable={edit} onChangeText={edit ? (v) => update(field, v) : undefined} className={edit ? "text-gray-800" : "text-gray-400"} />
      </Input>
      {err && <FormControlError className="mt-2"><FormControlErrorIcon as={AlertCircleIcon} /><FormControlErrorText>{err}</FormControlErrorText></FormControlError>}
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
      <Field label="University Email (Cannot be changed)" place="University Email" val={formData.email} edit={false} />
      
      <VStack space="md">
        <Field label="Year of Study" place="e.g. Year 1" val={formData.year} field="year" />
        <Field label="Field of Study" place="e.g., Data Science" val={formData.major} field="major" />
      </VStack>

      <VStack space="md">
        <Field label="New Password (Optional)" place="Leave blank to keep current" val={formData.password} field="password" type="password" err={showError && !pwOk ? "Password must be at least 6 characters." : null} />
        <Field label="Confirm New Password" place="Confirm Password" val={formData.confirmPassword} field="confirmPassword" type="password" err={showError && !pwMatch ? "Passwords do not match" : null} />
      </VStack>
    </VStack>
  );
}
