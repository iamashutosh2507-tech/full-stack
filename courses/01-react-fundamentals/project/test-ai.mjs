import { reviewCodeWithAI } from '../ai-review/index.js';
const r = await reviewCodeWithAI(
  '21-react-router',
  ['src/App.tsx'],
  'D:/OneDrive/Desktop/full - stack/challenge-engine-react/courses/01-react-fundamentals/project'
);
console.log('score:', r.score);
console.log('error:', r.error);