'use client';

import { useForm } from 'react-hook-form';
import { CirclePlus, Trash2 } from 'lucide-react';
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
import { paymentSellerSchema, TPaymentSeller } from '@/lib/validations/newOrder.validation';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';

type defaultVal = {
  transactionType: string;
  sellerEmailPhoneNo: string;
  sellerEmail: string;
  sellerPhoneNo: string;
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
  sellerEmailPhoneNo: '',
  sellerEmail: '',
  sellerPhoneNo: '',
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
  const form = useForm<TPaymentSeller>({
    resolver: zodResolver(paymentSellerSchema),
    defaultValues,
    mode: 'onChange',
    context: { paymentType },
  });

  const { formState, handleSubmit } = form;
  const { isValid, isSubmitting } = formState;

  function handleClickGetItem2() {
    setIsItem2Show(true);
  }

  function handleClickRemoveItem2() {
    setIsItem2Show(false);
  }

  function handleChangePaymentType(e: string) {
    setPaymentType(e);
  }

  async function onSubmit(data: TPaymentSeller) {
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
                heading="Seller email or phone number "
                size={'base'}
                className=" text-gray-700"
              />
              <ReInput name="sellerEmailPhoneNo" />
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <ReHeading heading="Seller Email adderss" size={'base'} className=" text-gray-700" />
              <ReInput name="sellerEmail" />
            </div>
            <div>
              <RePhoneNumberInput name="sellerPhoneNo" />
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
            >
              Create Order
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
