import { ContactsPageClient } from "./contacts-page-client";
import { mockContacts } from "@/lib/mock-data";

export default function ContactsPage() {
  // In a real app, fetch contacts from a database or API
  const contacts = mockContacts;

  return <ContactsPageClient initialContacts={contacts} />;
}
