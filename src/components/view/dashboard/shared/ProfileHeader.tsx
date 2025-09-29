import { Bell, BellDot, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useGeneral } from '@/context/generalProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationsPanel from './Notification';

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
            <Popover>
              <PopoverTrigger asChild>
                <BellDot
                  className="size-6  text-gray-600 transition-colors hover:text-gray-800"
                  aria-label="Notifications"
                />
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white">
                <div className="grid gap-4">
                  <NotificationsPanel />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Settings
            onClick={handleNavigateToSettings}
            className="size-6 cursor-pointer  text-gray-600 transition-colors hover:text-gray-800"
            aria-label="Setting"
          />
        </div>
      </div>
    </>
  );
}
