'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type ReRadioGroupProps = {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  description?: string;
  onChange?: (value: string) => void; // Accepting an onChange prop
  value?: string;
  required?: boolean;
};

const ReRadioGroup = ({
  name,
  label,
  options,
  description,
  onChange,
  required,
}: ReRadioGroupProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="font-spaceGrotesk text-lg">
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value); // Update the form state
                onChange?.(value); // Call the onChange prop if provided
              }}
              className="ml-10 space-y-2"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className=" border-primary-500 text-primary-500 focus:ring-primary-500"
                  />
                  <FormLabel
                    htmlFor={option.value}
                    className="ml-2 text-lg font-medium text-gray-700"
                  >
                    {option.label}
                  </FormLabel>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReRadioGroup;
