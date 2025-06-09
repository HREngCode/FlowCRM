"use client";

import type { Email, Contact, AnalyzedContactInfo, AnalyzedSentimentInfo } from "@/types";
import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeEmailSentiment } from "@/ai/flows/analyze-email-sentiment";
import { extractContactDetails } from "@/ai/flows/extract-contact-details";
import { generateEmailResponse } from "@/ai/flows/generate-email-response";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, UserPlus, Send, Bot, Palette, Info, AlertTriangle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface EmailsPageClientProps {
  initialEmails: Email[];
  contacts: Contact[]; // For linking/saving contacts
}

export function EmailsPageClient({ initialEmails, contacts: initialContactsProp }: EmailsPageClientProps) {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [contacts, setContacts] = useState<Contact[]>(initialContactsProp);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails.length > 0 ? emails[0] : null);
  
  const [analyzedContact, setAnalyzedContact] = useState<AnalyzedContactInfo | null>(null);
  const [analyzedSentiment, setAnalyzedSentiment] = useState<AnalyzedSentimentInfo | null>(null);
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const [responseTone, setResponseTone] = useState<string>("professional");
  const [customInstructions, setCustomInstructions] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    // Reset analysis and response when email changes
    setAnalyzedContact(null);
    setAnalyzedSentiment(null);
    setGeneratedResponse("");
    setCustomInstructions("");
  }, [selectedEmail]);

  const handleAnalyzeEmail = async () => {
    if (!selectedEmail) return;
    setIsLoadingAnalysis(true);
    setAnalyzedContact(null);
    setAnalyzedSentiment(null);
    try {
      const [sentimentResult, contactResult] = await Promise.all([
        analyzeEmailSentiment({ emailBody: selectedEmail.body }),
        extractContactDetails({ emailContent: selectedEmail.body }),
      ]);
      
      setAnalyzedSentiment(sentimentResult);
      setAnalyzedContact(contactResult);

      toast({
        title: "Analysis Complete",
        description: "Email sentiment and contact details extracted.",
      });
    } catch (error) {
      console.error("Error analyzing email:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze email. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (!selectedEmail) return;
    setIsLoadingResponse(true);
    setGeneratedResponse("");
    try {
      const result = await generateEmailResponse({
        emailContent: selectedEmail.body,
        tone: responseTone,
        customInstructions: customInstructions,
      });
      setGeneratedResponse(result.response);
      toast({
        title: "Response Generated",
        description: "AI has drafted a response for you.",
      });
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Response Generation Failed",
        description: "Could not generate response. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleSaveContact = () => {
    if (!analyzedContact || !selectedEmail) return;
    
    const existingContact = contacts.find(c => c.email === analyzedContact.email);
    if (existingContact) {
      toast({ title: "Contact Exists", description: `${analyzedContact.name} is already in your contacts.`});
      return;
    }

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: analyzedContact.name || "Unknown Name",
      email: analyzedContact.email,
      phone: analyzedContact.phoneNumber,
      company: analyzedContact.company,
      source: `Email Import - ${selectedEmail.subject.substring(0, 20)}...`,
      lastContacted: new Date().toISOString(),
      avatarUrl: `https://placehold.co/100x100.png?text=${(analyzedContact.name || "U").charAt(0)}`
    };
    setContacts(prev => [newContact, ...prev]);
    // Here you would also persist this to your backend
    toast({
      title: "Contact Saved",
      description: `${newContact.name} has been added to your contacts.`,
    });
  };
  
  const handleSendResponse = () => {
    if (!selectedEmail || !generatedResponse) return;
    // Mock sending email
    toast({
      title: "Email Sent (Mock)",
      description: `Response to "${selectedEmail.subject}" has been "sent".`,
    });
    // Optionally, clear response or mark email as replied
  };

  const getSentimentBadgeVariant = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'default'; // Default is often green-ish or blue-ish
      case 'negative': return 'destructive';
      case 'neutral': return 'secondary';
      default: return 'outline';
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] gap-6"> {/* Adjust height as needed */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Email Center</h1>
         <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-md border border-dashed border-input">
            <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong>Developer Note:</strong> Using mock email data. Gmail API not integrated.
            </p>
          </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border shadow-sm">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold font-headline">Inbox ({emails.length})</h2>
            </div>
            <ScrollArea className="flex-grow">
              {emails.map((email) => (
                <button
                  key={email.id}
                  className={`w-full text-left p-4 border-b hover:bg-muted focus:bg-accent focus:text-accent-foreground outline-none ${selectedEmail?.id === email.id ? "bg-muted" : ""}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="font-semibold">{email.sender}</div>
                  <div className="text-sm text-muted-foreground truncate">{email.subject}</div>
                  <div className="text-xs text-muted-foreground">{format(parseISO(email.receivedAt), 'MMM d, p')}</div>
                </button>
              ))}
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30}>
          <ScrollArea className="h-full">
            {selectedEmail ? (
              <div className="p-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{selectedEmail.subject}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${selectedEmail.sender.charAt(0)}`} alt={selectedEmail.sender} data-ai-hint="person generic"/>
                        <AvatarFallback>{selectedEmail.sender.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        From: <strong>{selectedEmail.sender}</strong> &lt;{selectedEmail.senderEmail}&gt;
                        <br/>
                        To: {selectedEmail.recipient}
                        <br/>
                        Date: {format(parseISO(selectedEmail.receivedAt), 'MMMM d, yyyy HH:mm')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">{selectedEmail.body}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={handleAnalyzeEmail} disabled={isLoadingAnalysis} className="w-full sm:w-auto">
                      {isLoadingAnalysis && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Analyze Email
                    </Button>
                    {analyzedSentiment && (
                      <div className="p-4 bg-secondary/50 rounded-md">
                        <h3 className="font-semibold mb-1">Sentiment:</h3>
                        <p>
                          <Badge variant={getSentimentBadgeVariant(analyzedSentiment.sentiment)} className="capitalize">{analyzedSentiment.sentiment}</Badge>
                          {' '} (Confidence: {(analyzedSentiment.confidence * 100).toFixed(0)}%)
                        </p>
                      </div>
                    )}
                    {analyzedContact && (
                      <div className="p-4 bg-secondary/50 rounded-md">
                        <h3 className="font-semibold mb-1">Extracted Contact:</h3>
                        <p><strong>Name:</strong> {analyzedContact.name || "N/A"}</p>
                        <p><strong>Email:</strong> {analyzedContact.email || "N/A"}</p>
                        <p><strong>Phone:</strong> {analyzedContact.phoneNumber || "N/A"}</p>
                        <p><strong>Company:</strong> {analyzedContact.company || "N/A"}</p>
                        {analyzedContact.email && !contacts.find(c => c.email === analyzedContact.email) && (
                           <Button size="sm" onClick={handleSaveContact} className="mt-2">
                             <UserPlus className="mr-2 h-4 w-4" /> Save Contact
                           </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Generate Response</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tone" className="flex items-center gap-1"><Palette className="h-4 w-4 text-muted-foreground"/>Tone</Label>
                        <Select value={responseTone} onValueChange={setResponseTone}>
                          <SelectTrigger id="tone">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="customInstructions" className="flex items-center gap-1"><Info className="h-4 w-4 text-muted-foreground"/>Custom Instructions (Optional)</Label>
                        <Input
                          id="customInstructions"
                          placeholder="e.g., Mention upcoming promotion"
                          value={customInstructions}
                          onChange={(e) => setCustomInstructions(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleGenerateResponse} disabled={isLoadingResponse} className="w-full sm:w-auto">
                      {isLoadingResponse && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate
                    </Button>
                    {generatedResponse && (
                      <div className="space-y-2">
                        <Label htmlFor="generatedResponse">Suggested Response:</Label>
                        <Textarea
                          id="generatedResponse"
                          value={generatedResponse}
                          onChange={(e) => setGeneratedResponse(e.target.value)}
                          rows={8}
                          className="min-h-[150px]"
                        />
                         <Button onClick={handleSendResponse} className="w-full sm:w-auto">
                           <Send className="mr-2 h-4 w-4" /> Send Response (Mock)
                         </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select an email to view its content and actions.</p>
              </div>
            )}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
