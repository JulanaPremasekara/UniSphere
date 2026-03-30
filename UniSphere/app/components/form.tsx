// components/form.tsx
import React from 'react';
import { 
  FormControl, FormControlLabel, FormControlLabelText, 
  FormControlHelper, FormControlHelperText, 
  FormControlError, FormControlErrorIcon, FormControlErrorText 
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

// Define what this component needs from the parent
interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showError: boolean;
}

export function LoginForm({ email, setEmail, password, setPassword, showError }: LoginFormProps) {
  return (
    <VStack space="xl">
      {/* Email Field */}
      <FormControl isInvalid={showError} size="md">
        <FormControlLabel>
          <FormControlLabelText className="text-gray-700 font-semibold mb-1">Email Address</FormControlLabelText>
        </FormControlLabel>
        <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
          <InputField 
            placeholder="Enter your email" 
            value={email}
            onChangeText={setEmail}
            className="text-gray-800"
          />
        </Input>
      </FormControl>

      {/* Password Field */}
      <FormControl isInvalid={showError} size="md">
        <FormControlLabel>
          <FormControlLabelText className="text-gray-700 font-semibold mb-1">Password</FormControlLabelText>
        </FormControlLabel>
        <Input className="h-14 rounded-[20px] bg-gray-50 border-transparent px-2">
          <InputField 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChangeText={setPassword}
            className="text-gray-800"
          />
        </Input>
        
        {showError ? (
          <FormControlError className="mt-2">
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              Invalid email or password (min. 6 chars).
            </FormControlErrorText>
          </FormControlError>
        ) : (
          <FormControlHelper>
            <FormControlHelperText className="text-right mt-2 text-indigo-600 font-medium">
              Forgot Password?
            </FormControlHelperText>
          </FormControlHelper>
        )}
      </FormControl>
    </VStack>
  );
}