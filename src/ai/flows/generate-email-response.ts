'use server';

/**
 * @fileOverview A flow for generating personalized email responses based on the content of incoming emails.
 *
 * - generateEmailResponse - A function that generates personalized email responses.
 * - GenerateEmailResponseInput - The input type for the generateEmailResponse function.
 * - GenerateEmailResponseOutput - The return type for the generateEmailResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailResponseInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the incoming email to generate a response for.'),
  tone: z
    .string()
    .optional()
    .describe('The desired tone of the email response. e.g. formal, informal, friendly.'),
  customInstructions: z
    .string()
    .optional()
    .describe('Custom instructions for generating the email response.'),
});
export type GenerateEmailResponseInput = z.infer<typeof GenerateEmailResponseInputSchema>;

const GenerateEmailResponseOutputSchema = z.object({
  response: z.string().describe('The generated email response.'),
});
export type GenerateEmailResponseOutput = z.infer<typeof GenerateEmailResponseOutputSchema>;

export async function generateEmailResponse(
  input: GenerateEmailResponseInput
): Promise<GenerateEmailResponseOutput> {
  return generateEmailResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailResponsePrompt',
  input: {schema: GenerateEmailResponseInputSchema},
  output: {schema: GenerateEmailResponseOutputSchema},
  prompt: `You are an AI assistant specialized in generating email responses.

  Generate a personalized email response based on the content of the incoming email.

  Incoming Email Content: {{{emailContent}}}

  Desired Tone: {{{tone}}}

  Custom Instructions: {{{customInstructions}}}

  Response:
  `,
});

const generateEmailResponseFlow = ai.defineFlow(
  {
    name: 'generateEmailResponseFlow',
    inputSchema: GenerateEmailResponseInputSchema,
    outputSchema: GenerateEmailResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
