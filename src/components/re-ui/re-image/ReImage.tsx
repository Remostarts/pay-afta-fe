import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload } from 'lucide-react';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type TReImageInputProps = {
  name: string;
  label?: string;
  description?: string;
  accept?: string;
  placeholder?: string;
};

const ReImageInput = ({
  name,
  label,
  description,
  accept = 'image/*',
  placeholder = 'Select an image...',
}: TReImageInputProps) => {
  const { control, setValue } = useFormContext();
  const [fileName, setFileName] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setValue(name, imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="font-spaceGrotesk">
          <FormLabel className="font-spaceGrotesk">{label}</FormLabel>
          <FormControl>
            <div className="flex items-center rounded border border-gray-300">
              <Input
                className="border-none font-spaceGrotesk"
                placeholder={placeholder}
                readOnly
                value={fileName || (field.value ? 'Image selected' : '')}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="m-1"
                onClick={() => document.getElementById(`${name}-file-input`)?.click()}
              >
                <Upload className="size-4" />
              </Button>
              <input
                id={`${name}-file-input`}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage className="text-base font-normal text-primary-800" />
        </FormItem>
      )}
    />
  );
};

export default ReImageInput;
