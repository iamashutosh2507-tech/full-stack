#!/usr/bin/env node

/**
 * AI Review Layer for RTK Query Course
 * 
 * Uses Groq API (Llama 3.1 8B) to provide qualitative code review
 * 
 * IMPORTANT: This review only runs if functional tests pass.
 * It receives:
 * - Challenge instructions and requirements (README.md - merged file)
 * - All user-created code files
 * 
 * Provides sophisticated feedback based on actual implementation vs requirements.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const envPath = join(repoRoot, '.env');
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

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// File extensions to include in code review
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Reviews code using AI for qualitative feedback
 * @param {string} challengeId - Challenge ID
 * @param {object} challengeMetadata - Challenge metadata (includes filesToCheck, patternsRequired, etc.)
 * @param {string} projectDir - Project directory path
 */
export async function reviewCodeWithAI(challengeId, challengeMetadata, projectDir) {
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
    // 1. Load challenge instructions and requirements from README.md (merged file)
    const challengeDir = join(projectDir, 'challenges', challengeId);
    const readmePath = join(challengeDir, 'README.md');
    
    let challengeInstructions = '';
    let challengeRequirements = '';

    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      // Split README into instructions (before Technical Requirements) and requirements (after)
      const requirementsMatch = readmeContent.match(/## Technical Requirements(?: \(What Will Be Reviewed\))?/);
      if (requirementsMatch) {
        const splitIndex = requirementsMatch.index;
        challengeInstructions = readmeContent.substring(0, splitIndex);
        challengeRequirements = readmeContent.substring(splitIndex);
      } else {
        // If no Technical Requirements section, use entire README as instructions
        challengeInstructions = readmeContent;
      }
    }

    // 2. Read all user-created code files
    const codeFiles = [];
    const missingFiles = [];
    
    for (const filePath of challengeMetadata.filesToCheck || []) {
      const fullPath = join(projectDir, filePath);
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf-8');
        // Only include if it's a code file and has meaningful content
        if (CODE_EXTENSIONS.includes(extname(fullPath)) && content.trim().length > 0) {
          codeFiles.push({
            file: filePath,
            content: content.substring(0, 4000) // Limit per file to stay under Groq's free-tier TPM cap
          });
        }
      } else {
        missingFiles.push(filePath);
      }
    }

    // 3. Discover additional files user might have created in relevant directories
    const additionalFiles = discoverAdditionalFiles(challengeMetadata, projectDir);
    for (const file of additionalFiles) {
      // Avoid duplicates
      if (!codeFiles.some(f => f.file === file.file)) {
        codeFiles.push(file);
      }
    }

    if (codeFiles.length === 0) {
      return {
        ...results,
        error: 'No code files found to review. User must create the required files first.',
        score: 0
      };
    }

    // 4. Check if API key is available
    if (!GROQ_API_KEY) {
      return {
        ...results,
        error: 'GROQ_API_KEY environment variable not set. AI review skipped.',
        score: 0
      };
    }

    // 5. Build sophisticated prompt with all context
    const prompt = buildReviewPrompt(
      challengeId,
      challengeMetadata,
      challengeInstructions,
      challengeRequirements,
      codeFiles,
      missingFiles
    );

    // 6. Call Groq API
    const aiResponse = await callGroqAPI(prompt);

    // 7. Parse response
    const parsedResponse = parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };

  } catch (error) {
    return {
      ...results,
      error: error.message,
      score: 0
    };
  }
}

/**
 * Discover additional files user might have created
 */
function discoverAdditionalFiles(challengeMetadata, projectDir) {
  const additionalFiles = [];
  const checkedDirs = new Set();

  // Check directories mentioned in filesToCheck
  for (const filePath of challengeMetadata.filesToCheck || []) {
    const dir = dirname(filePath);
    if (!checkedDirs.has(dir)) {
      checkedDirs.add(dir);
      const fullDir = join(projectDir, dir);
      if (existsSync(fullDir)) {
        try {
          const files = readdirSync(fullDir);
          for (const file of files) {
            const fullPath = join(fullDir, file);
            if (statSync(fullPath).isFile() && CODE_EXTENSIONS.includes(extname(file))) {
              const relativePath = join(dir, file).replace(/\\/g, '/');
              // Only include if not already in filesToCheck
              if (!challengeMetadata.filesToCheck.includes(relativePath)) {
                try {
                  const content = readFileSync(fullPath, 'utf-8');
                  if (content.trim().length > 0) {
                    additionalFiles.push({
                      file: relativePath,
                      content: content.substring(0, 4000)
                    });
                  }
                } catch (e) {
                  // Skip files that can't be read
                }
              }
            }
          }
        } catch (e) {
          // Skip directories that can't be read
        }
      }
    }
  }

  return additionalFiles;
}

/**
 * Build sophisticated review prompt with all context
 */
function buildReviewPrompt(challengeId, challengeMetadata, instructions, requirements, codeFiles, missingFiles) {
  const challengeName = challengeMetadata.challengeName || challengeId;
  const skills = challengeMetadata.skills || [];
  const patternsRequired = challengeMetadata.patternsRequired || [];

  // Build code context
  const codeContext = codeFiles.map(f => 
    `File: ${f.file}\n\`\`\`typescript\n${f.content}\n\`\`\``
  ).join('\n\n---\n\n');

  // Build missing files note
  const missingFilesNote = missingFiles.length > 0
    ? `\n\n⚠️ NOTE: The following expected files are missing: ${missingFiles.join(', ')}. This may indicate incomplete implementation.`
    : '';

  // Build requirements summary
  const requirementsSummary = requirements
    ? `\n\n## Technical Requirements:\n${requirements.substring(0, 1500)}`
    : '';

  // Build instructions summary
  const instructionsSummary = instructions
    ? `\n\n## Challenge Instructions:\n${instructions.substring(0, 2000)}`
    : '';

  return `You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Review the following implementation for challenge "${challengeName}" (${challengeId}).

## Challenge Context:
- **Challenge ID**: ${challengeId}
- **Skills Focus**: ${skills.join(', ')}
- **Required Patterns**: ${patternsRequired.join(', ')}${instructionsSummary}${requirementsSummary}

## User's Implementation:

The following code files were created/modified by the user for this challenge:

${codeContext}${missingFilesNote}

## Review Task:

Provide a comprehensive code review focusing on:

1. **Requirement Compliance** (30%):
   - Does the code meet all functional requirements?
   - Are all required patterns implemented correctly?
   - Are missing files a concern?

2. **Code Quality** (25%):
   - Readability: Is the code clear and well-structured?
   - TypeScript usage: Proper types and interfaces?
   - Code organization: Logical structure and separation of concerns?

3. **RTK Query Best Practices** (25%):
   - Correct use of createApi, fetchBaseQuery, endpoints
   - Proper hook usage (useGetUsersQuery, etc.)
   - Store integration and reducer setup
   - Error and loading state handling

4. **Maintainability** (20%):
   - Is the code maintainable and extensible?
   - Are there any code smells or anti-patterns?
   - Could the code be improved for future changes?

## Output Format:

Provide your review as JSON:

{
  "readability": <number 0-100>,
  "maintainability": <number 0-100>,
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1 with file reference", "specific improvement 2 with file reference", "specific improvement 3 with file reference"],
  "overall": "<2-3 sentence assessment focusing on requirement compliance and RTK Query best practices>",
  "requirementCompliance": <number 0-100, how well requirements are met>
}

Be specific in your feedback. Reference specific files and code patterns. Focus on actionable improvements.`;
}

/**
 * Call Groq API
 */
async function callGroqAPI(prompt) {
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
          content: 'You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Provide detailed, specific, actionable feedback. Reference specific files and code patterns in your feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1800 // Kept under Groq's free-tier 6000 TPM cap alongside prompt size; JSON-repair parsing covers any truncation
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data?.error?.message || data?.error || response.statusText;
    throw new Error(`Groq API error (${response.status}): ${msg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (content == null || typeof content !== 'string') {
    throw new Error('Groq API returned no content (check model/response shape)');
  }
  return content;
}

/**
 * Parse AI response
 */
function parseAIResponse(response) {
  // Prefer content inside a ```json ... ``` fence if present (strips any
  // leading prose like "## Review" that the model sometimes adds).
  const fenceMatch = response.match(/```json\s*([\s\S]*?)```/i);
  const candidates = [
    fenceMatch ? fenceMatch[1] : null,
    response
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = tryParseJSONObject(candidate);
    if (parsed) {
      return {
        readability: parsed.readability || 0,
        maintainability: parsed.maintainability || 0,
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        overall: parsed.overall || '',
        requirementCompliance: parsed.requirementCompliance || 0
      };
    }
  }

  // Fallback: extract information manually
  const readabilityMatch = response.match(/readability[:\s]+(\d+)/i);
  const maintainabilityMatch = response.match(/maintainability[:\s]+(\d+)/i);
  const complianceMatch = response.match(/requirementCompliance[:\s]+(\d+)/i);

  return {
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 0,
    maintainability: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 0,
    requirementCompliance: complianceMatch ? parseInt(complianceMatch[1]) : 0,
    strengths: extractList(response, /strengths?/i),
    improvements: extractList(response, /improvements?/i),
    overall: response.substring(0, 500)
  };
}

/**
 * Parse a JSON object out of possibly-truncated model output (e.g. cut off
 * by max_tokens mid-string). Tries as-is, then closes any unterminated
 * string/braces, then falls back to dropping the last incomplete element.
 */
function tryParseJSONObject(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;
  const str = text.slice(start).trim();

  let result = safeJSONParse(str);
  if (result) return result;

  result = safeJSONParse(closeUnterminatedJSON(str));
  if (result) return result;

  const lastComma = str.lastIndexOf(',');
  if (lastComma > -1) {
    result = safeJSONParse(closeUnterminatedJSON(str.slice(0, lastComma)));
    if (result) return result;
  }

  return null;
}

function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function closeUnterminatedJSON(str) {
  const stack = [];
  let inString = false;
  let escape = false;

  for (const ch of str) {
    if (inString) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }

  let closed = str;
  if (inString) closed += '"';
  for (let i = stack.length - 1; i >= 0; i--) {
    closed += stack[i] === '{' ? '}' : ']';
  }
  return closed;
}

/**
 * Extract list items from text
 */
function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;
  const matchesKeyword = (line) =>
    typeof keyword === 'string'
      ? line.toLowerCase().includes(keyword)
      : keyword.test(line);

  for (const line of lines) {
    if (matchesKeyword(line)) {
      inList = true;
      continue;
    }
    if (inList && (line.trim().startsWith('-') || line.trim().match(/^\d+\./) || line.trim().startsWith('"'))) {
      let item = line.trim().replace(/^[-•\d."]+\s*/, '').replace(/^["']|["']$/g, '');
      if (item) {
        list.push(item);
        if (list.length >= 5) break; // Allow up to 5 items
      }
    }
    if (inList && line.trim() === '' && list.length > 0) {
      break;
    }
  }

  return list.length > 0 ? list : [];
}

/**
 * Calculate AI score based on multiple factors
 */
function calculateAIScore(parsedResponse) {
  const readability = parsedResponse.readability || 0;
  const maintainability = parsedResponse.maintainability || 0;
  const requirementCompliance = parsedResponse.requirementCompliance || 0;

  // Weighted average: requirement compliance is most important
  // Since tests already passed, we focus on code quality
  const score = Math.round(
    (requirementCompliance * 0.4) +
    (readability * 0.3) +
    (maintainability * 0.3)
  );

  return Math.max(0, Math.min(100, score)); // Clamp between 0-100
}
