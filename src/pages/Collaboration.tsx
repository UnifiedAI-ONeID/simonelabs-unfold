import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveCollaboration from "@/components/Collaboration/LiveCollaboration";
import StudyGroup from "@/components/Collaboration/StudyGroup";
import PeerReview from "@/components/Collaboration/PeerReview";

const Collaboration = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Collaboration</h1>
            <p className="text-muted-foreground">
              Work together with peers and learn from each other
            </p>
          </div>

          <Tabs defaultValue="live" className="space-y-6">
            <TabsList>
              <TabsTrigger value="live">Live Collaboration</TabsTrigger>
              <TabsTrigger value="groups">Study Groups</TabsTrigger>
              <TabsTrigger value="review">Peer Review</TabsTrigger>
            </TabsList>

            <TabsContent value="live">
              <LiveCollaboration />
            </TabsContent>

            <TabsContent value="groups">
              <StudyGroup />
            </TabsContent>

            <TabsContent value="review">
              <PeerReview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;