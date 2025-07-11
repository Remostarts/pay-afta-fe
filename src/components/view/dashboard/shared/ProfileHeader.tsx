import { Bell, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useGeneral } from '@/context/generalProvider';

export default function ProfileHeader() {
  const { user } = useGeneral();
  const router = useRouter();

  const handleNavigateToSettings = () => router.push('/dashboard/settings');
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border-slate-300 bg-white p-4 shadow">
        <div>
          <span className="font-inter text-xl font-semibold">Hi {user?.firstName}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block cursor-pointer">
            <Bell
              className="size-6  text-gray-600 transition-colors hover:text-gray-800"
              aria-label="Notifications"
            />
          </div>
          <Settings
            onClick={handleNavigateToSettings}
            className="size-6 cursor-pointer  text-gray-600 transition-colors hover:text-gray-800"
          />
        </div>
      </div>{' '}
    </>
  );
}
