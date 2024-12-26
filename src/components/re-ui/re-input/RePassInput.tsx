import { motion } from 'framer-motion';
import { CheckCircle2, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';

type ValidationRule = {
  label: string;
  state: boolean;
};

const PasswordValidator = ({ validationRules }: { validationRules: ValidationRule[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    // className="dropdown left absolute left-20 z-50 flex flex-col items-start justify-start space-y-2 rounded-lg bg-primary-100 p-3 text-left"
  >
    {validationRules.map(({ label, state }) => (
      <span className="flex items-center gap-2" key={label}>
        <CheckCircle2 className={state ? 'text-green-500' : 'text-gray-400'} />
        {label}
      </span>
    ))}
  </motion.div>
);

type RePassInputProps = {
  isValidationDrop?: boolean;
  name: string; // Make name required to ensure each input is unique
  disabled?: boolean;
  label?: string;
  className?: string;
  required?: boolean;
};

const RePassInput = ({
  isValidationDrop = false,
  name,
  disabled = false,
  label = '',
  className = '',
  required = false,
}: RePassInputProps) => {
  const { control, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [validationState, setValidationState] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

  const validationRules: ValidationRule[] = [
    { label: 'At least one lowercase letter', state: validationState.lower },
    { label: 'At least one uppercase letter', state: validationState.upper },
    { label: 'At least one number', state: validationState.number },
    { label: 'At least one special character', state: validationState.special },
    { label: 'At least 6 characters', state: validationState.length },
  ];

  useEffect(() => {
    const validationRules = [
      { regex: /(?=.*[a-z])/, stateKey: 'lower' },
      { regex: /(?=.*[A-Z])/, stateKey: 'upper' },
      { regex: /(?=.*[0-9])/, stateKey: 'number' },
      { regex: /(?=.*[!@#$%^&*])/, stateKey: 'special' },
      { regex: /(?=.{6,})/, stateKey: 'length' },
    ];

    const subscription = watch((value) => {
      const passwordValue = value[name];
      setValidationState((prevState) => {
        const updatedState = { ...prevState };
        validationRules.forEach(({ regex, stateKey }) => {
          updatedState[stateKey as keyof typeof prevState] = regex.test(passwordValue);
        });
        return updatedState;
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, name]);

  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <FormControl>
              <div className="flex-center rounded border border-gray-300 pr-2 focus-visible:ring-2 focus-visible:ring-offset-2">
                <Input
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={label}
                  autoComplete="off"
                  disabled={disabled}
                  onFocus={() => setIsInputFocused(true)}
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                  onBlur={() => setIsInputFocused(false)}
                />
                {showPassword ? (
                  <EyeIcon
                    className="cursor-pointer select-none"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOffIcon
                    className="cursor-pointer select-none"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </FormControl>
            {isValidationDrop && isInputFocused && (
              <PasswordValidator validationRules={validationRules} />
            )}
            <FormMessage className="text-base font-normal text-primary-800" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RePassInput;
