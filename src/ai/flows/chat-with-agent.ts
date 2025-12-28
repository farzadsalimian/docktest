'use server';
/**
 * @fileOverview An AI chat agent for stock insights. This flow enables users to ask questions
 * about current stock levels and trends via a chat interface, providing quick inventory insights.
 *
 * - chatWithAgent - The main function to initiate the chat and provide stock insights.
 * - ChatWithAgentInput - The input type for the chatWithAgent function.
 * - ChatWithAgentOutput - The return type for the chatWithAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAgentInputSchema = z.object({
  query: z.string().describe('The user query about stock levels or trends.'),
});
export type ChatWithAgentInput = z.infer<
  typeof ChatWithAgentInputSchema
>;

const ChatWithAgentOutputSchema = z.object({
  response: z.string().describe('The AI agent\'s response to the user query.'),
});
export type ChatWithAgentOutput = z.infer<
  typeof ChatWithAgentOutputSchema
>;

export async function chatWithAgent(
  input: ChatWithAgentInput
): Promise<ChatWithAgentOutput> {
  return chatWithAgentFlow(input);
}

const getStockLevel = ai.defineTool({
  name: 'getStockLevel',
  description: 'Returns the current stock level for a given item.',
  inputSchema: z.object({
    item: z.string().describe('The name of the item to check stock level for.'),
  }),
  outputSchema: z.number().describe('The current stock level of the item.'),
},
async (input) => {
    // This can call any typescript function.  Return the stock price...
    // For now, we return a dummy value:
    return Math.floor(Math.random() * 100);  // Returns a number between 0 and 99
  }
);

const prompt = ai.definePrompt({
  name: 'chatWithAgentPrompt',
  tools: [getStockLevel],
  input: {schema: ChatWithAgentInputSchema},
  output: {schema: ChatWithAgentOutputSchema},
  prompt: `You are a helpful AI agent specializing in providing insights about stock levels and trends.

  Use the available tools to answer user questions accurately.

  If the user asks about the stock level of a specific item, use the getStockLevel tool to get the current stock level.

  Based on the stock levels, provide useful insights and recommendations related to stock management principles.

  If the user question is not related to stock levels or trends, respond politely that you can only answer questions about stock management.

  Query: {{{query}}} `,
});

const chatWithAgentFlow = ai.defineFlow(
  {
    name: 'chatWithAgentFlow',
    inputSchema: ChatWithAgentInputSchema,
    outputSchema: ChatWithAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
