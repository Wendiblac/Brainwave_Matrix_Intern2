import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface MessageProps {
  message: {
    id: string;
    text: string;
    uid: string;
    displayName: string;
    photoURL?: string;
    timestamp?: any;
  };
  currentUserId: string;
}

const Message = ({ message, currentUserId }: MessageProps) => {
  const isOwnMessage = message.uid === currentUserId;
  const formattedTime = message.timestamp 
    ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })
    : 'Just now';

  return (
    <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.photoURL || undefined} alt={message.displayName} />
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            {message.displayName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">
              {message.displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formattedTime}
            </span>
          </div>
        )}
        
        <div className={`${
          isOwnMessage 
            ? 'message-bubble-sent' 
            : 'message-bubble-received'
        } animate-in slide-in-from-bottom-2 duration-300`}>
          <p className="text-sm leading-relaxed break-words">
            {message.text}
          </p>
        </div>
        
        {isOwnMessage && (
          <span className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;