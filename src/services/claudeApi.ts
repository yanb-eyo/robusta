// noinspection ExceptionCaughtLocallyJS

import {ParsedData} from '../utils/fileParser';

interface MessageParam {
  role: 'user' | 'assistant';
  content: string;
}

interface OpenRouterMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const queryDataStreaming = async (
  apiKey: string,
  question: string,
  data: ParsedData,
  conversationHistory: MessageParam[] = [],
  onChunk: (chunk: string) => void
): Promise<void> => {
  const systemPrompt = buildSystemPrompt(data);

  const messages: OpenRouterMessage[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: question,
    },
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-opus-4.6',
        max_tokens: 2048,
        messages: [
          {role: "user", content: systemPrompt},
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message ||
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const {done, value} = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, {stream: true});

      // Process complete events
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        if (!line.startsWith('data: ')) continue;

        const eventData = line.slice(6);

        if (eventData === '[DONE]') {
          return;
        }

        try {
          const event = JSON.parse(eventData);

          // OpenRouter uses OpenAI format streaming
          if (event.choices && event.choices.length > 0) {
            const choice = event.choices[0];
            if (choice.delta && choice.delta.content) {
              onChunk(choice.delta.content);
            }
          }
        } catch (e) {
          console.error('Error parsing event:', e);
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      if (buffer.startsWith('data: ')) {
        try {
          const eventData = buffer.slice(6);
          if (eventData !== '[DONE]') {
            const event = JSON.parse(eventData);

            if (event.choices && event.choices.length > 0) {
              const choice = event.choices[0];
              if (choice.delta && choice.delta.content) {
                onChunk(choice.delta.content);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing final event:', e);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

const buildSystemPrompt = (data: ParsedData): string => {
  const columnInfo = data.columns.join(', ');
  const fullDataJson = JSON.stringify(data.rows).substring(0, 10000); // Limit to first 10k characters to avoid overwhelming the model

  return `You are an AI assistant helping users analyze and understand data.

The user has uploaded a dataset with the following characteristics:
- Number of rows: ${data.metadata.rowCount}
- Number of columns: ${data.metadata.columnCount}
- Column names: ${columnInfo}

Here is the complete dataset:
\`\`\`json
${fullDataJson}
\`\`\`

Guidelines for responding:
1. Provide clear, concise answers to questions about the data
2. When asked for visualizations or charts, describe what they would look like in markdown format
3. Offer insights and patterns you notice in the data
4. Be helpful in suggesting ways to analyze or explore the data
5. If asked something that cannot be answered with the given data, explain why
6. Use markdown formatting for better readability
7. When relevant, provide specific statistics or examples from the data
8. Use the actual dataset provided to answer questions accurately`;
};

// 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
// Visualize last month data
