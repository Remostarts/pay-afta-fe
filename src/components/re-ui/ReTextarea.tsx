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
import { Textarea } from '@/components/ui/textarea';

type TReTextareaProps = {
  name: string;
  label?: string;
  className?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
};

export function ReTextarea({
  name,
  label,
  className,
  placeholder,
  description,
  required,
  defaultValue,
}: TReTextareaProps) {
  const { control } = useFormContext();

  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="font-spaceGrotesk">
            <FormLabel className="font-spaceGrotesk">
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={placeholder}
                className={`resize-none border-2 font-spaceGrotesk ${className}`}
                defaultValue={defaultValue}
                {...field}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage className="text-base font-normal text-primary-800" />
          </FormItem>
        )}
      />
    </div>
  );
}
