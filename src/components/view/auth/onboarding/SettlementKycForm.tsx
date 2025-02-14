'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';
import { nigeriaBanks } from '@/lib/data/nigeriaBanks';
import { TSettlementKyc, settlementKycSchema } from '@/lib/validations/onboarding.validation';
import { kycBankInfo, kycPersonalInfo } from '@/lib/actions/onboarding/onboarding.actions';

type defaultVal = {
  bankName: string;
  accountNumber: string;
};

const defaultValues: defaultVal = {
  bankName: '',
  accountNumber: '',
};

export default function SettlementKycForm({ manageCurrentStep = () => {} }) {
  const form = useForm<TSettlementKyc>({
    resolver: zodResolver(settlementKycSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isValid, isSubmitting } = formState;

  async function onSubmit(data: TSettlementKyc) {
    console.log(data);
    try {
      const response = await kycBankInfo(data);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        manageCurrentStep();
      } else {
        toast.error(response?.error || 'Failed to update kyc bank information');
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
            <ReSelect placeholder="select" name="bankName" options={nigeriaBanks} />
          </div>
          <div>
            <ReHeading heading="Enter 10 digit account number" size={'base'} />
            <ReInput name="accountNumber" type="number" />
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
