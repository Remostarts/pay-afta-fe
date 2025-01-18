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
  options: { label: string; value: string; radioDescription?: string }[];
  description?: string;
  onChange?: (value: string) => void; // Accepting an onChange prop
  value?: string;
  required?: boolean;
  className?: string;
  radioDescription?: string;
};

const ReRadioGroup = ({
  name,
  label,
  options,
  description,
  onChange,
  required,
  className,
}: ReRadioGroupProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`p-4 font-inter`}>
          {label && (
            <FormLabel className="font-spaceGrotesk text-lg">
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
          )}
          <FormControl className={`${className}`}>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value); // Update the form state
                onChange?.(value); // Call the onChange prop if provided
              }}
              className="flex items-center"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className=" border-green-500 text-green-500 focus:ring-green-500"
                  />
                  <FormLabel
                    htmlFor={option.value}
                    className="ml-2 font-inter text-base font-medium text-gray-700"
                  >
                    {option.label}
                    <p className="ml-2 font-inter text-sm text-gray-500">
                      {option.radioDescription}
                    </p>
                  </FormLabel>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-base font-normal text-primary-800" />
        </FormItem>
      )}
    />
  );
};

export default ReRadioGroup;
