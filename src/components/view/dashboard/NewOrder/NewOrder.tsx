'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, CirclePlus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';

import { Form } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import {
  newOrderSchema,
  TCreateOrderInput,
  TNewOrder,
} from '@/lib/validations/newOrder.validation';
import { createOrder } from '@/lib/actions/order/order.actions';
import { SearchableSelect } from '@/components/re-ui/SearchableSelect';
import { useGeneral } from '@/context/generalProvider';
import { SearchableCounterpartySelect } from '@/components/re-ui/SearchableCounterpartySelect';

type defaultVal = {
  transactionType: string;
  buyerEmailPhoneNo: string;
  sellerEmailPhoneNo: string;
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
  milestone1DeliveryDate: Date;
  milestone1Amount: string;
  milestone2: string;
  milestone2DeliveryDate: Date;
  milestone2Amount: string;
  milestone3: string;
  milestone3DeliveryDate: Date;
  milestone3Amount: string;
  transactionFee: string;
};

const defaultValues: defaultVal = {
  transactionType: '',
  buyerEmailPhoneNo: '',
  sellerEmailPhoneNo: '',
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
  milestone1DeliveryDate: new Date(),
  milestone1Amount: '',
  milestone2: '',
  milestone2DeliveryDate: new Date(),
  milestone2Amount: '',
  milestone3: '',
  milestone3DeliveryDate: new Date(),
  milestone3Amount: '',
  transactionFee: '',
};

export default function NewOrder({ onBack }: any) {
  const { user } = useGeneral();
  const [initiatorRole, setInitiatorRole] = useState('Buyer');

  const [isItem2Show, setIsItem2Show] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<string>('');
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
  const [isMilestone2Show, setIsMilestone2Show] = useState<boolean>(false);
  const [isMilestone3Show, setIsMilestone3Show] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<TNewOrder>({
    resolver: zodResolver(
      newOrderSchema().refine(
        (data) => {
          if (initiatorRole === 'Buyer') {
            return !!data.sellerEmailPhoneNo;
          } else {
            return !!data.buyerEmailPhoneNo;
          }
        },
        {
          message: 'Please select a counterparty',
          path: ['counterparty'],
        }
      )
    ),
    defaultValues,
    mode: 'onChange',
    context: { paymentType, initiatorRole },
    reValidateMode: 'onChange',
  });

  const { formState, handleSubmit, register, reset, watch, setValue } = form;
  const { isValid, isSubmitting, errors } = formState;

  // Handle tab change
  const handleRoleChange = (value: string) => {
    setInitiatorRole(value);
    if (value === 'Buyer') {
      // initiator if buyer
      setValue('buyerEmailPhoneNo', user?.email || '');
      setValue('sellerEmailPhoneNo', ''); // reset seller
    } else if (value === 'Seller') {
      // initiator if seller
      setValue('sellerEmailPhoneNo', user?.email || '');
      setValue('buyerEmailPhoneNo', ''); // reset buyer
    }
  };

  function handleClickGetItem2() {
    setIsItem2Show(true);
  }

  function handleClickRemoveItem2() {
    setIsItem2Show(false);
  }

  function handleClickGetMilestone2() {
    setIsMilestone2Show(true);
  }

  function handleClickGetMilestone3() {
    setIsMilestone3Show(true);
  }

  function handleClickRemoveMilestone2() {
    setIsMilestone2Show(false);
  }

  function handleClickRemoveMilestone3() {
    setIsMilestone3Show(false);
  }

  function handleChangePaymentType(e: string) {
    setPaymentType(e);
  }

  async function onSubmit(data: TNewOrder) {
    // console.log(data);
    // Process items: extract only non-empty items
    const items = [];
    if (data.item1Name && data.item1Name.trim() !== '') {
      items.push({
        name: data.item1Name,
        price: data.item1Prize || '',
        quantity: data.item1Quantity || '',
      });
    }
    if (data.item2Name && data.item2Name.trim() !== '') {
      items.push({
        name: data.item2Name,
        price: data.item2Prize || '',
        quantity: data.item2Quantity || '',
      });
    }

    // Convert the order delivery date into ISO string format
    const formattedDeliveryDate = data.deliveryDate;

    // Process milestones depending on payment type
    const milestones = [];
    if (data.paymentType === 'Milestone Payment') {
      // For milestone payment, include milestones that have a non-empty title.
      if (data.milestone1 && data.milestone1.trim() !== '') {
        milestones.push({
          title: data.milestone1,
          amount: data.milestone1Amount || '0',
          deliveryDate: data.milestone1DeliveryDate,
        });
      }
      if (data.milestone2 && data.milestone2.trim() !== '') {
        milestones.push({
          title: data.milestone2,
          amount: data.milestone2Amount || '0',
          deliveryDate: data.milestone2DeliveryDate,
        });
      }
      if (data.milestone3 && data.milestone3.trim() !== '') {
        milestones.push({
          title: data.milestone3,
          amount: data.milestone3Amount || '0',
          deliveryDate: data.milestone3DeliveryDate,
        });
      }

      // If no valid milestone is provided, create a dummy milestone
      if (milestones.length === 0) {
        milestones.push({
          title: 'Default Milestone',
          amount: items.reduce((total, item) => total + Number(item.price || 0), 0).toString(),
          deliveryDate: formattedDeliveryDate,
        });
      }
    } else if (data.paymentType === 'One time Payment') {
      // For one-time payment, ignore provided milestone fields and create a dummy milestone.
      milestones.push({
        title: 'Full Payment',
        amount: items.reduce((total, item) => total + Number(item.price || 0), 0).toString(),
        deliveryDate: formattedDeliveryDate,
      });
    }

    // Build the final data object in the expected format
    const processedData = {
      buyerEmailPhoneNo: data.buyerEmailPhoneNo,
      sellerEmailPhoneNo: data.sellerEmailPhoneNo,
      deliveryDate: formattedDeliveryDate,
      detailAboutItem: data.detailAboutItem,
      paymentType: data.paymentType,
      transactionFee: data.transactionFee,
      transactionType: data.transactionType,
      items,
      milestones,
    };
    console.log('🌼 🔥🔥 onSubmit 🔥🔥 processedData🌼', processedData);

    try {
      const response = await createOrder(processedData as TCreateOrderInput);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);
      if (response.success) {
        toast.success('Order created successfully');
        reset();
      } else {
        toast.error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order', error);
      toast.error(error?.message || 'Something went wrong, please try again.');
    }
  }

  return (
    <div className="min-h-full rounded-xl bg-white">
      <div className="p-5">
        <button
          // onClick={onBack}
          className="mb-6 flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900"
        >
          <Link href="/dashboard" className="flex items-center justify-center">
            <ChevronLeft className="size-5" />
            <span className="text-lg">Create Escrow Order</span>
          </Link>
        </button>

        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-6">
                <div className="w-full">
                  <ReHeading heading="Role" size={'base'} className="text-gray-700 mb-2" />
                  <ReSelect
                    name="role"
                    options={[
                      { label: 'Buyer', value: 'Buyer' },
                      { label: 'Seller', value: 'Seller' },
                    ]}
                    placeholder="Select"
                    onChange={handleRoleChange}
                  />
                </div>

                {/* Transaction Type */}
                <div className="w-full">
                  <ReHeading
                    heading="Transaction Type"
                    size={'base'}
                    className="text-gray-700 mb-2"
                  />
                  <ReSelect
                    name="transactionType"
                    options={[
                      { label: 'Product', value: 'Product' },
                      { label: 'Services', value: 'Services' },
                    ]}
                    placeholder="Select"
                  />
                </div>
              </div>

              {/* Counterparty Search */}
              <div className="mt-2 mb-2">
                <ReHeading
                  heading="Counterparty Search"
                  size={'base'}
                  className="text-gray-700 mb-1"
                />
                {/* <SearchableSelect
                  type="counterparty"
                  loading={false}
                  placeholder="Search or add counterparty"
                  options={[
                    { name: 'Alice Johnson', email: 'alice@email.com' },
                    { name: 'Bob Smith', email: 'bob@email.com' },
                    { name: 'Charlie Lee', email: 'charlie@email.com' },
                  ]}
                  onChange={(email) => {
                    if (initiatorRole === 'Buyer')
                      setValue('sellerEmailPhoneNo', email, { shouldValidate: true });
                    else setValue('buyerEmailPhoneNo', email, { shouldValidate: true });
                  }}
                /> */}
                <SearchableCounterpartySelect
                  onChange={(email) => {
                    if (initiatorRole === 'Buyer') setValue('sellerEmailPhoneNo', email);
                    else setValue('buyerEmailPhoneNo', email);
                  }}
                />
              </div>

              <div>
                <ReHeading heading="Item 1" size={'base'} className="text-gray-700" />
                <ReInput name="item1Name" placeholder="Enter Name" />
                <div className="grid lg:grid-cols-2 lg:gap-5">
                  <ReInput name="item1Quantity" placeholder="Enter Quantity" />
                  <ReInput name="item1Prize" placeholder="₦ 00.00" />
                </div>
                {/*  Container with flex and justify-end */}
                <div className="flex justify-end w-full">
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                    onClick={handleClickGetItem2}
                  >
                    <CirclePlus />
                    <span className="font-inter">Add more</span>
                  </button>
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
                  <div className="flex justify-start w-full">
                    <button
                      type="button"
                      className="flex items-center gap-2 hover:bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                      onClick={handleClickRemoveItem2}
                    >
                      <Trash2 color="#d73737" />
                      <span className="font-inter text-[#d73737]">Delete</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-5">
                <ReHeading
                  heading="Give me more details about the expected Item"
                  size={'base'}
                  className="text-gray-700"
                />
                <ReTextarea
                  name="detailAboutItem"
                  className="font-inter outline-none focus-visible:ring-0 focus-visible:outline-none"
                />
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
                {/* )} */}
              </div>
              {paymentType === 'One time Payment' ? (
                <div className="mt-5">
                  <ReHeading
                    heading="Select Delivery Date"
                    size={'base'}
                    className="text-gray-700"
                  />
                  <ReDatePicker name="deliveryDate" className="lg:w-2/5" disablePast={true} />
                </div>
              ) : (
                <>
                  {paymentType === 'Milestone Payment' && (
                    <div className="mt-5">
                      <div>
                        <ReHeading heading="Milestone 1" size={'base'} className="text-gray-700" />
                        <ReInput
                          name="milestone1"
                          placeholder="Describe deliverable"
                          className="w-full"
                        />

                        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 sm:gap-5 items-center">
                          <ReDatePicker
                            name="milestone1DeliveryDate"
                            placeholder="Select delivery date"
                            disablePast={true}
                            className="w-full"
                          />
                          <ReInput
                            name="milestone1Amount"
                            placeholder="₦ 00.00"
                            className="w-full"
                            type="number"
                            inputMode="numeric"
                          />
                        </div>

                        <div className="flex justify-end w-full mt-4">
                          <button
                            type="button"
                            className="flex items-center gap-2 hover:bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                            onClick={handleClickGetMilestone2}
                          >
                            <CirclePlus />
                            <span className="font-inter">Add more</span>
                          </button>
                        </div>
                      </div>
                      {isMilestone2Show && (
                        <div>
                          <ReHeading
                            heading="Milestone 2"
                            size={'base'}
                            className="text-gray-700"
                          />
                          <ReInput name="milestone2" placeholder="Describe deliverable" />
                          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 sm:gap-5 items-center">
                            <ReDatePicker
                              name="milestone2DeliveryDate"
                              placeholder="Select delivery date"
                              disablePast={true}
                              className="w-full"
                            />
                            <ReInput
                              name="milestone2Amount"
                              placeholder="₦ 00.00"
                              className="w-full"
                              type="number"
                              inputMode="numeric"
                            />
                          </div>
                          <div className="flex justify-end w-full">
                            <button
                              type="button"
                              className="flex items-center gap-2 hover:bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                              onClick={handleClickGetMilestone3}
                            >
                              <CirclePlus onClick={handleClickGetMilestone3} />
                              <span className="font-inter">Add more</span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-2 hover:bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                              onClick={handleClickRemoveMilestone2}
                            >
                              <Trash2 color="#d73737" />
                              <span className="font-inter text-[#d73737]">Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {isMilestone3Show && (
                        <div>
                          <ReHeading
                            heading="Milestone 3"
                            size={'base'}
                            className="text-gray-700"
                          />
                          <ReInput name="milestone3" placeholder="Describe deliverable" />
                          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 sm:gap-5 items-center">
                            <ReDatePicker
                              name="milestone3DeliveryDate"
                              placeholder="Select delivery date"
                              disablePast={true}
                              className="w-full"
                            />
                            <ReInput
                              name="milestone3Amount"
                              placeholder="₦ 00.00"
                              className="w-full"
                              inputMode="numeric"
                              type="number"
                            />
                          </div>
                          <div className="flex justify-start w-full">
                            <button
                              type="button"
                              className="flex items-center gap-2 hover:bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                              onClick={handleClickRemoveMilestone3}
                            >
                              <Trash2 color="#d73737" onClick={handleClickRemoveMilestone3} />
                              <span className="font-inter text-[#d73737]">Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
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
                />
              </div>
              <div className="mt-5 flex items-center justify-center">
                <ReButton
                  className="mt-3 w-[70%] rounded-full p-5 font-inter md:w-[30%] "
                  type="submit"
                  isSubmitting={isSubmitting || loading}
                >
                  Create Order
                </ReButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
