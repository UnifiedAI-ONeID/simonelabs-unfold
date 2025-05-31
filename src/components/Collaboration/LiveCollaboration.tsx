import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Video, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

const client = createClient({
  publicApiKey: "pk_dev_123", // Replace with your Liveblocks public key
});

const { RoomProvider, useOthers, useUpdateMyPresence, useStorage } = createRoomContext(client);

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

const CollaborationRoom = ({ roomId }: { roomId: string }) => {
  const { user } = useAuth();
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      userId: user.id,
      userName: user.email?.split('@')[0] || 'Anonymous',
      timestamp: Date.now()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const startVideoCall = () => {
    toast({
      title: "Starting video call",
      description: "Connecting to video session...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Active Users */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {others.length + 1} Active
        </Badge>
        <div className="flex -space-x-2">
          {others.map((other) => (
            <Avatar key={other.connectionId} className="border-2 border-background">
              <AvatarFallback>{other.presence?.name?.[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.userId === user?.id ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback>{message.userName[0]}</AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${
                  message.userId === user?.id ? 'items-end' : ''
                }`}>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.userId === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {message.text}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.userName} • {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={startVideoCall}>
          <Video className="w-4 h-4 mr-2" />
          Start Video Call
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share Screen
        </Button>
      </div>
    </div>
  );
};

const LiveCollaboration = ({ roomId }: { roomId: string }) => {
  return (
    <RoomProvider id={roomId} initialPresence={{ name: '' }}>
      <CollaborationRoom roomId={roomId} />
    </RoomProvider>
  );
};

export default LiveCollaboration;