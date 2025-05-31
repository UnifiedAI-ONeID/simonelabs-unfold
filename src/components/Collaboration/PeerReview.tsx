import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  helpful: number;
  timestamp: Date;
}

interface Submission {
  id: string;
  title: string;
  content: string;
  author: string;
  reviews: Review[];
}

const PeerReview = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      title: 'React Component Architecture',
      content: 'This submission discusses best practices for React component architecture...',
      author: 'John Doe',
      reviews: [
        {
          id: '1',
          userId: '123',
          userName: 'Alice',
          content: 'Great explanation of component patterns!',
          rating: 5,
          helpful: 3,
          timestamp: new Date()
        }
      ]
    }
  ]);

  const { toast } = useToast();

  const submitReview = (submissionId: string, review: string) => {
    if (!review.trim()) return;

    toast({
      title: "Review Submitted",
      description: "Your review has been submitted successfully.",
    });
  };

  const markHelpful = (submissionId: string, reviewId: string) => {
    toast({
      title: "Marked as Helpful",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Peer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{submission.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {submission.author}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Reviews</h4>
                <div className="space-y-4">
                  {submission.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markHelpful(submission.id, review.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {review.helpful}
                        </Button>
                      </div>
                      <p className="text-muted-foreground">{review.content}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {review.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <Textarea placeholder="Write your review..." />
                  <Button onClick={() => submitReview(submission.id, '')}>
                    Submit Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default PeerReview;