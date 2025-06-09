"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmailResponse } from "@/ai/flows/generate-email-response";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, Bot, Palette, Info } from 'lucide-react';

export default function ResponseGeneratorPage() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      toast({ title: "Input Required", description: "Please enter the original email content.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedResponse('');
    try {
      const result = await generateEmailResponse({ emailContent, tone, customInstructions });
      setGeneratedResponse(result.response);
      toast({ title: "Response Generated", description: "AI has drafted a response." });
    } catch (error) {
      console.error("Response generation error:", error);
      toast({ title: "Error", description: "Failed to generate response.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">AI Email Response Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Craft Your Email Response</CardTitle>
          <CardDescription>
            Provide the original email content, choose a tone, and add any custom instructions to generate a personalized response.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="originalEmail">Original Email Content</Label>
            <Textarea
              id="originalEmail"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste the email you want to respond to..."
              rows={8}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone" className="flex items-center gap-1"><Palette className="h-4 w-4 text-muted-foreground"/>Desired Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customInstructions" className="flex items-center gap-1"><Info className="h-4 w-4 text-muted-foreground"/>Custom Instructions (Optional)</Label>
              <Input
                id="customInstructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Ask for a meeting next week"
              />
            </div>
          </div>
          
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            Generate Response
          </Button>

          {generatedResponse && (
            <div className="mt-6 space-y-2">
              <Label htmlFor="generatedResponse">Suggested Response:</Label>
              <Textarea
                id="generatedResponse"
                value={generatedResponse}
                onChange={(e) => setGeneratedResponse(e.target.value)}
                rows={10}
                className="min-h-[150px]"
                placeholder="AI generated response will appear here..."
              />
              <Button onClick={() => navigator.clipboard.writeText(generatedResponse).then(() => toast({title: "Copied!", description:"Response copied to clipboard."}))} variant="outline">
                Copy Response
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
