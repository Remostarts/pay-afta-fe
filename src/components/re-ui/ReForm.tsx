'use client';

import { DevTool } from '@hookform/devtools';
import { ReactElement, ReactNode } from 'react';
import { FieldValues, Resolver, SubmitHandler, useForm } from 'react-hook-form';

import NoSSRWrapper from '../ui-utils/NoSSRWrapper';

import { Form } from '@/components/ui/form';

export type FormConfig = {
  defaultValues?: FieldValues;
  resolver?: Resolver<FieldValues>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
};

export type FormProps<T extends FieldValues> = {
  children?: ReactElement | ReactNode;
  submitHandler: SubmitHandler<T>;
} & FormConfig;

function ReForm<T extends FieldValues>({
  children,
  submitHandler,
  defaultValues,
  resolver,
  mode = 'onBlur',
}: FormProps<T>) {
  const formConfig: FormConfig = {};
  formConfig.mode = mode;
  // type FormPropsType = Prettify<FormProps<T>>;

  if (defaultValues) formConfig.defaultValues = defaultValues;
  if (resolver) formConfig.resolver = resolver;

  const form = useForm(formConfig);

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    submitHandler(data as T);
  };
  // useEffect(() => reset(defaultValues), [defaultValues, reset, form]);
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-3 overflow-x-hidden">
        {children}
      </form>
      <NoSSRWrapper>
        <DevTool control={form.control} />
      </NoSSRWrapper>
    </Form>
  );
}

export default ReForm;
// write your code here
