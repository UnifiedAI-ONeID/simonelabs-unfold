import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  nextSession: string;
}

const StudyGroup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const mockGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'React Study Circle',
      topic: 'Web Development',
      members: 12,
      nextSession: '2024-03-25 15:00'
    },
    {
      id: '2',
      name: 'Data Science Group',
      topic: 'Machine Learning',
      members: 8,
      nextSession: '2024-03-26 18:00'
    },
    {
      id: '3',
      name: 'UX Design Workshop',
      topic: 'Design',
      members: 15,
      nextSession: '2024-03-27 14:00'
    }
  ];

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const joinGroup = (groupId: string) => {
    toast({
      title: "Joined Study Group",
      description: "You've successfully joined the study group!",
    });
  };

  const createGroup = () => {
    toast({
      title: "Create New Group",
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
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search study groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {group.topic}
                  </Badge>
                </div>
                <Button onClick={() => joinGroup(group.id)}>Join</Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {group.members} members
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Next: {new Date(group.nextSession).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyGroup;