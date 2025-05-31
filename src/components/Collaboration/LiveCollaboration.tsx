import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, MessageSquare, Video } from "lucide-react";

const LiveCollaboration = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, newMessage]);
    setNewMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Live Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className="mb-2 p-2 bg-background rounded">
                  {msg}
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
              <Button onClick={sendMessage}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
            <Button>
              <Video className="h-4 w-4 mr-2" />
              Start Video Call
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCollaboration;