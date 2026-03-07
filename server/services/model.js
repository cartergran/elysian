import Anthropic from '@anthropic-ai/sdk';
import { requireEnvVariable } from '../utils.js';

const ANTHROPIC_API_KEY = requireEnvVariable('ANTHROPIC_API_KEY');

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
const EXTRACTION_PROMPT = process.env.EXTRACTION_PROMPT || 'Return an empty array [] as plain text.';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  maxRetries: 4, // exponential backoff: ~1s, 2s, 4s, 8s between attempts
});

const OUTPUT_SCHEMA = {
  additionalProperties: false,
  type: 'object',
  properties: {
    period: { type: 'string' },
    investments: {
      additionalProperties: false,
      type: 'array',
      items: {
        additionalProperties: false,
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          investmentRound: {
            type: 'object',
            properties: {
              investedCapital: { type: ['number', 'null'] },
              realizedValue: { type: ['number', 'null'] },
              unrealizedValue: { type: ['number', 'null'] },
              totalValue: { type: ['number', 'null'] },
              grossIrr: { type: ['number', 'null'] }
            },
            required: ['investedCapital', 'totalValue']
          }
        },
        required: ['companyName', 'investmentRound']
      }
    }
  },
  required: ['period', 'investments']
};

const parseAnthropicResponse = (res) => {
  const toolOutput = res.content.find(obj => obj.type === 'tool_use');
  if (toolOutput) {
    return toolOutput.input;
  }

  const textOutput = res.content.find(obj => obj.type === 'text');
  if (textOutput) {
    console.log('Model returned text: ', textOutput.text);
  }

  return [];
};

const callAndParseAnthropic = async (signedUrl) => {
  const res = await anthropic.messages.create({
    max_tokens: 8000,
    model: ANTHROPIC_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'url',
              url: signedUrl
            }
          },
          {
            type: 'text',
            text: EXTRACTION_PROMPT
          }
        ]
      }
    ],
    tools: [
      {
        description: 'Extract a financial table from a PDF and return a JSON matching the schema.',
        input_schema: OUTPUT_SCHEMA,
        name: 'extract_financial_table',
      }
    ],
  });

  return parseAnthropicResponse(res);
};

export default callAndParseAnthropic;
