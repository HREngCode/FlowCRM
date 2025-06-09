import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Mail } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">AI Tools</h1>
      <p className="text-muted-foreground">
        Explore the powerful AI tools integrated into FlowCRM to enhance your productivity.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="font-headline">Sentiment Analyzer</CardTitle>
            <CardDescription>
              Understand the tone and emotion behind your client communications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/sentiment-analyzer" passHref>
              <Button className="w-full">Use Sentiment Analyzer</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="font-headline">Contact Extractor</CardTitle>
            <CardDescription>
              Automatically pull contact details from email signatures and bodies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/contact-extractor" passHref>
              <Button className="w-full">Use Contact Extractor</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="font-headline">Response Generator</CardTitle>
            <CardDescription>
              Craft personalized email replies quickly with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools/response-generator" passHref>
              <Button className="w-full">Use Response Generator</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
