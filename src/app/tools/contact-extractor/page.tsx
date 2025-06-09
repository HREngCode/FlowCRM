"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { extractContactDetails } from "@/ai/flows/extract-contact-details";
import type { AnalyzedContactInfo } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Users, Loader2 } from 'lucide-react';

export default function ContactExtractorPage() {
  const [emailContent, setEmailContent] = useState('');
  const [result, setResult] = useState<AnalyzedContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      toast({ title: "Input Required", description: "Please enter some text to extract contacts from.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const extractedData = await extractContactDetails({ emailContent });
      setResult(extractedData);
      toast({ title: "Extraction Complete", description: "Contact details have been extracted." });
    } catch (error) {
      console.error("Contact extraction error:", error);
      toast({ title: "Error", description: "Failed to extract contact details.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Contact Extractor</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Extract Contact Details</CardTitle>
          <CardDescription>
            Paste email content or any text containing contact information to extract details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emailText">Text for Extraction</Label>
            <Textarea
              id="emailText"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste email content here..."
              rows={10}
              className="min-h-[150px]"
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
            Extract Contacts
          </Button>

          {result && (
            <div className="mt-6 p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Extracted Information:</h3>
              <ul className="space-y-1">
                <li><strong>Name:</strong> {result.name || 'N/A'}</li>
                <li><strong>Email:</strong> {result.email || 'N/A'}</li>
                <li><strong>Phone:</strong> {result.phoneNumber || 'N/A'}</li>
                <li><strong>Company:</strong> {result.company || 'N/A'}</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
