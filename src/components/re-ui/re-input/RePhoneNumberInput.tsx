import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import 'react-phone-input-2/lib/style.css';

interface RePhoneNumberProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  defaultCountry?: string;
}

export function RePhoneNumberInput<T extends FieldValues>({
  name,
  label = 'Phone Number',
  required = false,
  defaultCountry = 'ng',
}: RePhoneNumberProps<T>) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="col-span-full">
          <FormLabel className="text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <PhoneInput
              country={defaultCountry}
              value={field.value}
              onChange={(phone) => field.onChange(phone)}
              inputStyle={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
                paddingLeft: '48px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
              buttonStyle={{
                border: 'none',
                background: 'none',
                position: 'absolute',
                height: '40px',
                padding: '0 0 0 8px',
              }}
              dropdownStyle={{
                width: '300px',
              }}
            />
          </FormControl>
          <FormMessage className="text-base font-normal text-primary-800" />
        </FormItem>
      )}
    />
  );
}
