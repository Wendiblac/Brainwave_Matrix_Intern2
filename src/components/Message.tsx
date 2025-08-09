import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageProps {
  message: {
    id: string;
    text: string;
    uid: string;
    displayName: string;
    photoURL?: string;
    timestamp: Date;
  };
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex gap-3 p-4 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={message.photoURL || ''} />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
          {message.displayName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col max-w-xs sm:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium text-muted-foreground ${isCurrentUser ? 'order-2' : 'order-1'}`}>
            {message.displayName}
          </span>
          <span className={`text-xs text-muted-foreground ${isCurrentUser ? 'order-1' : 'order-2'}`}>
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>

        <div
          className={`px-4 py-2 rounded-2xl max-w-full break-words ${
            isCurrentUser
              ? 'bg-chat-bubble-sent text-white rounded-br-md'
              : 'bg-chat-bubble-received text-foreground rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;