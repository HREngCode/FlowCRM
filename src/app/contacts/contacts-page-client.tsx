"use client";

import type { Contact } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Briefcase, UserPlus, Edit3, Trash2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactsPageClientProps {
  initialContacts: Contact[];
}

export function ContactsPageClient({ initialContacts }: ContactsPageClientProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'avatarUrl'> & { id?: string }) => {
    if (contactData.id) { // Editing existing contact
      setContacts(prev => prev.map(c => c.id === contactData.id ? { ...c, ...contactData, avatarUrl: c.avatarUrl || `https://placehold.co/100x100.png?text=${contactData.name.charAt(0)}` } : c));
      toast({ title: "Contact Updated", description: `${contactData.name} has been updated.` });
    } else { // Adding new contact
      const newContact: Contact = { 
        ...contactData, 
        id: `contact-${Date.now()}`, 
        avatarUrl: `https://placehold.co/100x100.png?text=${contactData.name.charAt(0)}`,
        lastContacted: new Date().toISOString(),
        source: "Manual Entry",
      };
      setContacts(prev => [newContact, ...prev]);
      toast({ title: "Contact Added", description: `${newContact.name} has been added.` });
    }
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId: string) => {
    const contactToDelete = contacts.find(c => c.id === contactId);
    setContacts(prev => prev.filter(c => c.id !== contactId));
    if (contactToDelete) {
       toast({ title: "Contact Deleted", description: `${contactToDelete.name} has been deleted.`, variant: "destructive" });
    }
  };

  const ContactForm = ({ contact, onSave, onCancel }: { contact: Contact | null, onSave: (data: Omit<Contact, 'id' | 'avatarUrl'> & { id?: string }) => void, onCancel: () => void }) => {
    const [name, setName] = useState(contact?.name || "");
    const [email, setEmail] = useState(contact?.email || "");
    const [phone, setPhone] = useState(contact?.phone || "");
    const [company, setCompany] = useState(contact?.company || "");
    const [notes, setNotes] = useState(contact?.notes || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email) {
        toast({ title: "Error", description: "Name and Email are required.", variant: "destructive" });
        return;
      }
      onSave({ id: contact?.id, name, email, phone, company, notes });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button type="submit">{contact ? "Save Changes" : "Add Contact"}</Button>
        </DialogFooter>
      </form>
    );
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Contacts</h1>
        <div className="flex gap-2 items-center">
          <Input
            type="search"
            placeholder="Search contacts..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog onOpenChange={(open) => !open && setEditingContact(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingContact(null)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                <DialogDescription>
                  {editingContact ? "Update the details for this contact." : "Fill in the details for the new contact."}
                </DialogDescription>
              </DialogHeader>
              <ContactForm contact={editingContact} onSave={handleSaveContact} onCancel={() => setEditingContact(null)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={contact.avatarUrl || `https://placehold.co/100x100.png?text=${contact.name.charAt(0)}`} alt={contact.name} data-ai-hint="person business" />
                  <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-headline text-xl">{contact.name}</CardTitle>
                  {contact.company && (
                    <CardDescription className="flex items-center text-sm">
                      <Briefcase className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      {contact.company}
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <a href={`mailto:${contact.email}`} className="flex items-center text-sm text-primary hover:underline">
                  <Mail className="mr-1.5 h-4 w-4" />
                  {contact.email}
                </a>
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center text-sm text-primary hover:underline">
                    <Phone className="mr-1.5 h-4 w-4" />
                    {contact.phone}
                  </a>
                )}
                {contact.notes && (
                   <p className="text-sm text-muted-foreground pt-2 flex items-start">
                     <MessageSquare className="mr-1.5 h-4 w-4 mt-0.5 shrink-0" />
                     <span>{contact.notes}</span>
                   </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4">
                <Dialog onOpenChange={(open) => !open && setEditingContact(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingContact(contact)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Contact</DialogTitle>
                      <DialogDescription>Update the details for {contact.name}.</DialogDescription>
                    </DialogHeader>
                    <ContactForm contact={contact} onSave={handleSaveContact} onCancel={() => setEditingContact(null)} />
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteContact(contact.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No contacts found. {searchTerm && "Try a different search term."}</p>
        </div>
      )}
    </div>
  );
}
