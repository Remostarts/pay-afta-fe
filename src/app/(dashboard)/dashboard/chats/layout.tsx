import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export default layout;
