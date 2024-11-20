import { Bell, Settings } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border-slate-300 bg-white p-4 shadow-md">
        <div>
          <span className="font-inter text-xl font-semibold">Hi Pual</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative inline-block cursor-pointer">
            <Bell
              className="size-6  text-gray-600 transition-colors hover:text-gray-800"
              aria-label="Notifications"
            />
          </div>
          <Settings className="size-6 cursor-pointer  text-gray-600 transition-colors hover:text-gray-800" />
        </div>
      </div>{' '}
    </>
  );
}
