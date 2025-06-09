"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeEmailSentiment } from "@/ai/flows/analyze-email-sentiment";
import type { AnalyzedSentimentInfo } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SentimentAnalyzerPage() {
  const [emailBody, setEmailBody] = useState('');
  const [result, setResult] = useState<AnalyzedSentimentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!emailBody.trim()) {
      toast({ title: "Input Required", description: "Please enter some text to analyze.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeEmailSentiment({ emailBody });
      setResult(analysis);
      toast({ title: "Analysis Complete", description: "Sentiment has been analyzed." });
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      toast({ title: "Error", description: "Failed to analyze sentiment.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSentimentBadgeVariant = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      case 'neutral': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Sentiment Analyzer</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analyze Text Sentiment</CardTitle>
          <CardDescription>
            Paste any text (e.g., an email body) below to analyze its sentiment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emailText">Text to Analyze</Label>
            <Textarea
              id="emailText"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Enter text here..."
              rows={10}
              className="min-h-[150px]"
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
            Analyze Sentiment
          </Button>

          {result && (
            <div className="mt-6 p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
              <p>
                <strong>Sentiment:</strong>{' '}
                <Badge variant={getSentimentBadgeVariant(result.sentiment)} className="capitalize text-base px-3 py-1">
                  {result.sentiment}
                </Badge>
              </p>
              <p>
                <strong>Confidence:</strong> {(result.confidence * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
