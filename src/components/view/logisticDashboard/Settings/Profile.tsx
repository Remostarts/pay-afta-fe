'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { useState } from 'react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { changePassword } from '@/lib/actions/auth/signup.actions';
import {
  changePasswordSchema,
  profileInformationSchema,
  TChangePassInputs,
  TProfileInformation,
  TProfileUpdate,
} from '@/lib/validations/setting.validation';
import { useGeneral } from '@/context/generalProvider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReCheckBox } from '@/components/re-ui/re-checkbox/ReCheckBox';
import { ReSwitch } from '@/components/re-ui/ReSwitch';
import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/;

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function Profile() {
  const { user, loadUserData } = useGeneral();
  const changePasswordForm = useForm<TChangePassInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const defaultValuesOfprofileInformation = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dateOfBirth: user?.profile?.dateOfBirth || '',
    gender: user?.profile?.gender || '',
  };

  const profileInformationForm = useForm<TProfileInformation>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: defaultValuesOfprofileInformation,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = changePasswordForm;

  const { isSubmitting } = formState;

  const {
    handleSubmit: handleProfileSubmit,
    formState: profileFormState,
    register: profileFormRegister,
  } = profileInformationForm;
  const { isSubmitting: profileIsSubmitting } = profileFormState;

  // Availability state
  const [availability, setAvailability] = useState(false);
  const [activeDay, setActiveDay] = useState('Mon');
  const days = ['Mon', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // profile info submitHandler
  const handleProfileSubmitForm = async (data: TProfileInformation) => {
    console.log(data);
  };

  function handleAvailabilityToggle() {
    setAvailability(!availability);
  }

  return (
    <div className="rounded-lg bg-white p-3">
      {/* Profile Information */}
      <div className="relative grid md:grid-cols-12">
        <ReHeading
          heading="Profile Information"
          className="mb-4 self-start text-xl font-semibold md:col-span-3"
        />
        <div className="mb-10 w-full rounded-xl border bg-white p-4 md:col-span-9 md:grid-rows-3 md:p-8">
          <form>
            <div className="mb-4">
              <ReInput
                name="businessName"
                label="Business Name"
                placeholder="Nipost EMS"
                readonly={true}
              />
            </div>
            <div className="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div className="w-full">
                <ReInput
                  name="phone"
                  label="Phone Number"
                  placeholder="+234 888 122 33"
                  readonly={true}
                />
              </div>
              <div className="w-full">
                <ReInput
                  name="email"
                  label="Email Address"
                  placeholder="fullname@example.com"
                  readonly={true}
                />
              </div>
            </div>
            <ReButton
              className="mx-auto block w-full max-w-xs rounded-full bg-gray-400 text-lg text-white"
              type="button"
              disabled
            >
              Save Changes
            </ReButton>
          </form>
        </div>
      </div>

      {/* Service Zones */}
      <div className="relative grid md:grid-cols-12">
        <ReHeading
          heading="Service Zones"
          className="mb-4 self-start text-xl font-semibold md:col-span-3"
        />
        <div className="mb-10 w-full rounded-xl border bg-white p-4 md:col-span-9 md:grid-rows-3 md:p-8">
          <div className="mb-4">
            <ReHeading heading="Add City / Region" size="base" />
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="select" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {['Lekki', 'Ajah', 'Ikorodu', 'Yaba', 'Ikeja'].map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {['Lekki', 'Ajah', 'Ikorodu'].map((zone) => (
              <span key={zone} className="flex items-center rounded bg-gray-100 px-2 py-1 text-sm">
                {zone}
                <button type="button" className="ml-1 text-gray-500 hover:text-red-500" disabled>
                  ×
                </button>
              </span>
            ))}
          </div>
          <ReButton
            className="mx-auto block w-full max-w-xs rounded-full bg-gray-400 text-lg text-white"
            disabled
          >
            Save Changes
          </ReButton>
        </div>
      </div>

      {/* Availability */}

      <div className="relative grid sm:grid-cols-1 md:grid-cols-12">
        <ReHeading
          heading="Availability"
          className="mb-4 self-start text-xl font-semibold sm:col-span-1 md:col-span-3"
        />
        <div className="mb-10 w-full rounded-xl border bg-white p-4 sm:p-4 md:col-span-9 md:grid-rows-3 md:p-8">
          <div className="mb-4 flex flex-col gap-4 sm:items-start md:flex-row md:items-center">
            <span className="font-medium">Availability Toggle</span>
            {/* <ReSwitch name="availabilityToggle" className="text-green-600" /> */}
            <ReToggle checked={availability} onChange={handleAvailabilityToggle} />
            <span className="ml-2 font-medium text-green-600">{availability}</span>
          </div>
          <div className="mb-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {['Mon', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                (day, idx) => (
                  <button
                    key={day}
                    type="button"
                    // className={`rounded px-3 py-1 text-sm ${idx === 0 ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                    className={`rounded-none border-b-2 px-3 py-2 text-sm ${activeDay === day ? 'border-[#03045B] text-[#03045B]' : 'border-transparent text-gray-700'}`}
                    onClick={() => setActiveDay(day)}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
            <div className="flex flex-col gap-4 sm:gap-4 md:flex-row md:items-center md:gap-8">
              <div>
                <ReHeading heading="From" size="base" />
                <ReInput type="time" name="fromTime" />
              </div>
              <div>
                <ReHeading heading="To" size="base" />
                <ReInput type="time" name="toTime" />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:items-start md:flex-row md:items-center">
              <ReCheckBox
                handleCheckboxChange={() => {}}
                id="1"
                isChecked={true}
                label=" Repeat this for all the days of the week"
              />
            </div>
          </div>
          <ReButton
            className="mx-auto block w-full max-w-xs rounded-full bg-gray-400 text-lg text-white"
            disabled
          >
            Save Changes
          </ReButton>
        </div>
      </div>
    </div>
  );
}
