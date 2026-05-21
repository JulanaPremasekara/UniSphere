import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText } from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

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
  const { colors } = useTheme();

  return (
    <FormControl isInvalid={isInvalid} size="md">
      <FormControlLabel>
        <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>{label}</Text>
      </FormControlLabel>
      <Input style={{ height: 56, borderRadius: 20, backgroundColor: colors.bgInput, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 8 }}>
        <InputField 
          type={isPass ? (showPassword ? 'text' : 'password') : type} 
          placeholder={place} 
          value={val} 
          onChangeText={setVal} 
          style={{ color: colors.text }} 
          placeholderTextColor={colors.textMuted}
        />
        {isPass && (
          <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
            <InputIcon as={showPassword ? Eye : EyeOff} size="lg" style={{ color: colors.textMuted }} />
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
          <FormControlHelperText style={{ color: colors.primary, fontWeight: '500' }} className="text-right mt-2">Forgot Password?</FormControlHelperText>
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