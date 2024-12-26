import Image from 'next/image';
import React from 'react';

const ChatFallbackContainer = () => {
  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center text-gray-400">
      <Image
        src="/assets/dashboard/Chats/empty-chat.svg"
        alt="empty-chat"
        width={139}
        height={108.14}
      />
      <p>Select/Start a conversation</p>
    </div>
  );
};

export default ChatFallbackContainer;
