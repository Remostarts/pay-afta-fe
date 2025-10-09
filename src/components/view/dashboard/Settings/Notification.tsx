'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';
import { useChats } from '@/context/ChatListProvider';
import { useGeneral } from '@/context/generalProvider';

export default function Notification() {
  const { session } = useChats();
  const { loadUserData, user } = useGeneral();

  // ✅ Toggle state
  const [enableTextNotification, setEnableTextNotification] = useState(false);
  const [enableEmailNotification, setEnableEmailNotification] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔄 Sync state with user data
  useEffect(() => {
    if (user) {
      setEnableTextNotification(user.textNotification ?? false);
      setEnableEmailNotification(user.emailNotification ?? false);
    }
  }, [user]);

  // 🧩 Handlers
  const handleTextToggle = () => setEnableTextNotification((prev) => !prev);
  const handleEmailToggle = () => setEnableEmailNotification((prev) => !prev);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        textNotification: enableTextNotification,
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
      <h3 className="mb-2 text-xl font-semibold">Notifications</h3>
      <p className="mb-6 text-gray-500">
        Manage how you receive updates about messages and account activity
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-md bg-[#F8F8F8] p-4">
          <span>Text Notifications</span>
          <ReToggle checked={enableTextNotification} onChange={handleTextToggle} />
        </div>

        <div className="flex items-center justify-between rounded-md bg-[#F8F8F8] p-4">
          <span>Email Notifications</span>
          <ReToggle checked={enableEmailNotification} onChange={handleEmailToggle} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !user}
          className="hover:bg-primary/90 hover:border"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
