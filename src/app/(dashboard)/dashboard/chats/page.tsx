import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import Chats from '@/components/view/dashboard/Chats';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Chats />
    </Suspense>
  );
}
