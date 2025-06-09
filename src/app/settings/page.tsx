import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Account Information</CardTitle>
          <CardDescription>Manage your account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Demo User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="user@example.com" disabled />
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gmail Integration</CardTitle>
          <CardDescription>Connect your Gmail account to sync emails.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-md bg-secondary/30">
            <div>
              <p className="font-medium">Gmail Account</p>
              <p className="text-sm text-muted-foreground">mock.data@gmail.com (Mocked)</p>
            </div>
            <Button variant="outline" disabled>Connect New Account</Button>
          </div>
           <p className="text-xs text-muted-foreground">
            Note: Actual Gmail integration is not implemented. This section is for demonstration purposes.
          </p>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="new-email-notifications" className="flex flex-col gap-1">
              <span>New Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive a notification when a new email arrives.
              </span>
            </Label>
            <Switch id="new-email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="task-reminders" className="flex flex-col gap-1">
              <span>Task Reminders</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Get reminded for upcoming tasks or follow-ups.
              </span>
            </Label>
            <Switch id="task-reminders" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
