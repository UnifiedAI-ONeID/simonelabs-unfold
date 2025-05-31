import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  nextSession: Date;
}

const StudyGroup = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'React Study Group',
      topic: 'Frontend Development',
      members: 8,
      nextSession: new Date(Date.now() + 86400000)
    },
    {
      id: '2',
      name: 'Machine Learning Basics',
      topic: 'AI/ML',
      members: 12,
      nextSession: new Date(Date.now() + 172800000)
    }
  ]);

  const { toast } = useToast();

  const joinGroup = (groupId: string) => {
    toast({
      title: "Joined Study Group",
      description: "You've successfully joined the group!",
    });
  };

  const createGroup = () => {
    toast({
      title: "Create Study Group",
      description: "Opening group creation form...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Study Groups
          </CardTitle>
          <Button onClick={createGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input placeholder="Search study groups..." />
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{group.name}</h3>
                    <Badge variant="secondary">{group.topic}</Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Next: {group.nextSession.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => joinGroup(group.id)}>
                    Join Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyGroup;