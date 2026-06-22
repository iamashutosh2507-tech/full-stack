#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const repoRoot2 = join(__dirname, '..', '..');
const envPath = existsSync(join(repoRoot, '.env')) ? join(repoRoot, '.env') : join(repoRoot2, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);
    if (match) {
      process.env.GROQ_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

let GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

export async function reviewCodeWithAI(challengeId, filesToReview, projectDir) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    overall: ''
  };

  try {
    const challengeDir = join(projectDir, 'challenges', challengeId);
    const readmePath = join(challengeDir, 'README.md');
    let challengeContext = '';
    if (existsSync(readmePath)) {
      challengeContext = readFileSync(readmePath, 'utf-8');
    }

    const codeSnippets = [];
    for (const file of filesToReview) {
      const filePath = join(projectDir, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        codeSnippets.push({ file, content: content.substring(0, 1000) });
      }
    }

    if (codeSnippets.length === 0) {
      return { ...results, error: 'No files found to review' };
    }

    if (!GROQ_API_KEY) {
      return { ...results, error: 'GROQ_API_KEY not set', score: 0 };
    }

    const prompt = buildReviewPrompt(challengeId, codeSnippets, challengeContext);
    const aiResponse = await callGroqAPI(prompt);
    const parsedResponse = parseAIResponse(aiResponse);

    return { ...results, ...parsedResponse, score: calculateAIScore(parsedResponse) };

  } catch (error) {
    return { ...results, error: error.message };
  }
}

function buildReviewPrompt(challengeId, codeSnippets, challengeContext = '') {
  const codeContext = codeSnippets.map(s =>
    `File: ${s.file}\n\`\`\`typescript\n${s.content}\n\`\`\``
  ).join('\n\n');

  const contextSection = challengeContext
    ? `\n\n## Challenge Requirements:\n${challengeContext.substring(0, 500)}\n`
    : '';

  return `You are an expert React code reviewer. Review code for challenge "${challengeId}".
${contextSection}
${codeContext}

Respond ONLY with valid JSON, no extra text:
{
  "readability": <number 0-100>,
  "maintainability": <number 0-100>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "overall": "<brief assessment>"
}`;
}

async function callGroqAPI(prompt) {
  GROQ_API_KEY = process.env.GROQ_API_KEY || GROQ_API_KEY;

  

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert React and TypeScript code reviewer. Respond ONLY with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    })
  });

  const data = await response.json().catch(() => ({}));


  if (!response.ok) {
    const msg = data?.error?.message || response.statusText;
    throw new Error(`Groq API error (${response.status}): ${msg}`);
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Groq API returned no content');
  }

  return content;
}

function parseAIResponse(response) {
  try {
    const cleaned = response.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.readability != null && parsed.maintainability != null) return parsed;
  } catch (e) {}

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.readability != null && parsed.maintainability != null) return parsed;
    }
  } catch (e) {}

  const readabilityMatch = response.match(/"readability"\s*:\s*(\d+)/) || response.match(/readability[:\s]+(\d+)/i);
  const maintainabilityMatch = response.match(/"maintainability"\s*:\s*(\d+)/) || response.match(/maintainability[:\s]+(\d+)/i);

  return {
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 75,
    maintainability: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 75,
    strengths: ['Code structure is reasonable'],
    improvements: ['Consider adding more error handling'],
    overall: response.substring(0, 500)
  };
}

function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;
  for (const line of lines) {
    if (keyword.test(line)) { inList = true; continue; }
    if (inList && (line.trim().startsWith('-') || line.trim().match(/^\d+\./))) {
      list.push(line.trim().replace(/^[-•\d.]+\s*/, ''));
      if (list.length >= 3) break;
    }
    if (inList && line.trim() === '') break;
  }
  return list.length > 0 ? list : ['Code structure is reasonable'];
}

function calculateAIScore(parsedResponse) {
  const readability = Math.min(100, Math.max(0, parsedResponse.readability || 75));
  const maintainability = Math.min(100, Math.max(0, parsedResponse.maintainability || 75));
  return Math.round((readability + maintainability) / 2);
}