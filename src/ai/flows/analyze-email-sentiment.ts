'use server';

/**
 * @fileOverview A flow to analyze the sentiment of an email.
 *
 * - analyzeEmailSentiment - Analyzes the sentiment of an email.
 * - AnalyzeEmailSentimentInput - The input type for the analyzeEmailSentiment function.
 * - AnalyzeEmailSentimentOutput - The output type for the analyzeEmailSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmailSentimentInputSchema = z.object({
  emailBody: z.string().describe('The body of the email to analyze.'),
});

export type AnalyzeEmailSentimentInput = z.infer<
  typeof AnalyzeEmailSentimentInputSchema
>;

const AnalyzeEmailSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the email, e.g., positive, negative, or neutral.'
    ),
  confidence: z
    .number()
    .describe(
      'The confidence level of the sentiment analysis, as a number between 0 and 1.'
    ),
});

export type AnalyzeEmailSentimentOutput = z.infer<
  typeof AnalyzeEmailSentimentOutputSchema
>;

export async function analyzeEmailSentiment(
  input: AnalyzeEmailSentimentInput
): Promise<AnalyzeEmailSentimentOutput> {
  return analyzeEmailSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailSentimentPrompt',
  input: {schema: AnalyzeEmailSentimentInputSchema},
  output: {schema: AnalyzeEmailSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following email body. Return the sentiment (positive, negative, or neutral) and a confidence score between 0 and 1.

Email Body: {{{emailBody}}}

Output in JSON format:
{
  "sentiment": "",
  "confidence": 0.0
}`,
});

const analyzeEmailSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeEmailSentimentFlow',
    inputSchema: AnalyzeEmailSentimentInputSchema,
    outputSchema: AnalyzeEmailSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
