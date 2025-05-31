import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, ThumbsUp, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  timestamp: string;
}

interface Submission {
  id: string;
  title: string;
  content: string;
  author: string;
  reviews: Review[];
  status: 'pending' | 'reviewed';
}

const PeerReview = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewContent, setReviewContent] = useState('');
  const { toast } = useToast();

  const mockSubmissions: Submission[] = [
    {
      id: '1',
      title: 'React Component Architecture',
      content: 'This submission discusses best practices for React component architecture...',
      author: 'John Doe',
      status: 'pending',
      reviews: [
        {
          id: '1',
          author: 'Jane Smith',
          content: 'Great work on component separation!',
          rating: 4,
          timestamp: '2024-03-24T10:00:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'API Design Patterns',
      content: 'An overview of RESTful API design patterns...',
      author: 'Alice Johnson',
      status: 'reviewed',
      reviews: [
        {
          id: '2',
          author: 'Bob Wilson',
          content: 'Very comprehensive coverage of REST principles.',
          rating: 5,
          timestamp: '2024-03-23T15:30:00Z'
        }
      ]
    }
  ];

  const submitReview = () => {
    if (!reviewContent.trim() || !selectedSubmission) return;

    toast({
      title: "Review Submitted",
      description: "Your peer review has been submitted successfully.",
    });

    setReviewContent('');
    setSelectedSubmission(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Peer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="space-y-4">
            <h3 className="font-medium mb-2">Submissions for Review</h3>
            {mockSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedSubmission?.id === submission.id
                    ? 'bg-accent/10'
                    : 'hover:bg-accent/5'
                }`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{submission.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      by {submission.author}
                    </p>
                  </div>
                  <Badge variant={submission.status === 'pending' ? 'default' : 'secondary'}>
                    {submission.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {submission.reviews.length} reviews
                </div>
              </div>
            ))}
          </div>

          {/* Review Section */}
          <div className="space-y-4">
            {selectedSubmission ? (
              <>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{selectedSubmission.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedSubmission.content}
                  </p>
                  <div className="space-y-4">
                    {selectedSubmission.reviews.map((review) => (
                      <div key={review.id} className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.author}</span>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-500 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your review..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={submitReview} className="w-full">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Submit Review
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a submission to review
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeerReview;