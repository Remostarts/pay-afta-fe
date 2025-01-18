import React from 'react';

import ChatList from '@/components/view/dashboard/Chats/ChatList';
import ChatUI from '@/components/view/dashboard/Chats/ChatUi';

const ChatPageByID = () => {
  return (
    <div className="flex size-full rounded-lg border sm:h-screen md:h-[calc(100vh-180px)]">
      <ChatList />
      <ChatUI />
    </div>
  );
};

export default ChatPageByID;
