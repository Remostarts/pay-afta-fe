import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="grid size-full min-h-screen place-content-center place-items-center">
      <span className="flex items-center justify-center space-x-2">
        <Loader className="size-5 animate-spin" />
        <span className="animate-pulse">Loading...</span>
      </span>
    </div>
  );
}
