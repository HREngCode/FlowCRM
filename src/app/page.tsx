import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Mail, BarChart3, AlertTriangle } from "lucide-react";
import { mockContacts, mockEmails } from "@/lib/mock-data";

export default function DashboardPage() {
  const totalContacts = mockContacts.length;
  const recentEmailsCount = mockEmails.filter(email => new Date(email.receivedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  // Placeholder for pending actions
  const pendingActionsCount = mockEmails.filter(email => !email.sentiment).length; // Example: emails not yet analyzed

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">FlowCRM Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/emails" passHref>
            <Button>View Emails</Button>
          </Link>
          <Link href="/contacts" passHref>
            <Button variant="outline">Manage Contacts</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              Managed contacts in your CRM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Emails (Last 7d)</CardTitle>
            <Mail className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentEmailsCount}</div>
            <p className="text-xs text-muted-foreground">
              Emails processed in the last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Emails awaiting review or response
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gmail Integration Status</CardTitle>
          <CardDescription>
            Currently using mock data. Real Gmail integration would show connection status here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-md">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <p className="text-sm">
              <strong>Developer Note:</strong> Gmail API integration is not implemented in this version. All email and contact data is mocked for demonstration purposes.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>1. Navigate to <Link href="/emails" className="text-primary hover:underline">Emails</Link> to view and analyze incoming messages.</p>
            <p>2. Use AI tools to extract contact details and generate responses.</p>
            <p>3. Manage your client information in the <Link href="/contacts" className="text-primary hover:underline">Contacts</Link> section.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Feature Spotlight: AI Tools</CardTitle>
            <CardDescription>Explore powerful GenAI features to streamline your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Link href="/tools/sentiment-analyzer" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Sentiment Analysis
                </Button>
             </Link>
             <Link href="/tools/contact-extractor" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Extraction
                </Button>
             </Link>
             <Link href="/tools/response-generator" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Automated Response Generation
                </Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
