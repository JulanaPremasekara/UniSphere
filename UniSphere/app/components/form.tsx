import React from 'react';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errorMessage: string | null;
}

export default function LoginForm({ email, setEmail, password, setPassword, errorMessage }: LoginFormProps) {
  const Field = ({ label, place, val, setVal, type = 'text', isPass }: any) => (
    <FormControl isInvalid={!!errorMessage} size="md">
      <FormControlLabel>
        <FormControlLabelText className="text-gray-700 font-semibold mb-1">{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
        <InputField type={type} placeholder={place} value={val} onChangeText={setVal} className="text-gray-800" />
      </Input>
      {isPass && errorMessage ? (
        <FormControlError className="mt-2">
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      ) : isPass ? (
        <FormControlHelper>
          <FormControlHelperText className="text-right mt-2 text-indigo-600 font-medium">Forgot Password?</FormControlHelperText>
        </FormControlHelper>
      ) : null}
    </FormControl>
  );

  return (
    <VStack space="xl">
      <Field label="Email Address" place="Enter your email" val={email} setVal={setEmail} />
      <Field label="Password" place="Enter your password" val={password} setVal={setPassword} type="password" isPass={true} />
    </VStack>
  );
}