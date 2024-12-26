import { TChildrenProps } from '@/types';

export default function Layout({ children }: TChildrenProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="px-4 md:mx-auto md:w-1/2 md:pt-16 lg:px-8 xl:px-20">{children}</div>
    </div>
  );
}
