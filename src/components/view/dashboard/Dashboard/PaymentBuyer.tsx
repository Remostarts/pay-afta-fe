'use client';

import { useForm } from 'react-hook-form';
import { CirclePlus, Loader, LoaderCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';
import { paymentBuyerSchema, TPaymentBuyer } from '@/lib/validations/newOrder.validation';

type defaultVal = {
  transactionType: string;
  buyerEmailPhoneNo: string;
  buyerEmail: string;
  buyerPhoneNo: string;
  item1Name: string;
  item1Quantity: string;
  item1Prize: string;
  item2Name: string;
  item2Quantity: string;
  item2Prize: string;
  detailAboutItem: string;
  paymentType: string;
  deliveryDate: Date;
  milestone1: string;
  milestoneDeliveryDate: Date;
  milestone1Amount: string;
  transactionFee: string;
};

const defaultValues: defaultVal = {
  transactionType: '',
  buyerEmailPhoneNo: '',
  buyerEmail: '',
  buyerPhoneNo: '',
  item1Name: '',
  item1Quantity: '',
  item1Prize: '',
  item2Name: '',
  item2Quantity: '',
  item2Prize: '',
  detailAboutItem: '',
  paymentType: '',
  deliveryDate: new Date(),
  milestone1: '',
  milestoneDeliveryDate: new Date(),
  milestone1Amount: '',
  transactionFee: '',
};

export default function PaymentBuyer() {
  const [isItem2Show, setIsItem2Show] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<string>('');
  const [isLodingEmail, setIsLoadingEmail] = useState<boolean>(false);
  const [isEmailExist, setIsEmailExist] = useState<boolean>(false);

  const form = useForm<TPaymentBuyer>({
    resolver: zodResolver(paymentBuyerSchema(setIsLoadingEmail, setIsEmailExist)),
    defaultValues,
    mode: 'onChange',
    context: { paymentType },
    reValidateMode: 'onChange',
  });

  const { formState, handleSubmit, register } = form;
  const { isValid, isSubmitting, errors } = formState;

  function handleClickGetItem2() {
    setIsItem2Show(true);
  }

  function handleClickRemoveItem2() {
    setIsItem2Show(false);
  }

  function handleChangePaymentType(e: string) {
    setPaymentType(e);
  }

  async function onSubmit(data: TPaymentBuyer) {
    console.log(data);
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <ReHeading heading="Transaction Type" size={'base'} className=" text-gray-700" />
              <ReSelect
                name="transactionType"
                options={[
                  { label: 'Product', value: 'Product' },
                  { label: 'Services', value: 'Services' },
                ]}
                placeholder="Select"
              />
            </div>
            <div>
              <ReHeading
                heading="Buyer email or phone number "
                size={'base'}
                className=" text-gray-700"
              />
              <input
                {...register('buyerEmailPhoneNo')}
                className="border-input bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 font-spaceGrotesk text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              {isLodingEmail ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : isEmailExist ? (
                <p className="text-base font-normal text-green-500">Email is registered</p>
              ) : errors.buyerEmailPhoneNo ? (
                <p className="text-base font-normal text-red-500">
                  {errors.buyerEmailPhoneNo.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <ReHeading heading="Buyer Email adderss" size={'base'} className=" text-gray-700" />
              <ReInput name="buyerEmail" />
            </div>
            <div>
              <RePhoneNumberInput name="buyerPhoneNo" />
            </div>
          </div>
          <div>
            <ReHeading heading="Item 1" size={'base'} className="text-gray-700" />
            <ReInput name="item1Name" placeholder="Enter Name" />
            <div className="grid lg:grid-cols-2 lg:gap-5">
              <ReInput name="item1Quantity" placeholder="Enter Quantity" />
              <ReInput name="item1Prize" placeholder="₦ 00.00" />
            </div>
            <div className="flex w-full cursor-pointer items-center justify-end gap-2">
              <CirclePlus onClick={handleClickGetItem2} />
              <span className="font-inter">Add more</span>
            </div>
          </div>
          {isItem2Show && (
            <div>
              <ReHeading heading="Item 2" size={'base'} className="text-gray-700" />
              <ReInput name="item2Name" placeholder="Enter Name" />
              <div className="grid lg:grid-cols-2 lg:gap-5">
                <ReInput name="item2Quantity" placeholder="Enter Quantity" />
                <ReInput name="item2Prize" placeholder="₦ 00.00" />
              </div>
              <div className="flex w-full cursor-pointer items-center gap-2">
                <Trash2 color="#d73737" onClick={handleClickRemoveItem2} />
                <span className="font-inter text-[#d73737]">Delete</span>
              </div>
            </div>
          )}
          <div className="mt-5">
            <ReHeading
              heading="Give me more details about the expected Item"
              size={'base'}
              className="text-gray-700"
            />
            <ReTextarea name="detailAboutItem" className="font-inter outline-none" />
          </div>
          <div>
            <ReHeading heading="Payment Type" size={'base'} className="text-gray-700" />
            <ReRadioGroup
              name="paymentType"
              options={[
                {
                  label: 'One time Payment',
                  value: 'One time Payment',
                  radioDescription:
                    'Pay the agreed amount to the seller at once immediately after reaching an agreement.',
                },
                {
                  label: 'Milestone Payment',
                  value: 'Milestone Payment',
                  radioDescription: 'Pay gradually to the seller after reaching an agreement.',
                },
              ]}
              className="flex flex-col lg:grid lg:grid-cols-2"
              onChange={handleChangePaymentType}
            />
          </div>
          {paymentType === 'One time Payment' ? (
            <div className="mt-5">
              <ReHeading heading="Select Delivery Date" size={'base'} className="text-gray-700" />
              <ReDatePicker name="deliveryDate" className="lg:w-2/5" />
            </div>
          ) : (
            <div>
              <ReHeading heading="Milestone 1" size={'base'} className="text-gray-700" />
              <ReInput name="milestone1" placeholder="Describe deliverable" />
              <div className="grid lg:grid-cols-2 lg:gap-5">
                <ReDatePicker name="milestoneDeliveryDate" placeholder="Select delivery date" />
                <ReInput name="milestone1Amount" placeholder="₦ 00.00" />
              </div>
              <div className="flex w-full cursor-pointer items-center justify-end gap-2">
                <CirclePlus />
                <span className="font-inter">Add more</span>
              </div>
            </div>
          )}
          <div className="mt-5">
            <ReHeading heading="Transaction Fee" size={'base'} className="text-gray-700" />
            <ReRadioGroup
              name="transactionFee"
              options={[
                {
                  label: 'I will pay for the transaction',
                  value: 'I will pay for the transaction',
                },
                {
                  label: 'Seller pays for the transaction fee',
                  value: 'Seller pays for the transaction fee',
                },
                {
                  label: 'Both Parties Pay (50/50)',
                  value: 'Both Parties Pay (50/50)',
                },
              ]}
              className="flex flex-initial flex-col lg:grid lg:grid-cols-3"
              // onChange={handleTransactionFee}
            />
          </div>
          <div className="mt-5 flex items-center justify-center">
            <ReButton
              className="mt-3 w-[70%] rounded-full p-5 font-inter md:w-[30%] "
              type="submit"
              isSubmitting={isSubmitting}
              disabled={!isEmailExist}
            >
              Create Order
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
