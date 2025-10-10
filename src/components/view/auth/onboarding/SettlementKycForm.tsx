'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { nigeriaBanks } from '@/lib/data/nigeriaBanks';
import { TSettlementKyc, settlementKycSchema } from '@/lib/validations/onboarding.validation';
import { kycBankInfo } from '@/lib/actions/onboarding/onboarding.actions';
import { useGeneral } from '@/context/generalProvider';

type defaultVal = {
  bankName: string;
  accountNumber: string;
  bvn: string;
  isDefaultPayout: boolean;
};

const defaultValues: defaultVal = {
  bankName: '',
  accountNumber: '',
  bvn: '',
  isDefaultPayout: false,
};

export default function SettlementKycForm() {
  const form = useForm<TSettlementKyc>({
    resolver: zodResolver(settlementKycSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, control } = form;
  const { isSubmitting } = formState;
  const { loadUserData } = useGeneral();

  async function onSubmit(data: TSettlementKyc) {
    console.log(data);
    try {
      const response = await kycBankInfo(data);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        loadUserData();
      } else {
        toast.error(response?.errorMessages[0]?.message || 'Failed to update personal information');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update kyc bank information');
    }
  }

  return (
    <section>
      <h1 className="mb-7 font-inter text-2xl font-bold text-zinc-800">Settlement KYC</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Select your bank name" size={'base'} />
            <FormField
              control={control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="max-h-[300px] bg-white"
                      position="popper"
                      sideOffset={5}
                    >
                      <div className="overflow-y-auto max-h-[280px]">
                        {nigeriaBanks.map((bank) => (
                          <SelectItem
                            key={bank.value}
                            value={bank.value}
                            className="cursor-pointer"
                          >
                            {bank.label}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-base font-normal text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-5">
            <ReHeading heading="Enter 10 digit account number" size={'base'} />
            <ReInput name="accountNumber" type="number" />
          </div>
          <div className="mt-5">
            <ReHeading heading="BVN (Bank Verification Number)" size={'base'} />
            <ReInput name="bvn" type="number" placeholder="00000000000" />
          </div>
          <div className="mt-5 flex items-center font-inter">
            <input
              type="checkbox"
              name="isDefaultPayout"
              onChange={(e) => form.setValue('isDefaultPayout', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">
              Set this account as my default payout method
            </span>
          </div>
          <div className="mt-3 flex justify-end">
            <ReButton
              className="w-2/5 rounded-full bg-[#03045B] py-6 font-inter text-white sm:py-4"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Submit
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
