'use server';
/**
 * @fileOverview An AI chat agent for stock insights. This flow enables users to ask questions
 * about current stock levels and trends via a chat interface, providing quick inventory insights.
 *
 * - aiChatAgentForStockInsights - The main function to initiate the chat and provide stock insights.
 * - AIChatAgentForStockInsightsInput - The input type for the aiChatAgentForStockInsights function.
 * - AIChatAgentForStockInsightsOutput - The return type for the aiChatAgentForStockInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatAgentForStockInsightsInputSchema = z.object({
  query: z.string().describe('The user query about stock levels or trends.'),
});
export type AIChatAgentForStockInsightsInput = z.infer<
  typeof AIChatAgentForStockInsightsInputSchema
>;

const AIChatAgentForStockInsightsOutputSchema = z.object({
  response: z.string().describe('The AI agent\'s response to the user query.'),
});
export type AIChatAgentForStockInsightsOutput = z.infer<
  typeof AIChatAgentForStockInsightsOutputSchema
>;

export async function aiChatAgentForStockInsights(
  input: AIChatAgentForStockInsightsInput
): Promise<AIChatAgentForStockInsightsOutput> {
  return aiChatAgentForStockInsightsFlow(input);
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
  name: 'aiChatAgentForStockInsightsPrompt',
  tools: [getStockLevel],
  input: {schema: AIChatAgentForStockInsightsInputSchema},
  output: {schema: AIChatAgentForStockInsightsOutputSchema},
  prompt: `You are a helpful AI agent specializing in providing insights about stock levels and trends.

  Use the available tools to answer user questions accurately.

  If the user asks about the stock level of a specific item, use the getStockLevel tool to get the current stock level.

  Based on the stock levels, provide useful insights and recommendations related to stock management principles.

  If the user question is not related to stock levels or trends, respond politely that you can only answer questions about stock management.

  Query: {{{query}}} `,
});

const aiChatAgentForStockInsightsFlow = ai.defineFlow(
  {
    name: 'aiChatAgentForStockInsightsFlow',
    inputSchema: AIChatAgentForStockInsightsInputSchema,
    outputSchema: AIChatAgentForStockInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
