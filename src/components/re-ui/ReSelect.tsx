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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TReSelectProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange?: (value: string) => void;
  groupLabel?: string;
}

const ReSelect = ({
  name,
  label,
  description,
  placeholder,
  options,
  required,
  onChange,
  groupLabel,
}: TReSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="font-spaceGrotesk">
          {label && (
            <FormLabel className="text-sm text-gray-800">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {groupLabel ? (
                <SelectGroup>
                  <SelectLabel>{groupLabel}</SelectLabel>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription className="ml-1">{description}</FormDescription>}
          <FormMessage className="text-base font-normal text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default ReSelect;
