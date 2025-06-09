import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-email-sentiment.ts';
import '@/ai/flows/extract-contact-details.ts';
import '@/ai/flows/generate-email-response.ts';