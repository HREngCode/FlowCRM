// src/ai/flows/extract-contact-details.ts
'use server';

/**
 * @fileOverview Extracts contact details from an email using GenAI.
 *
 * - extractContactDetails - Extracts contact details (name, email, phone number, company) from an email.
 * - ExtractContactDetailsInput - The input type for the extractContactDetails function.
 * - ExtractContactDetailsOutput - The return type for the extractContactDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContactDetailsInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email from which to extract contact details.'),
});

export type ExtractContactDetailsInput = z.infer<typeof ExtractContactDetailsInputSchema>;

const ExtractContactDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the contact.'),
  email: z.string().describe('The email address of the contact.'),
  phoneNumber: z.string().describe('The phone number of the contact.'),
  company: z.string().describe('The company of the contact.'),
});

export type ExtractContactDetailsOutput = z.infer<typeof ExtractContactDetailsOutputSchema>;

export async function extractContactDetails(input: ExtractContactDetailsInput): Promise<ExtractContactDetailsOutput> {
  return extractContactDetailsFlow(input);
}

const extractContactDetailsPrompt = ai.definePrompt({
  name: 'extractContactDetailsPrompt',
  input: {schema: ExtractContactDetailsInputSchema},
  output: {schema: ExtractContactDetailsOutputSchema},
  prompt: `You are an AI assistant that extracts contact details from an email.

  Given the content of an email, extract the following information:
  - Name
  - Email Address
  - Phone Number
  - Company

  Email Content: {{{emailContent}}}
  \n
  Return the information in JSON format. If any information cannot be found, return "".`,
});

const extractContactDetailsFlow = ai.defineFlow(
  {
    name: 'extractContactDetailsFlow',
    inputSchema: ExtractContactDetailsInputSchema,
    outputSchema: ExtractContactDetailsOutputSchema,
  },
  async input => {
    const {output} = await extractContactDetailsPrompt(input);
    return output!;
  }
);
