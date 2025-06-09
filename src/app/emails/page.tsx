import { EmailsPageClient } from "./emails-page-client";
import { mockEmails, mockContacts } from "@/lib/mock-data";

export default function EmailsPage() {
  // In a real app, fetch emails from an API (e.g., Gmail)
  const emails = mockEmails;
  const contacts = mockContacts;

  return <EmailsPageClient initialEmails={emails} contacts={contacts} />;
}
