import React from 'react';
import { View, Text } from 'react-native';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/context/ThemeContext';

const Field = ({ label, place, val, field, update, edit = true, type = 'text', err }: any) => {
  const { colors } = useTheme();
  return (
    <FormControl isInvalid={!!err}>
      <FormControlLabel>
        <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
      </FormControlLabel>
      <Input
        style={{
          height: 56,
          borderRadius: 20,
          backgroundColor: edit ? colors.bgInput : colors.bgCard,
          borderColor: colors.border,
          borderWidth: 1,
          paddingHorizontal: 8,
        }}
      >
        <InputField
          type={type}
          placeholder={place}
          value={val}
          editable={edit}
          onChangeText={edit ? (v) => update(field, v) : undefined}
          style={{ color: edit ? colors.text : colors.textMuted }}
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

export default function UpdateProfileForm({ formData, setFormData, showError, errorMessage }: any) {
  const update = (f: string, v: string) => setFormData({ ...formData, [f]: v });
  const pwOk = !formData.password || formData.password.length >= 6;
  const pwMatch = formData.password === formData.confirmPassword;
  const { colors } = useTheme();

  return (
    <VStack space="lg">
      {errorMessage && (
        <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }} className="border p-4 rounded-2xl mb-4 flex-row items-center">
          <Icon as={AlertCircleIcon} className="text-red-600 mr-2" size="sm" />
          <Text className="text-red-700 font-medium flex-1">{errorMessage}</Text>
        </View>
      )}

      <Field label="Full Name" place="John Doe" val={formData.name} field="name" update={update} />
      <Field label="University Email (Cannot be changed)" place="University Email" val={formData.email} edit={false} update={update} />
      <Field label="Phone Number" place="Phone Number" val={formData.phone} field="phone" update={update} />
      
      <VStack space="md">
        <Field label="Year of Study" place="e.g. Year 1" val={formData.year} field="year" update={update} />
        <Field label="Field of Study" place="e.g., Data Science" val={formData.major} field="major" update={update} />
      </VStack>

      <VStack space="md">
        <Field label="New Password (Optional)" place="Leave blank to keep current" val={formData.password} field="password" type="password" update={update} err={showError && !pwOk ? "Password must be at least 6 characters." : null} />
        <Field label="Confirm New Password" place="Confirm Password" val={formData.confirmPassword} field="confirmPassword" type="password" update={update} err={showError && !pwMatch ? "Passwords do not match" : null} />
      </VStack>
    </VStack>
  );
}
