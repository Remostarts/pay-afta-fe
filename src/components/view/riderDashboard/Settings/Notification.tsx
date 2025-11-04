'use client';

import { useEffect, useState } from 'react';

import { ReCheckBox } from '@/components/re-ui/re-checkbox/ReCheckBox';
import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';
import { useChats } from '@/context/ChatListProvider';
import { useGeneral } from '@/context/generalProvider';
import { toast } from 'sonner';
import { ReButton } from '@/components/re-ui/ReButton';

export default function Notification() {
  const [enableNotification, setEnableNotification] = useState(false);
  const [enableSMS, setEnableSMS] = useState(false);
  const [enableEmailNotification, setEnableEmailNotification] = useState(false);
  const [saving, setSaving] = useState(false);

  const { session } = useChats();
  const { loadUserData, user } = useGeneral();

  // 🔄 Sync state with user data
  useEffect(() => {
    if (user) {
      setEnableNotification(user.textNotification ?? false);
      setEnableEmailNotification(user.emailNotification ?? false);
    }
  }, [user]);

  // 🧩 Handlers
  const handleNotificationToggle = () => setEnableNotification((prev) => !prev);
  // const handleSMSToggle = () => setEnableSMS((prev) => !prev);
  const handleEmailToggle = () => setEnableEmailNotification((prev) => !prev);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        textNotification: enableNotification,
        emailNotification: enableEmailNotification,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-user-profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: session?.accessToken as string,
          },
          body: JSON.stringify(payload),
          cache: 'no-store',
        }
      );

      const data = await response.json();

      if (data?.success) {
        toast.success(data.message);
        loadUserData();
      } else {
        toast.error(data?.errorName || 'Failed to update notification settings');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl rounded-lg border bg-white p-8">
      <h3 className="mb-2 text-xl font-semibold">Messages</h3>
      <p className="mb-6 text-gray-500">
        These are notifications for messages from your delivery updates
      </p>
      <div className=" p-8">
        <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-2 md:p-4">
          <span>Enable push notifications</span>
          <ReToggle checked={enableNotification} onChange={handleNotificationToggle} />
        </div>
        {/* <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-2 md:p-4">
          <span>Enable SMS notifications</span>
          <ReCheckBox isChecked={enableSMS} handleCheckboxChange={handleSMSToggle} id="1" label="Enable SMS notifications" />
          <ReToggle checked={enableSMS} onChange={handleSMSToggle} />
        </div> */}
        <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-2 md:p-4">
          <span>Enable Email notifications</span>
          <ReToggle checked={enableEmailNotification} onChange={handleEmailToggle} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <ReButton
          onClick={handleSave}
          disabled={saving || !user}
          className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
          type="submit"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </ReButton>
      </div>
    </div>
  );
}
