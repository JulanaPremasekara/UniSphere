import React, { useState } from 'react';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Eye, EyeOff } from 'lucide-react-native';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errorMessage: string | null;
}

interface FieldProps {
  label: string;
  place: string;
  val: string;
  setVal: (val: string) => void;
  type?: "text" | "password";
  isPass?: boolean;
  isInvalid?: boolean;
  errorMessage?: string | null;
}

const Field = ({ label, place, val, setVal, type = 'text', isPass, isInvalid, errorMessage }: FieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isInvalid={isInvalid} size="md">
      <FormControlLabel>
        <FormControlLabelText className="text-gray-700 font-semibold mb-1">{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
        <InputField 
          type={isPass ? (showPassword ? 'text' : 'password') : type} 
          placeholder={place} 
          value={val} 
          onChangeText={setVal} 
          className="text-gray-800" 
        />
        {isPass && (
          <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
            <InputIcon as={showPassword ? Eye : EyeOff} size="lg" className="text-gray-400" />
          </InputSlot>
        )}
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
};

export default function LoginForm({ email, setEmail, password, setPassword, errorMessage }: LoginFormProps) {
  return (
    <VStack space="xl">
      <Field 
        label="Email Address" 
        place="Enter your email" 
        val={email} 
        setVal={setEmail} 
        isInvalid={!!errorMessage} 
      />
      <Field 
        label="Password" 
        place="Enter your password" 
        val={password} 
        setVal={setPassword} 
        type="password" 
        isPass={true} 
        isInvalid={!!errorMessage} 
        errorMessage={errorMessage}
      />
    </VStack>
  );
}