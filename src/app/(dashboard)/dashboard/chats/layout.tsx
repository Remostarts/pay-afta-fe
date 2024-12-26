import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return <div className="flex size-full max-h-[calc(100vh-140px)] w-full">{children}</div>;
}

export default layout;