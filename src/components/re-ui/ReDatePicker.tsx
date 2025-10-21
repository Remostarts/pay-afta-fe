import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type TReDatePickerProps = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disablePast?: boolean; // Disable past dates (allow future)
  disableFuture?: boolean; // Disable future dates (allow past)
  minDate?: Date; // Custom minimum date
  maxDate?: Date; // Custom maximum date
};

const ReDatePicker = ({
  name,
  label,
  description,
  placeholder = 'Pick a date',
  className,
  required = false,
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
}: TReDatePickerProps) => {
  const { control } = useFormContext();

  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`font-spaceGrotesk ${className}`}>
          {label && (
            <FormLabel className="font-spaceGrotesk">
              {label} {required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal border border-gray-300',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? format(field.value, 'PPP') : <span>{placeholder}</span>}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  className="bg-white"
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    field.onBlur();
                  }}
                  disabled={(date) => {
                    // Disable past dates if disablePast is true
                    if (disablePast && date < today) {
                      return true;
                    }

                    // Disable future dates if disableFuture is true
                    if (disableFuture && date > today) {
                      return true;
                    }

                    // Disable dates before minDate if provided
                    if (minDate && date < minDate) {
                      return true;
                    }

                    // Disable dates after maxDate if provided
                    if (maxDate && date > maxDate) {
                      return true;
                    }

                    return false;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription className="mt-1">{description}</FormDescription>}
          <FormMessage className="mt-1 text-base font-normal text-primary-800" />
        </FormItem>
      )}
    />
  );
};

export default ReDatePicker;
