'use client';

import { useState } from 'react';

import { ReCheckBox } from '@/components/re-ui/re-checkbox/ReCheckBox';
import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';

export default function Notification() {
  const [enableNotification, setEnableNotification] = useState(false);
  const [enableSMS, setEnableSMS] = useState(false);
  const [enableEmailNotification, setEnableEmailNotification] = useState(false);

  function handleCheckNotification() {
    setEnableNotification(!enableNotification);
  }

  function handleEnableSMS() {
    setEnableSMS(!enableSMS);
  }

  function handleEnableEmailNotification() {
    setEnableEmailNotification(!enableEmailNotification);
  }

  return (
    <div className="max-w-xl rounded-lg border bg-white p-8">
      <h3 className="mb-2 text-xl font-semibold">Messages</h3>
      <p className="mb-6 text-gray-500">
        These are notifications for messages from your delivery updates
      </p>
      <div className=" p-8">
        <div className="mb-4 flex items-center justify-between">
          <span>Enable push notifications</span>
          <ReToggle checked={enableNotification} onChange={handleCheckNotification} />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <span>Enable SMS notifications</span>
          {/* <input type="checkbox" checked readOnly className="size-5 accent-green-500" /> */}
          <ReToggle checked={enableSMS} onChange={handleEnableSMS} />
        </div>
        <div className="flex items-center justify-between">
          <span>Enable Email notifications</span>
          <ReToggle checked={enableEmailNotification} onChange={handleEnableEmailNotification} />
        </div>
      </div>
    </div>
  );
}
