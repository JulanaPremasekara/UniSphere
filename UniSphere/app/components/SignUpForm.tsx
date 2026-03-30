import React from 'react';
import { 
  FormControl, FormControlLabel, FormControlLabelText, 
  FormControlError, FormControlErrorIcon, FormControlErrorText 
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

interface SignUpFormProps {
  formData: any;
  setFormData: (data: any) => void;
  showError: boolean;
}

export function SignUpForm({ formData, setFormData, showError }: SignUpFormProps) {
  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <VStack space="lg">
      {/* Full Name */}
      <FormControl>
        <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Full Name</FormControlLabelText></FormControlLabel>
        <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
          <InputField placeholder="John Doe" value={formData.name} onChangeText={(v) => updateField('name', v)} />
        </Input>
      </FormControl>

      {/* University Email */}
      <FormControl isInvalid={showError && !formData.email.includes('@')}>
        <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">University Email</FormControlLabelText></FormControlLabel>
        <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
          <InputField placeholder="University Email" value={formData.email} onChangeText={(v) => updateField('email', v)} />
        </Input>
      </FormControl>

      {/* Student Year & Major */}
      <VStack space="md">
        <FormControl>
            <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Year of Study</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField placeholder="Year of Study (e.g. Year 1)" value={formData.year} onChangeText={(v) => updateField('year', v)} />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Major / Department</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField placeholder="Major / Department" value={formData.major} onChangeText={(v) => updateField('major', v)} />
          </Input>
        </FormControl>
      </VStack>

      {/* Password Fields */}
      <VStack space="md">
        <FormControl isInvalid={showError && formData.password.length < 6}>
            <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Create Password</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField type="password" placeholder="Create Password" value={formData.password} onChangeText={(v) => updateField('password', v)} />
          </Input>
        </FormControl>

        <FormControl isInvalid={showError && !passwordsMatch}>
          <FormControlLabel><FormControlLabelText className="text-gray-700 font-semibold">Confirm Password</FormControlLabelText></FormControlLabel>
          <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
            <InputField type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChangeText={(v) => updateField('confirmPassword', v)} />
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