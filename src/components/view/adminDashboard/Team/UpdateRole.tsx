'use client';

import { title } from 'process';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
import { z } from 'zod';

import SuccessfulCard from './SuccessfulCard';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { ReCheckBox } from '@/components/re-ui/re-checkbox/ReCheckBox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

const features = [
  { id: 'users', label: 'Users' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'payment-orders', label: 'Payment Orders' },
  { id: 'virtual-card', label: 'Virtual Card' },
  { id: 'team', label: 'Team' },
];

interface IUpdateTeam {
  title: string;
  selectFeatures: [];
  accessType: string;
}

const defaultValues = {
  title: '',
  selectFeatures: [],
  accessType: '',
};

const updateRoleSchema = z.object({
  title: z.string().min(1, 'Enter the title.'),
  accessType: z.string().min(1, 'Select the access type.'),
  selectFeatures: z.array(z.string()).min(1, 'Select at least one feature'),
});

type TCreateRole = z.infer<typeof updateRoleSchema>;

type IUpdateRole = {
  onNext: () => void;
};

export default function UpdateRole({ onNext }: IUpdateRole) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSuccessfullCardShow, setIsSuccessfullCardShow] = useState<boolean>(false);

  const form = useForm<TCreateRole>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;

  //   console.log(selectedFeatures);
  const onSubmit = async (data: TCreateRole) => {
    console.log(data);
    // onNext();
    setIsSuccessfullCardShow(true);
  };

  const onResetComp = () => {
    setTimeout(() => {
      setIsSuccessfullCardShow(false);
    }, 100);
  };

  return (
    <section>
      {isSuccessfullCardShow ? (
        <SuccessfulCard onClosed={onResetComp} heading={'Role Updated'} desc={'ksdhfisdhfids'} />
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <ReHeading heading="Edit Role" size={'2xl'} className="mb-5" />
                <div>
                  <ReHeading heading="Title" size={'base'} />
                  <ReInput name="title" />
                </div>
                <div>
                  <ReHeading heading="Select Features" size={'base'} className="mb-2" />
                  <FormField
                    name="selectFeatures"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            {features.map((feature) => (
                              <div
                                key={feature.id}
                                className=" flex items-center space-x-2 space-y-1"
                              >
                                <Checkbox
                                  id={feature.id}
                                  className="rounded-full text-[#1F7EAD]"
                                  onCheckedChange={(checked) => {
                                    const currentFeatures = form.getValues('selectFeatures');
                                    if (checked) {
                                      form.setValue('selectFeatures', [
                                        ...currentFeatures,
                                        feature.id,
                                      ]);
                                    } else {
                                      form.setValue(
                                        'selectFeatures',
                                        currentFeatures.filter((id) => id !== feature.id)
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor={feature.id}>{feature.label}</Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage className="text-base font-normal text-primary-800" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <ReHeading heading="Access Type" size={'base'} className="mb-2 mt-3" />
                  <ReSelect
                    name="accessType"
                    options={[
                      { label: 'View Only Access', value: 'View Only Access' },
                      { label: 'View & Edit Access', value: 'View & Edit Access' },
                    ]}
                  />
                </div>

                <div className=" flex items-end justify-end">
                  <ReButton
                    isSubmitting={isSubmitting}
                    className="mt-3 w-fit bg-[#1F7EAD] text-white hover:bg-[#1F7EAD]"
                    type="submit"
                  >
                    Save Role
                  </ReButton>
                </div>
              </div>
            </form>
          </Form>
        </div>
      )}
    </section>
  );
}
